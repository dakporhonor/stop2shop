const router = require("express").Router();
const Product = require("../models/product");
const auth = require("../middleware/auth");
const permit = require('../middleware/permit')
const multer = require("multer");
const DataUri = require("datauri");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const config = require("config");
const {
	check,
	validationResult
} = require("express-validator");

/* All Private routes with admin privilege */
// Create Product
router.post(
	"/",
	[
		check("name", "Product name is required")
		.not()
		.isEmpty(),
		check("type", "Product type is required")
		.not()
		.isEmpty(),
		check("description", "Product description is required")
		.not()
		.isEmpty(),
		check("price", "Product price is required")
		.not()
		.isEmpty()
	],
	auth, permit,
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({
				errors: errors.array()
			});
		}

		try {
			const {
				name,
				description,
				type,
				price
			} = req.body;
			let product = await Product.findOne({
				name,
				type,
				price
			});
			if (product) {
				return res.status(400).json({
					msg: "Product already exist"
				});
			}

			product = new Product({
				name,
				description,
				type,
				price
			});
			await product.save();
			console.log(req.body);
			res.status(200).json(product);
		} catch (error) {
			console.error(error.message);

			res.status(500).send("Server Error");
		}
	}
);

// Upload Product Image
/*
@Private

*/

cloudinary.config({
	cloud_name: config.get("CLOUD_NAME"),
	api_key: config.get("API_KEY"),
	api_secret: config.get("API_SECRET")
});

const upload = multer({
	limits: {
		fileSize: 1500000
	},
	storage: multer.memoryStorage(),
	fileFilter(req, file, done) {
		if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
			return done(new Error("Please upload a image"));
		}
		done(undefined, true);
	}
});

router.post(
	"/:product_ID",
	[auth, permit, upload.single("image")],
	async (req, res) => {
		try {
			const product = await Product.findById(req.params.product_ID);
			if (!product) {
				return res.status(404).json({
					msg: "No product found"
				});
			}
			const datauri = new DataUri();
			datauri.format(
				path.extname(req.file.originalname).toString(),
				req.file.buffer
			);
			cloudinary.uploader.upload(datauri.content, async (error, imageResult) => {
				if (error) throw new Error(error);
				product.image = imageResult.secure_url
				await product.save()
				res.status(200).json(product)
			});

		} catch (error) {
			console.log(error.message);
			res.status(500).send("Server Error");
		}
	}
);
// Get Products
router.get("/", auth, async (req, res) => {
	try {
		const products = await Product.find().sort({
			date: -1
		});
		if (products.length === 0) {
			return res.status(404).json({
				msg: "No Product Found!"
			});
		}
		res.status(200).json(products);
	} catch (error) {
		res.status(500).send("Server Error");
	}
});
// Get Product by Id
router.get("/products/:product_ID", auth, async (req, res) => {
	const product = await Product.findById(req.params.product_ID);

	if (!product) {
		return res.status(404).json({
			msg: "No Product Found!"
		});
	}

	res.status(200).json(product);
});

// Update Product
router.put(
	"/:product_ID",
	[
		[
			check("name", "Product name is required")
			.not()
			.isEmpty(),
			check("type", "Product type is required")
			.not()
			.isEmpty(),
			check("description", "Product description is required")
			.not()
			.isEmpty(),
			check("price", "Product price is required")
			.not()
			.isEmpty(),
			check("image", "Product image is required")
			.not()
			.isEmpty()
		],
		auth,
		permit
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({
				errors: errors.array()
			});
		}

		try {
			const {
				name,
				description,
				price,
				type,
				image
			} = req.body;

			const product = await Product.findByIdAndUpdate({
				_id: req.params.product_ID
			}, {
				name,
				description,
				price,
				type,
				image
			}, {
				new: true
			});

			if (!product) {
				return res.status(404).json({
					msg: "No Product to Update"
				});
			}
		} catch (error) {
			console.error(error.message);
			res.status(500).send("Server Error");
		}
	}
);

// Delete Product
router.delete("/:product_ID", auth, permit, async (req, res) => {
	try {

		// @TODO-- Delete static image from cloudinary
		await Product.findByIdAndDelete(req.params.product_ID);
		res.status(200).json({
			msg: "Product Deleted"
		});
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server Error");
	}
});

module.exports = router;