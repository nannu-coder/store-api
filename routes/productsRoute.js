const router = require("express").Router();
const {
  getAllProducts,
  getAllProductsStatic,
} = require("../controllers/productController");

router.route("/static").get(getAllProductsStatic);
router.route("/").get(getAllProducts);

module.exports = router;
