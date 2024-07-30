const User = require("../models/user");
const { verifyToken } = require("../utils/token");

const auth = async (req, res, next) => {
	try {
		const token = req.header("Authorization").replace("Bearer ", "");
		const decoded = await verifyToken(token);
		if (!decoded) {
			throw new Error();
		}
		const user = await User.findOne({ _id: decoded.userId });

		if (!user) {
			throw new Error();
		}

		req.token = token;
		req.user = user;
		next();
	} catch (error) {
		res.status(401).json({ message: "Please authenticate" });
	}
};

module.exports = auth;
