import express from 'express';
import cartManager from '../controllers/cartManager.js';

const cartRouter = express.Router();

// Path to create the cart
cartRouter.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json({
            message: 'Cart created successfully',
            id: newCart.id,
            cart: {
                products: newCart.products
            }
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).json({ message: 'Unexpected error' });
    }
});


// Path to list the products on cart
cartRouter.get('/:cid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const cart = !isNaN(cartId) ? await cartManager.getCartById(cartId) : cartManager.getAllCarts();
        cart ? res.json(cart.products || cart) : res.status(404).json({ message: 'Cart not found' });
    } catch (error) {
        console.error('Error getting cart:', error);
        res.status(500).json({ message: 'Error getting cart' });
    }
});


// Path to adds the product to a cart
cartRouter.post('/:cid/product/:pid', async (req, res) => {
    try {
        const [cartId, productId] = [req.params.cid, req.params.pid].map(Number);
        const result = await cartManager.addProductToCart(cartId, productId);
        result.error ? console.error('Error adding product to cart:', result.error) : res.status(201).json({ message: 'Product added to cart successfully' });
        res.status(result.error ? 400 : 201).json({ message: result.error || 'Product added to cart successfully' });
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).json({ message: 'Unexpected error' });
    }
});

// Path to remove a product from a cart
cartRouter.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const [cartId, productId] = [req.params.cid, req.params.pid].map(Number);
        const result = await cartManager.removeProductFromCart(cartId, productId);
        result.error ? console.error('Error removing product from cart:', result.error) : res.status(200).json({ message: 'Product removed from cart successfully' });
        res.status(result.error ? 400 : 200).json({ message: result.error || 'Product removed from cart successfully' });
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).json({ message: 'Unexpected error' });
    }
});



export default cartRouter;