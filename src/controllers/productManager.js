import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';

/**
 * Represents a class for managing products.
 */
class ProductManager {
  /**
   * Creates an instance of ProductManager.
   * @param {string} filePath - The path to the products JSON file.
   */
  constructor(filePath) {
    this.path = filePath;
    this.products = this.loadProducts() || [];
    this.nextProductId = this.calculateNextProductId();
  }

  calculateNextProductId() {
    if (this.products.length === 0) {
      return 1;
    } else {
      const maxId = Math.max(...this.products.map(product => product.id));
      return maxId + 1;
    }
  }
  /**
   * Loads the products from the JSON file.
   * @returns {Array} - The array of products.
   */
  loadProducts() {
    if (existsSync(this.path)) {
      try {
        return JSON.parse(readFileSync(this.path, 'utf8'));
      } catch (err) {
        console.log('Error loading products:', err);
        return null;
      }
    } else {
      // If the file doesn't exist, create an empty JSON file
      this.products = [];
      this.saveProducts(); // This creates an empty products.json file
      return this.products;
    }
  }

  /**
   * Saves the products to the JSON file.
   */
  saveProducts() {
    try {
      writeFileSync(this.path, JSON.stringify(this.products, null, 2), 'utf8');
    } catch (err) {
      console.log('Error saving products:', err);
    }
  }

  /**
   * Adds a new product to the manager.
   * @param {Object} product - The product object to add.
   */
  addProduct(product) {
    if (!this.isValidProduct(product)) return;
    if (this.isCodeExists(product.code)) return;

    product.id = this.nextProductId++;
    this.products.push(product);

    this.saveProducts();
    console.log('Product successfully added.');
  }

  /**
   * Validates whether a product is valid or not.
   * @param {Object} product - The product object to validate.
   * @returns {boolean} - True if the product is valid, false otherwise.
   */
  isValidProduct(product) {
    const requiredFields = ['title', 'description', 'price', 'thumbnail', 'code', 'stock'];
    const isValid = requiredFields.every(field => product[field]);

    if (!isValid) console.log('All fields are required.');

    return isValid;
  }

  /**
   * Checks if a product with the given code already exists.
   * @param {string} code - The product code to check.
   * @returns {boolean} - True if the code already exists, false otherwise.
   */
  isCodeExists(code) {
    const exists = this.products.some(product => product.code === code);

    if (exists) console.log('Code already exists.');

    return exists;
  }

  /**
   * Gets all products in the manager.
   * @returns {Array} - The array of products.
   */
  getProducts() {
    return this.products;
  }

  /**
   * Gets a product by its ID.
   * @param {number} id - The ID of the product to retrieve.
   * @returns {Object|null} - The product object or null if not found.
   */
  getProductById(id) {
    const product = this.products.find(product => product.id === id);

    if (!product) console.log('Product not found.');

    return product;
  }

  /**
   * Updates a product in the manager.
   * @param {number} id - The ID of the product to update.
   * @param {Object} newProductData - The new product data to update with. This can be a partial object, containing only the fields that need to be updated.
   */
  updateProduct(id, newProductData) {
    const index = this.products.findIndex(product => product.id === id);

    if (index === -1) {
      console.log('Product not found.');
      return;
    }

    // Merge old and new data, but keep old id
    const updatedProduct = { ...this.products[index], ...newProductData, id: this.products[index].id };

    // Replace old product with updated one
    this.products[index] = updatedProduct;

    // Save updated products list
    this.saveProducts();

    console.log('Product successfully updated.');
  }

  /**
 * Deletes a product from the manager by its ID.
 * @param {number} id - The ID of the product to delete.
 */
  deleteProduct(id) {
    const index = this.products.findIndex(product => product.id === id);

    if (index === -1) {
      console.log('Product not found.');
      return;
    }

    // Remove the product from the array
    this.products.splice(index, 1);

    // Save updated products list
    this.saveProducts();

    console.log('Product successfully deleted.');
  }
}

// Use import.meta.url to get the current module's URL
const currentFileUrl = import.meta.url;

// Get the directory name from the URL
const currentDir = path.dirname(new URL(currentFileUrl).pathname);

// Create the absolute path to products.json
const productsPath = path.resolve(currentDir, '..', 'products.json');

// Pass this path to the constructor of ProductManager
const manager = new ProductManager(productsPath);

manager.addProduct({
  title: 'Alaska House',
  description: 'Alaskan Rustic Home: Experience wilderness living in this charming log cabin, surrounded by mountains and forests. Cozy design, panoramic views, and modern amenities. Your retreat in the Last Frontier.',
  price: 400000,
  thumbnail: `alaskaHouse.imgExample`,
  code: 'P1',
  stock: 1,
});

manager.addProduct({
  title: 'Nevada House',
  description: 'Nevada Mountain Retreat: Discover tranquility in this stunning mountain home nestled in the heart of Nevada. Breathtaking views, modern comforts, and endless outdoor adventures await. Your Nevada sanctuary awaits you',
  price: 350000,
  thumbnail: 'nevadaHouse.imgExample',
  code: 'P2',
  stock: 1,
});
manager.addProduct({
  title: 'Wyoming House',
  description: 'lorem ipsum',
  price: 320000,
  thumbnail: 'wyomingHouse.imgExample',
  code: 'P3',
  stock: 1,
});

console.log(manager.getProducts()); // Show all products
console.log(manager.getProductById(1)); // Show ID:1 product
console.log(manager.getProductById(3)); // Show ID:3 product

// Update product with ID 1
manager.updateProduct(1, {
  title: 'Alaska Hotel',
  description: 'Updated description for testing',
  price: 500000,
  thumbnail: 'updatedAlaskaHotel.imgExample',
  code: 'P1',
  stock: 2,
});

console.log(manager.getProducts()); // Show all products after update

// Delete product with ID 1
manager.deleteProduct(1);

console.log(manager.getProducts()); // Show all products after deletion