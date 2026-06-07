const User = require('../models/User');
const Product = require('../models/Product');
const { sampleProducts, demoUser } = require('./sampleData');

const ensureDemoData = async () => {
  if (process.env.NODE_ENV !== 'development') return;

  let user = await User.findOne({ email: demoUser.email });
  if (!user) {
    user = await User.create(demoUser);
    console.log(`Demo account created: ${demoUser.email} / ${demoUser.password}`);
  }

  for (const product of sampleProducts) {
    await Product.findOneAndUpdate(
      { productId: product.productId },
      {
        ...product,
        createdAt: new Date(),
        createdBy: user._id,
      },
      { upsert: true, new: true, runValidators: true }
    );
  }

  const total = await Product.countDocuments();
  console.log(`Product catalog ready: ${total} products`);
};

module.exports = ensureDemoData;
