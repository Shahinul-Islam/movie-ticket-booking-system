const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");
const auth = require("../middleware/auth");

router.get("/", movieController.getAllMovies);
router.get("/upcoming", movieController.getUpcomingMovies);
router.get("/:id", movieController.getMovie);
router.post("/", movieController.createMovie);
router.put("/:id", movieController.updateMovie);
router.delete("/:id", movieController.deleteMovie);

module.exports = router;
