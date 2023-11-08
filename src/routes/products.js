import express from 'express';
import path from "path";
import ProductManager from '../controllers/productManager.js'
import { socketIo } from '../config/socket.js';

/**
 * Router for product-related requests.
 * @type {express.Router}
 */
const productRouter = express.Router();

/**
 * The URL of the current file.
 * @type {string}
 */
const currentFileUrl = import.meta.url;

/**
 * The directory of the current file.
 * @type {string}
 */
const currentDir = path.dirname(new URL(currentFileUrl).pathname);

/**
 * The path to the products.json file.
 * @type {string}
 */
const productsPath = path.resolve(currentDir, '..', 'products.json');

/**
 * The manager for products.
 * @type {ProductManager}
 */
const productManager = new ProductManager(productsPath);

/**
 * Route for getting all products or a limited number of products.
 */
productRouter.get('/', async (req, res) => {
    try {
        const limit = req.query.limit;
        const products = await productManager.getProducts();
        res.json(limit ? products.slice(0, limit) : products);
    } catch (error) {
        res.status(500).json({ message: 'Error getting products' });
    }
});


/**
 * Route for getting a product by ID.
 */
productRouter.get('/:id', async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const product = await productManager.getProductById(productId);
        product ? res.json(product) : res.status(404).json({ message: 'Product not found' });
    } catch (error) {
        res.status(500).json({ message: 'Error getting product' });
    }
});


/**
 * Route for adding a new product.
 */
productRouter.post('/', async (req, res) => {
    try {
        const newProduct = { ...req.body, status: true }; // Adds the status field with true default value
        console.log('Received product data:', newProduct);
        const result = productManager.addProduct(newProduct);
        io.emit('productAdded', newProduct);

        result.error ?
            (console.error('Error adding product:', result.error), res.status(400).json({ message: result.error })) :
            res.status(201).json({ message: 'Product added successfully' });
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).json({ message: 'Unexpected error' });
    }
});

/**
 * Route for updating an existing product or creating a new one if it doesn't exist.
 */
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
            io.emit('productUpdated', { id: productId, newProductData: updatedProductData });
        } else {
            // If the product doesn't exist, create a new one
            const newProduct = await productManager.addProduct(updatedProductData);

            newProduct.error ? res.status(400).json({ message: newProduct.error }) : res.status(201).json({ message: 'Producto created successfully', product: newProduct });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating product' });
    }
});



/**
 * Route for deleting a product by ID.
 */
productRouter.delete('/:id', async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        await productManager.deleteProduct(productId); // This method handles product deletion and file update
        res.json({ message: 'Product deleted successfully' });
        io.emit('productDeleted', productId);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product' });
    }
});

export default productRouter;
