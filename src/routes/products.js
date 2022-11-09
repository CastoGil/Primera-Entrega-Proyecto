import express from "express";
const router = express.Router();
import Product from "../classes/product.js";
import { body, validationResult } from "express-validator";

const fileName = "products.json";
const productObj = new Product(fileName);
const isAdmin = true;//////SOLO ADMINISTRADORES///


///RUTAS DE PRODUCTOS////
router.get("/", async (req, res) => {
  try {
    let productArray = await productObj.getAll();
    res.status(200).json({
      productArray,
    });
  } catch (error) {
    return res.status(400).json({
      error: error,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    if (isNaN(req.params.id)) {
      return res.status(400).json({
        error: "Tiene que enviar un id válido!",
      });
    }
    const id = parseInt(req.params.id);
    const product = await productObj.getById(id);
    return res.status(200).json({
      product,
    });
  } catch (error) {
    return res.status(400).json({
      error: error,
    });
  }
});

router.post(
  "/",
  body("title").not().isEmpty().isString().trim().escape(),
  body("description").not().isEmpty().isString().trim().escape(),
  body("code").not().isEmpty().isString().trim().escape(),
  body("photo").not().isEmpty().isString().trim(),
  body("value").not().isEmpty().isDecimal({ min: 1.0 }),
  body("stock").not().isEmpty().isInt({ min: 1 }),
  async (req, res) => {
    try {
      if (!isAdmin) {
        return res.status(403).json({
          error: -1,
          descripcion: "ROUTE unauthorized api/products/ and POST method",
        });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errores: errors.array() });
      }

      const body = req.body;
      await productObj.saveProduct(body);
      return res.status(201).json({
        msg: "product saved successfully",
      });
    } catch (error) {
      return res.status(400).json({
        error: error,
      });
    }
  }
);

router.put(
  "/:id",
  body("title").not().isEmpty().isString().trim().escape(),
  body("description").not().isEmpty().isString().trim().escape(),
  body("code").not().isEmpty().isString().trim().escape(),
  body("photo").not().isEmpty().isString().trim(),
  body("value").not().isEmpty().isDecimal({ min: 1.0 }),
  body("stock").not().isEmpty().isInt({ min: 1 }),
  async (req, res) => {
    try {
      if (!isAdmin) {
        return res.status(403).json({
          error: -1,
          descripcion: `ROUTE api/productos/${req.params.id} and unauthorized PUT method`,
        });
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errores: errors.array() });
      }

      if (isNaN(req.params.id)) {
        return res.status(400).json({
          error: "You have to send a valid id!",
        });
      }

      const id = parseInt(req.params.id);
      const body = req.body;

      await productObj.updateProduct(id, body);
      return res.status(200).json({
        msg: "product upgraded successfully",
      });
    } catch (error) {
      return res.status(400).json({
        error: error,
      });
    }
  }
);

router.delete("/:id", async (req, res) => {
  try {
    if (!isAdmin) {
      return res.status(403).json({
        error: -1,
        descripcion: `ROUTEapi/productos/${req.params.id} and unauthorized DELETE method`,
      });
    }

    if (isNaN(req.params.id)) {
      return res.status(400).json({
        error: "You have to send a valid id!",
      });
    }
    const id = parseInt(req.params.id);
    await productObj.deleteById(id);
    return res.status(200).json({
      msg: "product removed successfully",
    });
  } catch (error) {
    return res.status(400).json({
      error: error,
    });
  }
});

export default router;