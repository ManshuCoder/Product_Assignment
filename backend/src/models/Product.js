const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: [true, 'Product ID is required'],
      unique: true,
      trim: true,
      uppercase: true,
      match: [/^[A-Z0-9-]+$/, 'Product ID must contain only letters, numbers, and hyphens'],
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      minlength: [2, 'Product name must be at least 2 characters'],
      maxlength: [100, 'Product name cannot exceed 100 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: mongoose.Schema.Types.Decimal128,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot exceed 5'],
      get: (value) => (value != null ? parseFloat(value.toString()) : null),
    },
    createdAt: {
      type: Date,
      required: [true, 'Created date is required'],
      default: Date.now,
    },
    company: {
      type: String,
      required: [true, 'Company is required'],
      trim: true,
      minlength: [2, 'Company name must be at least 2 characters'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true },
  }
);

productSchema.index({ name: 'text' });
productSchema.index({ featured: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: 1 });
productSchema.index({ company: 1 });

module.exports = mongoose.model('Product', productSchema);
