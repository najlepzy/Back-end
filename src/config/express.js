import express from "express"
import productRouter from "../routes/products.js"

const expressConnection = express();
expressConnection.use(express.json());
productRouter.use(express.json());
const port = 8081;

expressConnection.use('/api/products', productRouter);

expressConnection.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


