import express from 'express';
import path from "path";
import ProductManager from '../controllers/productManager.js'

const productRouter = express.Router();
const currentFileUrl = import.meta.url;
const currentDir = path.dirname(new URL(currentFileUrl).pathname);
const productsPath = path.resolve(currentDir, '..', 'products.json');
const productManager = new ProductManager(productsPath);


productRouter.get('/', async (req, res) => {
    try {
        const limit = req.query.limit;
        const products = await productManager.getProducts();
        if (limit) {
            res.json(products.slice(0, limit));
        } else {
            res.json(products);
        }
    } catch (error) {
        res.status(500).json({ message: 'Error getting products' });
    }
});

productRouter.get('/:id', async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const product = await productManager.getProductById(productId);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error getting product' });
    }
});

productRouter.post('/', async (req, res) => {
    try {
        const newProduct = req.body;
        console.log('Received product data:', newProduct); // Add this log
        const result = productManager.addProduct(newProduct);
        
        if (result.error) {
            console.error('Error adding product:', result.error);
            res.status(400).json({ message: result.error });
        } else {
            res.status(201).json({ message: 'Product added successfully' });
        }
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).json({ message: 'Unexpected error' });
    }
});




productRouter.put('/:id', async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const updatedProductData = req.body;
      
      // Check if the product with the given ID exists
      const product = await productManager.getProductById(productId);
      
      if (product) {
        // Update the existing product's properties without changing its ID
        Object.assign(product, updatedProductData);
        
        // Save the updated product
        await productManager.saveProducts();
        res.json({ message: 'Product updated successfully' });
      } else {
        // If the product doesn't exist, create a new one
        const newProduct = await productManager.addProduct(updatedProductData);
        
        if (newProduct.error) {
          res.status(400).json({ message: newProduct.error });
        } else {
          res.status(201).json({ message: 'Producto created successfully', product: newProduct });
        }
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating product' });
    }
  });

productRouter.delete('/:id', async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        await productManager.deleteProduct(productId); // This method handles product deletion and file update
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product' });
    }
});

export default productRouter;