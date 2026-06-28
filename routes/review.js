const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const { reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { validateReview, isLoggedIn } = require("../middleware.js")
const reviewController = require("../controllers/review.js")

//Review route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.reviewPost));

//delete reviews
router.delete("/:reviewId", isLoggedIn, wrapAsync(reviewController.reveiwDelete))

module.exports = router;