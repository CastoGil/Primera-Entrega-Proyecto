import Router from "express";
import productsRouter from "./products.js";
import cartRouter from "./carts.js";

const router = Router();
////DEFINIENDO RUTAS///
router.use("/productos", productsRouter);
router.use("/carrito", cartRouter);

export default router;