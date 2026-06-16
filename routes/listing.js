
const express = require("express");
const router = express.Router();
const expressError = require("../utils/expressError");
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");



const validateListing = (req, res, next) => {
     let {error} = listingSchema.validate(req.body);
            console.log(error);
            if(error){
                throw new expressError(400, error.details.map(el => el.message).join(", "));
            }else{
                next();
            }
}

//Index route
router.get("/",async(req, res) => {
    let listings = await Listing.find();
    res.render("listings/index.ejs", { listings })
    
});

//Create Route
router.get("/new", isLoggedIn, wrapAsync(async(req,res) => {
    res.render("listings/new.ejs");
}));

router.post(
        "/", validateListing, wrapAsync(async(req, res, next) => {
            const newListing = new Listing(req.body.listing);
            await newListing.save();
            req.flash("success","New Listing Created");
            return res.redirect("/listings");
            console.log("listing done successfully");   
}
));

//Show Route
router.get("/:id", wrapAsync(async (req,res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error","Listing you are searching for does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}))

// UPDATE ROUTE
//Edit Route
router.get("/:id/edit", isLoggedIn, wrapAsync(async(req,res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you are searching for does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}));
router.put("/:id", wrapAsync(async(req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","listing updated successfully");
    res.redirect(`/listings/${id}`);
    console.log("updated successfully");
}));


//Delete route
router.delete("/:id", isLoggedIn, wrapAsync(async(req,res) => {
        let {id} = req.params;
        await Listing.findByIdAndDelete(id);
        req.flash("success","listing deleted successfully");
        res.redirect("/listings");
        console.log("listing deleted successfully");
}));

module.exports = router;