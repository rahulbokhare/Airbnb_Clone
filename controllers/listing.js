const Listing = require("../models/listing");



module.exports.index = async(req, res) => {
    console.log("Inside index controller");

    let listings = await Listing.find();
    console.log("Listings fetched");
    res.render("listings/index.ejs", { listings });
    console.log("Render completed");
}

module.exports.createGet = async(req,res) => {
    res.render("listings/new.ejs");
}

module.exports.createPost = async(req, res, next) => {
            let url = req.file.path;
            let filename = req.file.filename;
            const newListing = new Listing(req.body.listing);
            newListing.owner = req.user._id;
            newListing.image = { url, filename }
            await newListing.save();
            console.log(newListing);
            req.flash("success","New Listing Created");
            return res.redirect("/listings");
            console.log("listing done successfully");   
}

module.exports.showRoute = async (req,res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path : "reviews" , populate :{path : "author"}}).populate("owner");
    if(!listing){
        req.flash("error","Listing you are searching for does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}

module.exports.editGet = async(req,res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you are searching for does not exist");
        return res.redirect("/listings");
    }
    let originalUrl = listing.image.url;
    originalImgUrl = originalUrl.replace("/upload","/upload/h_200,w_300")
    res.render("listings/edit.ejs", { listing , originalImgUrl });
}

module.exports.editPut = async(req, res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

        if(typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success","listing updated successfully");
    res.redirect(`/listings/${id}`);
    console.log("updated successfully");
}

module.exports.deleteRoute = async(req,res) => {
        let {id} = req.params;
        await Listing.findByIdAndDelete(id);
        req.flash("success","listing deleted successfully");
        res.redirect("/listings");
        console.log("listing deleted successfully");
}