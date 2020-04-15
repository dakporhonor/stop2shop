const jwt = require("jsonwebtoken");
const config = require("config");

const auth = async (req, res, next) => {
	try {
		const token = req.header("x-auth-token");
		if (!token) {
			return res.status(401).json({
				msg: "Unauthorized. Access Denied!"
			});
		}

		const decoded = await jwt.verify(token, config.get("JWT_SECRET"));
		req.user = decoded.user;
	} catch (error) {
		console.error(error.message);
		res.status(401).send("Token is not Valid");
	}
	next();
};

module.exports = auth;
