const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  user: {
    type: Object,
    required: true,
  },
  product: {
    type: Object,
    required: true,
  },
  productQuantity: {
    type: Number,
    required: true,
  },
}, {
  collection: 'carts',
  strict: false,
  versionKey: false
});

module.exports = mongoose.model('Cart', CartSchema);
