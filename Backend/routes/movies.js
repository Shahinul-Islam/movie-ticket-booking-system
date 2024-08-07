const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isadmin");

router.get("/", movieController.getAllMovies);
router.get("/upcoming", movieController.getUpcomingMovies);
router.get("/:id", movieController.getMovie);
router.post("/", auth, isAdmin, movieController.createMovie);
router.put("/:id", auth, isAdmin, movieController.updateMovie);
router.delete("/:id", auth, isAdmin, movieController.deleteMovie);

module.exports = router;
