import express, { urlencoded } from "express";
import productRouter from "../routes/products.js";
import cartRouter from "../routes/carts.js";
import ProductManager from "../controllers/productManager.js";
import { SocketIo } from "./socket.js";

import { engine } from "express-handlebars";
import * as path from "path";
import __dirname from "../utils.js";

const expressConnection = express();
expressConnection.use(express.json());
expressConnection.use(urlencoded({ extended: true }));
/* static */
expressConnection.use("/", express.static(__dirname + "/public"));
/* static */
productRouter.use(express.json());
const port = 8081;

/* handlebars */

expressConnection.engine("handlebars", engine());
expressConnection.set("view engine", "handlebars");
expressConnection.set("views", path.resolve(__dirname + "/views"));

expressConnection.get("/", async (req, res) => {
  const productsPath = path.resolve(__dirname, "products.json");
  let products = new ProductManager(productsPath);
  let allProducts = await products.getProducts();
  res.render("home", {
    title: "All Products",
    products: allProducts,
  });
});
expressConnection.get("/realtime-products", async (req, res) => {
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
expressConnection.use("/api/products", productRouter);
expressConnection.use("/api/carts", cartRouter);
/* products */

const server = expressConnection.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

SocketIo(server);
