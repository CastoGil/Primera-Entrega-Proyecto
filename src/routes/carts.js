import express from "express";
import Cart from "../classes/cart.js";
import Product from "../classes/product.js";
const router = express.Router();
const cartFileName = "cart.json";
const cartObj = new Cart(cartFileName);
const productFileName = "products.json";
const productObj = new Product(productFileName);
////rutas//
router.get("/:id/productos", async (req, res) => {
  try {
    if (isNaN(req.params.id)) {
      return res.status(400).json({
        error: "You have to send a valid id!",
      });
    }
    const id = parseInt(req.params.id);
    const productsCart = await cartObj.getCartById(id);
    return res.status(200).json({
      productsCart,
    });
  } catch (error) {
    return res.status(400).json({
      error: error,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    await cartObj.createCart();
    const carts = await cartObj.getAllProductsInCart();
    let idLastCartAdded = carts[carts.length - 1].id;
    return res.status(201).json({
      msg: `cart ${idLastCartAdded} successfully created`,
    });
  } catch (error) {
    return res.status(400).json({
      error: error,
    });
  }
});

router.post("/:id/productos/:id_prod", async (req, res) => {
  try {
    if (isNaN(req.params.id) || isNaN(req.params.id_prod)) {
      return res.status(400).json({
        error: "You have to send valid parameters!",
      });
    }
    const cartId = parseInt(req.params.id);
    const productId = parseInt(req.params.id_prod);
    const cartSelected = await cartObj.getCartById(cartId);
    const productToAdd = await productObj.getById(productId);
    await cartObj.AddNewProductToCart(cartSelected.id, productToAdd);
    return res.status(201).json({
      msg: "product added to cart successfully",
    });
  } catch (error) {
    return res.status(400).json({
      error: error,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    if (isNaN(req.params.id)) {
      return res.status(400).json({
        error: "You have to send a valid id!",
      });
    }
    const id = parseInt(req.params.id);
    await cartObj.deleteById(id);
    return res.status(200).json({
      msg: "cart deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      error: error,
    });
  }
});

router.delete("/:id/productos/:id_prod", async (req, res) => {
  try {
    if (isNaN(req.params.id) || isNaN(req.params.id_prod)) {
      return res.status(400).json({
        error: "You have to send valid parameters!",
      });
    }
    const cartId = parseInt(req.params.id);
    const productId = parseInt(req.params.id_prod);
    const cart = await cartObj.getCartById(cartId);
    await cartObj.deleteProductInCartById(cartId, productId);
    return res.status(200).json({
      msg: "product removed from cart successfully",
    });
  } catch (error) {
    return res.status(400).json({
      error: error,
    });
  }
});

export default router;
