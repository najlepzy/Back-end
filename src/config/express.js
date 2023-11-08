import express, { urlencoded } from "express";
import productRouter from "../routes/products.js";
import cartRouter from "../routes/carts.js";
import ProductManager from "../controllers/productManager.js";


import { engine } from "express-handlebars";
import * as path from "path";
import __dirname from "../utils.js";

import { socketIo } from "./socket.js";

const app = express();
app.use(express.json());
app.use(urlencoded({ extended: true }));
/* static */
app.use("/", express.static(__dirname + "/public"));
/* static */
productRouter.use(express.json());
const port = 8081;

/* ws */
const server = socketIo(app);

/* ws */
/* handlebars */

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname + "/views"));

app.get("/", async (req, res) => {
  const productsPath = path.resolve(__dirname, "products.json");
  let products = new ProductManager(productsPath);
  let allProducts = await products.getProducts();
  res.render("home", {
    title: "All Products",
    products: allProducts,
  });
});
app.get("/realtime-products", async (req, res) => {
  const productsPath = path.resolve(__dirname, "products.json");
  let products = new ProductManager(productsPath);
  let allProducts = await products.getProducts();
  res.render("realTimeProducts", {
    title: "realtime products",
    products: allProducts,
  });
});

/* handlebars */
/* products */
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
/* products */


server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

