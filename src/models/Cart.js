const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
	reference: {
		type: String
	},
	items: [{
		name: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Product"
		},
		quantity: {
			type: Number,
			default: 1
		},
		price: {
			type: Number,
			default: 0
		}
	}],
	totalQty: {
		type: Number,
		default: 0
	},
	totalPrice: {
		type: Number,
		default: 0
	}
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;