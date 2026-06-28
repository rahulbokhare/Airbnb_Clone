
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn , isOwner } = require("../middleware.js");
const { validateListing } = require("../middleware.js")
const listingController = require("../controllers/listing.js")

//Index route
router.get("/",wrapAsync(listingController.index));

//Create Route
router.get("/new", isLoggedIn, wrapAsync(listingController.createGet));
router.post("/", validateListing, wrapAsync(listingController.createPost));

//Show Route
router.get("/:id", wrapAsync(listingController.showRoute));

// UPDATE ROUTE
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editGet));
router.put("/:id", wrapAsync(listingController.editPut));

//Delete route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.deleteRoute));
module.exports = router;