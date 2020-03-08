const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
	owner: {
		type: Schema.Types.ObjectId,
		ref: "User"
	},
	items: [
		{
			name: {
				type: Schema.Types.ObjectId,
				ref: "Product"
			},
			quantity: { type: Number, default: 1 },
			price: { type: Number, default: 0 }
		}
	],
	totalQty: { type: Number, default: 0 },
	totalPrice: { type: Number, default: 0 }
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
