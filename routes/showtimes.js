const express = require("express");
const router = express.Router();
const showtimeController = require("../controllers/showtimeController");
const auth = require("../middleware/auth");

router.post("/", auth, showtimeController.createShowtime);
router.get("/", showtimeController.getAllShowtimes);
router.get("/:id", showtimeController.getShowtime);
router.put("/:id", auth, showtimeController.updateShowtime);
router.delete("/:id", auth, showtimeController.deleteShowtime);
router.get("/movie/:movieId", showtimeController.getShowtimesByMovie);
router.get("/theater/:theaterId", showtimeController.getShowtimesByTheater);

module.exports = router;
