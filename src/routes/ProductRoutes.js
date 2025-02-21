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

  router.post('/checkout',productController.checkout)
  router.get("/orders",requireSignIn,isAdmin,productController.orders)
  router.get("/orders/:userId",requireSignIn,productController.order)
  router.put("/orders/:orderId",requireSignIn,productController.updateOrderStatus)
  router.get("/search/:keyword",productController.searchBykeyword)

  router.delete('/api/v1/delete-image', (req, res) => {
    const { imageName } = req.body;
  
    // Ensure the imageName is provided
    if (!imageName) {
      return res.status(400).json({ status: 'error', message: 'Image name is required' });
    }
  
    // Define the image path based on your file storage location
    const imagePath = path.join(__dirname, 'uploads', imageName);  // Adjust 'uploads' if your folder is named differently
  
    // Check if the file exists
    fs.unlink(imagePath, (err) => {
      if (err) {
        return res.status(500).json({ status: 'error', message: 'Failed to delete image' });
      }
  
      // If image deleted successfully
      res.json({ status: 'success', message: 'Image deleted successfully' });
    });
  });

module.exports = router;

