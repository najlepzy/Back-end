import express from "express"
import productRouter from "../routes/products.js"
import cartRouter from "../routes/carts.js";

const expressConnection = express();
expressConnection.use(express.json());
productRouter.use(express.json());
const port = 8081;

expressConnection.use('/api/products', productRouter);
expressConnection.use('/api/carts', cartRouter);

expressConnection.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


