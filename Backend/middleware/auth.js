const User = require("../models/user");
const { verifyToken } = require("../utils/token");

/**
 * Middleware function to authenticate the user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @return {Promise<void>} - A promise that resolves when the authentication is complete.
 */
const auth = async (req, res, next) => {
	try {
		const token = req.header("Authorization").replace("Bearer ", "");
		const decoded = verifyToken(token);
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
