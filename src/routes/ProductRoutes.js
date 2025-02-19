const express = require("express");
const router = express.Router();
const productController = require("../controllers/productControllers");
const { requireSignIn, isAdmin } = require("../middleware/middleware");
const upload = require("../Multer/multer");

// Create product with multiple images
router.post("/products",requireSignIn,isAdmin,upload.fields([
  { name: 'photo1', maxCount: 1 },
  { name: 'photo2', maxCount: 1 },
  { name: 'photo3', maxCount: 1 },
  { name: 'photo4', maxCount: 1 },
  { name: 'photo5', maxCount: 1 }
]),requireSignIn,isAdmin, productController.CreateProduct);
router.put("/product-update/:id", upload.fields([
  { name: 'photo1', maxCount: 1 },
  { name: 'photo2', maxCount: 1 },
  { name: 'photo3', maxCount: 1 },
  { name: 'photo4', maxCount: 1 },
  { name: 'photo5', maxCount: 1 }
]), productController.UpdateProduct);


// // Get a single image from the product by ID and index
  router.get('/allproduct', productController.allProduct);
  router.get('/single-product/:id', productController.product);
  router.delete("/product-delete/:id",productController.deleteProduct)

 

module.exports = router;

