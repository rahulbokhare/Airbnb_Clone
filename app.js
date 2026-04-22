const express = require("express");
const app = express();
const  mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError");
const wrapAsync = require("./utils/wrapAsync.js");
const {listingSchema} = require("./schema.js");

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({ extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);

const validateListing = (req, res, next) => {
     let {error} = listingSchema.validate(req.body);
            console.log(error);
            if(error){
                throw new expressError(400, error);
            }else{
                next();
            }
}


main()
.catch((err) => {
    console.log(err)
});

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

//Index Route
app.get("/",(req, res) =>{
    res.send("hii I'm root");
});

app.get("/listings",async(req, res) => {
    let listings = await Listing.find();
    res.render("listings/index.ejs", { listings })
});

//Create Route
app.get("/listings/new", wrapAsync(async(req,res) => {
    res.render("listings/new.ejs");
}));

app.post(
        "/listings", 
        validateListing,
        wrapAsync(
        async(req, res, next) => {
            const newListing = new Listing(req.body.listing);
            await newListing.save();
            return res.redirect("/listings");
            console.log("listing done successfully");   
}
));

//Show Route
app.get("/listings/:id", wrapAsync(async (req,res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
}))

// UPDATE ROUTE
//Edit Route
app.get("/listings/:id/edit", wrapAsync(async(req,res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));
app.put("/listings/:id", wrapAsync(async(req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
    console.log("updated successfully");
}));


//Delete route
app.delete("/listings/:id", wrapAsync(async(req,res) => {
        let {id} = req.params;
        await Listing.findByIdAndDelete(id);
        res.redirect("/listings");
        console.log("listing deleted successfully");
    
}));

app.use((err, req, res, next) => {
    let { status = 500, message = "Some Error Occurred" } = err;
    res.render("error.ejs", { err })
})


app.listen(8080,() => {
    console.log("sarver is listening");
});