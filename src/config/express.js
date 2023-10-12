import express from "express"
import { fileURLToPath } from 'url';
import path from "path";
import ProductManager from "../controllers/productManager.js";

const expressConnection = express();
expressConnection.use(express.json());

const port = 8081;

const currentFileUrl = import.meta.url;
const currentDir = path.dirname(new URL(currentFileUrl).pathname);
const productsPath = path.resolve(currentDir, '..', 'products.json');
const productManager = new ProductManager(productsPath);

expressConnection.get('/products', async (req, res) => {
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

expressConnection.get('/products/:id', async (req, res) => {
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

expressConnection.post('/products', async (req, res) => {
    try {
        const newProduct = req.body;
        await productManager.addProduct(newProduct);
        res.status(201).json({ message: 'Product added successfully' });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ message: 'Error adding product' });
    }
});


expressConnection.put('/products/:id', async (req, res) => {
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
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating product' });
    }
});


expressConnection.delete('/products/:id', async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        await productManager.deleteProduct(productId);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product' });
    }
});

expressConnection.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


