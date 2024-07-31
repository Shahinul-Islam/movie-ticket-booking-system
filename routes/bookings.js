const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isadmin");

router.post("/", auth, bookingController.createBooking);
router.get("/:id", auth, bookingController.getBooking);
router.get("/user/:userId", auth, bookingController.getUserBookings);
router.patch(
	"/:id/payment",
	auth,
	isAdmin,
	bookingController.updateBookingPaymentStatus
);

module.exports = router;
