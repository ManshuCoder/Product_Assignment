const Product = require('../models/Product');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

const buildProductQuery = (query) => {
  const filter = {};

  if (query.featured === 'true') filter.featured = true;
  if (query.maxPrice) filter.price = { ...filter.price, $lt: Number(query.maxPrice) };
  if (query.minRating) filter.rating = { $gt: mongooseDecimal(query.minRating) };
  if (query.company) filter.company = new RegExp(query.company, 'i');
  if (query.search) filter.name = new RegExp(query.search, 'i');

  return filter;
};

const mongooseDecimal = (value) => {
  const mongoose = require('mongoose');
  return mongoose.Types.Decimal128.fromString(String(value));
};

const getSortOption = (sortBy) => {
  const sortMap = {
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    rating_asc: { rating: 1 },
    rating_desc: { rating: -1 },
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    name_asc: { name: 1 },
  };
  return sortMap[sortBy] || { createdAt: -1 };
};

const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create({ ...req.body, createdBy: req.user._id });
  sendSuccess(res, 201, 'Product created successfully', { product });
});

const getProducts = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
  const skip = (page - 1) * limit;

  const filter = buildProductQuery(req.query);
  const sort = getSortOption(req.query.sort);

  const [products, total] = await Promise.all([
    Product.find(filter).sort(sort).skip(skip).limit(limit),
    Product.countDocuments(filter),
  ]);

  sendSuccess(res, 200, 'Products fetched successfully', { products }, {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    hasNextPage: page * limit < total,
    hasPrevPage: page > 1,
  });
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new AppError('Product not found', 404);
  sendSuccess(res, 200, 'Product fetched successfully', { product });
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) throw new AppError('Product not found', 404);
  sendSuccess(res, 200, 'Product updated successfully', { product });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw new AppError('Product not found', 404);
  sendSuccess(res, 200, 'Product deleted successfully');
});

const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ featured: true }).sort({ rating: -1 });
  sendSuccess(res, 200, 'Featured products fetched successfully', { products });
});

const getProductsBelowPrice = asyncHandler(async (req, res) => {
  const maxPrice = Number(req.params.price);
  if (Number.isNaN(maxPrice)) throw new AppError('Price must be a valid number', 400);

  const products = await Product.find({ price: { $lt: maxPrice } }).sort({ price: 1 });
  sendSuccess(res, 200, `Products below $${maxPrice} fetched successfully`, { products });
});

const getProductsAboveRating = asyncHandler(async (req, res) => {
  const minRating = Number(req.params.rating);
  if (Number.isNaN(minRating) || minRating < 0 || minRating > 5) {
    throw new AppError('Rating must be a number between 0 and 5', 400);
  }

  const products = await Product.find({
    rating: { $gt: mongooseDecimal(minRating) },
  }).sort({ rating: -1 });

  sendSuccess(res, 200, `Products above rating ${minRating} fetched successfully`, { products });
});

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getProductsBelowPrice,
  getProductsAboveRating,
};
