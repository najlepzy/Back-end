import { manager } from './productManager.js';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';

/**
 * Represents a class for managing shopping carts.
 */
class CartManager {
  /**
   * Creates an instance of CartManager.
   * @param {string} filePath - The path to the shopping carts JSON file.
   */
  constructor(filePath) {
    this.path = filePath;
    this.carts = this.loadCarts() || [];
    this.nextCartId = this.calculateNextCartId();
  }

  /**
   * Calculates the next available cart ID.
   * @returns {number} - The next available cart ID.
   */
  calculateNextCartId() {
    const usedIds = this.carts.map(cart => cart.id);
    let nextId = 1;

    while (usedIds.includes(nextId)) {
      nextId++;
    }

    return nextId;
  }

  /**
   * Loads the shopping carts from the JSON file.
   * @returns {Array} - The array of shopping carts.
   */
  loadCarts() {
    if (existsSync(this.path)) {
      try {
        this.carts = JSON.parse(readFileSync(this.path, 'utf8'));
        console.log('Carts loaded successfully.');
        return this.carts;
      } catch (err) {
        console.log('Error loading carts:', err);
        this.carts = [];
        return [];
      }
    } else {
      // If the file doesn't exist, create an empty JSON file
      this.carts = [];
      this.saveCarts(); // This creates an empty carts.json file
      return this.carts;
    }
  }

  /**
   * Saves the shopping carts to the JSON file.
   */
  saveCarts() {
    try {
      writeFileSync(this.path, JSON.stringify(this.carts, null, 2), 'utf8');
      console.log('Carts saved successfully.');
    } catch (err) {
      console.log('Error saving carts:', err);
    }
  }

  /**
   * Creates a new shopping cart.
   * @returns {Object} - The new shopping cart object.
   */
  createCart() {
    const cart = {
      id: this.nextCartId++,
      products: [],
    };

    this.carts.push(cart);
    this.saveCarts();

    return cart;
  }

  /**
   * Gets a shopping cart by its ID.
   * @param {number} id - The ID of the cart to retrieve.
   * @returns {Object|null} - The cart object or null if not found.
   */
  getCartById(id) {
    const cart = this.carts.find(cart => cart.id === id);

    if (!cart) {
      console.log('Cart not found.');
      return null;
    }

    return cart;
  }

  /**
   * Adds a product to a shopping cart.
   * @param {number} cartId - The ID of the cart.
   * @param {number} productId - The ID of the product to add.
   * @param {number} quantity - The number of products to add.
   * @returns {Object} - The updated cart or an error object.
   */
  async addProductToCart(cartId, productId, quantity = 1) {
    const cart = this.getCartById(cartId);

    if (!cart) {
      return { error: 'Cart not found.' };
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return { error: 'Invalid quantity.' };
    }

    // Get the product with the instance of pm (manager)
    const product = manager.getProductById(productId);

    if (!product) {
      return { error: 'Product not found.' };
    }

    const productIndex = cart.products.findIndex(item => item.productId === productId);

    if (productIndex !== -1) {
      // Product existing on cart
      const currentQuantity = cart.products[productIndex].quantity;

      // Verify if the quantity requested exceeds the stock available
      if (currentQuantity + quantity > product.stock) {
        return { error: 'Exceeds available stock.' };
      }

      // Update the quantity in the cart
      cart.products[productIndex].quantity += quantity;
    } else {
      // Product not existing in the cart

      // Verify if the quantity requested exceeds the stock available
      if (quantity > product.stock) {
        return { error: 'Exceeds available stock.' };
      }

      // Add product to the cart
      cart.products.push({ productId, quantity });
    }

    this.saveCarts();

    return cart;
  }

  /**
   * Lists the products in a shopping cart.
   * @param {number} cartId - The ID of the cart.
   * @returns {Array} - The array of products in the cart.
   */
  listCartProducts(cartId) {
    const cart = this.getCartById(cartId);

    if (!cart) {
      return { error: 'Cart not found.' };
    }

    return cart.products;
  }

  /**
   * Removes a product from a shopping cart.
   * @param {number} cartId - The ID of the cart.
   * @param {number} productId - The ID of the product to remove.
   * @returns {Object} - The result message or an error object.
   */
  async removeProductFromCart(cartId, productId) {
    const cart = this.carts.find(cart => cart.id === cartId);
    const productIndex = cart ? cart.products.findIndex(product => product.productId === productId) : -1;

    return !cart ? { error: 'Cart not found' } :
      productIndex === -1 ? { error: 'Product not found in cart' } :
        (cart.products[productIndex].quantity > 1 ?
          (--cart.products[productIndex].quantity, this.saveCarts(), { message: 'Product quantity decreased by 1' }) :
          (cart.products.splice(productIndex, 1), this.saveCarts(), { message: 'Product removed from cart' }));
  }
}

// Use import.meta.url to get the current module's URL
const currentFileUrl = import.meta.url;

// Get the directory name from the URL
const currentDir = path.dirname(new URL(currentFileUrl).pathname);

// Create the absolute path to carts.json
const cartsPath = path.resolve(currentDir, '..', 'carts.json');

// Pass this path to the constructor of CartManager
const cartManager = new CartManager(cartsPath);

export default cartManager;
