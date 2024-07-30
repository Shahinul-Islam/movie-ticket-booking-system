const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const authMiddleware = require("../middleware/auth");

router.post("/", authMiddleware, bookingController.createBooking);
router.get("/:id", authMiddleware, bookingController.getBooking);
router.get("/user/:userId", authMiddleware, bookingController.getUserBookings);
router.patch(
	"/:id/payment",
	authMiddleware,
	bookingController.updateBookingPaymentStatus
);

module.exports = router;
