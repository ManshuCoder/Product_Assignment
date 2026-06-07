const express = require('express');
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getProductsBelowPrice,
  getProductsAboveRating,
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { productValidation, updateProductValidation } = require('../validators/productValidators');

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products with filtering, search, sort, and pagination
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: sort
 *         schema: { type: string, enum: [price_asc, price_desc, rating_asc, rating_desc, newest, oldest, name_asc] }
 *       - in: query
 *         name: featured
 *         schema: { type: boolean }
 *       - in: query
 *         name: maxPrice
 *         schema: { type: number }
 *       - in: query
 *         name: minRating
 *         schema: { type: number }
 *     responses:
 *       200:
 *         description: List of products
 */
router.get('/', getProducts);

/**
 * @swagger
 * /api/products/featured:
 *   get:
 *     summary: Get featured products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Featured products list
 */
router.get('/featured', getFeaturedProducts);

/**
 * @swagger
 * /api/products/price/below/{price}:
 *   get:
 *     summary: Get products below a price
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: price
 *         required: true
 *         schema: { type: number }
 *     responses:
 *       200:
 *         description: Products below price
 */
router.get('/price/below/:price', getProductsBelowPrice);

/**
 * @swagger
 * /api/products/rating/above/{rating}:
 *   get:
 *     summary: Get products above a rating
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: rating
 *         required: true
 *         schema: { type: number }
 *     responses:
 *       200:
 *         description: Products above rating
 */
router.get('/rating/above/:rating', getProductsAboveRating);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Product details
 */
router.get('/:id', getProductById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created
 */
router.post('/', productValidation, validate, createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Product updated
 */
router.put('/:id', updateProductValidation, validate, updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Product deleted
 */
router.delete('/:id', deleteProduct);

module.exports = router;
