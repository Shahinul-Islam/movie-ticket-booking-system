const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "1234"; // Use an environment variable in production
const JWT_EXPIRES_IN = "1d"; // Token expires in 1 day

exports.generateToken = (userId) => {
	return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

exports.verifyToken = (token) => {
	try {
		return jwt.verify(token, JWT_SECRET);
	} catch (error) {
		return null;
	}
};
