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
    const usedIds = this.products.map(product => product.id);
    let nextId = 1;

    while (usedIds.includes(nextId)) {
      nextId++;
    }

    return nextId;
  }
  /**
   * Loads the products from the JSON file.
   * @returns {Array} - The array of products.
   */
  loadProducts() {
    if (existsSync(this.path)) {
      try {
        this.products = JSON.parse(readFileSync(this.path, 'utf8'));
        this.nextProductId = this.calculateNextProductId();
        console.log('Products loaded successfully.');
        return this.products;
      } catch (err) {
        console.log('Error loading products:', err);
        this.products = [];
        return [];
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
      console.log('Products saved successfully.');
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

    // Verify if the product already exists before adding it
    if (!this.isCodeExists(product.code)) {
      product.id = this.nextProductId++;
      this.products.push(product);
      this.saveProducts();
      console.log('Product added successfully.'); // Updated message
    }
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
    const product = this.products.find(p => p.id === id);

    if (!product) {
      console.log('Product not found.');
      return;
    }

    // Update the fields of the existing product with the new data
    for (const key in newProductData) {
      if (key in product) {
        product[key] = newProductData[key];
      }
    }

    // Save updated products to JSON file
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
  thumbnail: 'alaskaHouse.imgExample',
  code: 'P1',
  stock: 1,
});

manager.addProduct({
  title: 'California Villa',
  description: 'Luxurious villa in sunny California: Enjoy the golden state in this modern and spacious villa. With a private pool, palm trees in the garden, and a short drive to the beach.',
  price: 1200000,
  thumbnail: 'californiaVilla.imgExample',
  code: 'P2',
  stock: 1,
});

manager.addProduct({
  title: 'New York Apartment',
  description: 'Stylish apartment in the heart of New York: Live the city life in this chic apartment located in Manhattan. Close to Central Park and Times Square, with an impressive skyline view.',
  price: 800000,
  thumbnail: 'newYorkApartment.imgExample',
  code: 'P3',
  stock: 1,
});

manager.addProduct({
  title: 'Texas Ranch',
  description: 'Spacious ranch in Texas: Experience southern charm in this beautiful ranch. Includes a large field for horses, a barn, and a classic country house.',
  price: 600000,
  thumbnail: 'texasRanch.imgExample',
  code: 'P4',
  stock: 1,
});

manager.addProduct({
  title: 'Florida Beach House',
  description: 'Beachfront house in Florida: Wake up to the sound of waves in this serene beach house. Features a deck overlooking the ocean, open plan living, and easy access to the beach.',
  price: 700000,
  thumbnail: 'floridaBeachHouse.imgExample',
  code: 'P5',
  stock: 1,
});

manager.addProduct({
  title: 'Chicago Loft',
  description: 'Urban loft in Chicago: Enjoy city living in this contemporary loft located in downtown Chicago. Close to shops, restaurants, and Willis Tower.',
  price: 500000,
  thumbnail: 'chicagoLoft.imgExample',
  code: 'P6',
  stock: 1,
});

manager.addProduct({
  title: 'Hawaii Bungalow',
  description: 'Tropical bungalow in Hawaii: Relax in this cozy bungalow located near the beach. Surrounded by tropical plants and flowers, with a view of the Pacific Ocean.',
  price: 600000,
  thumbnail: 'hawaiiBungalow.imgExample',
  code: 'P7',
  stock: 1,
});

manager.addProduct({
  title: 'Colorado Cabin',
  description: 'Mountain cabin in Colorado: Escape to this rustic cabin located in the Rocky Mountains. Perfect for outdoor enthusiasts with opportunities for hiking, skiing, and nature watching.',
  price: 450000,
  thumbnail: 'coloradoCabin.imgExample',
  code: 'P8',
  stock: 1,
});

manager.addProduct({
  title: 'Arizona Adobe Home',
  description: 'Adobe home in Arizona: Experience desert living in this traditional adobe home. Features a cactus garden, stucco fireplace, and stunning sunset views.',
  price: 350000,
  thumbnail: 'arizonaAdobeHome.imgExample',
  code: 'P9',
  stock: 1,
});

manager.addProduct({
  title: 'Washington Townhouse',
  description: 'Townhouse in Washington D.C.: Live near the nation’s capital in this elegant townhouse. Walking distance to landmarks and museums.',
  price: 750000,
  thumbnail: 'washingtonTownhouse.imgExample',
  code: 'P10',
  stock: 1,
});

/* useless info */
/* console.log(manager.getProducts()); */ // Show all products
/* console.log(manager.getProductById(1)); */ // Show ID:1 product
/* console.log(manager.getProductById(3)); */ // Show ID:3 product

// Update product with ID 1
/* manager.updateProduct(1, {
  title: 'Alaska Hotel',
  description: 'Updated description for testing',
  price: 500000,
  thumbnail: 'updatedAlaskaHotel.imgExample',
  code: 'P1',
  stock: 2,
}); */

/* console.log(manager.getProducts()); */ // Show all products after update

// Delete product with ID 1
/* manager.deleteProduct(1); */

/* console.log(manager.getProducts()); */ // Show all products after deletion

/* useless info */
export default ProductManager;