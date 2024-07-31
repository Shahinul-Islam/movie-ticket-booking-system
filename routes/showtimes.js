const express = require("express");
const router = express.Router();
const showtimeController = require("../controllers/showtimeController");
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isadmin");

router.post("/", auth, isAdmin, showtimeController.createShowtime);
router.get("/", showtimeController.getAllShowtimes);
router.get("/:id", showtimeController.getShowtime);
router.put("/:id", auth, isAdmin, showtimeController.updateShowtime);
router.delete("/:id", auth, isAdmin, showtimeController.deleteShowtime);
router.get("/movie/:movieId", showtimeController.getShowtimesByMovie);
router.get("/theater/:theaterId", showtimeController.getShowtimesByTheater);

module.exports = router;
