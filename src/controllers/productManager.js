class ProductManager {
    constructor() {
      this.products = [];
      this.nextProductId = 1;
    }
  
    addProduct(product) {
      if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
        console.log('All fields are required.');
        return;
      }
  
      if (this.products.some(existingProduct => existingProduct.code === product.code)) {
        console.log('Code already exists.');
        return;
      }
  
      product.id = this.nextProductId++;
      this.products.push(product);
      console.log('Product successfully added.');
    }
  
    getProducts() {
      return this.products;
    }
  
    getProductById(id) {
      const product = this.products.find(product => product.id === id);
      if (product) {
        return product;
      } else {
        console.log('Product not found.');
        return null;
      }
    }
  }
  
  const manager = new ProductManager();
  
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
  
  console.log(manager.getProducts()); //Show all products
  console.log(manager.getProductById(1)); //Show ID:1 product
  console.log(manager.getProductById(3)); // Show null-ProductNotFound because this product does not exist
