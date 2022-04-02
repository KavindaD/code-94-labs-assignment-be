import express from "express";
import ProductsCtrl from "./products.controller.js"

const router = express.Router();

router.route("/getAll").get(ProductsCtrl.apiGetProducts);
router.route("/getProgramById/:id").get(ProductsCtrl.apiGetProductById);
router.route("/createProduct").post(ProductsCtrl.apiAddProduct);
router.route("/updateProduct").put(ProductsCtrl.apiUpdateProduct);
router.route("/deleteProduct").delete(ProductsCtrl.apiDeleteProduct);

export default router;