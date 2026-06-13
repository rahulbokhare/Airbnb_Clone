const express = require("express");
const app = express();

const mongoose = require("mongoose");
const Listing = require("./models/listing.js");//listing from another file
const Review = require("./models/review.js");
const path = require("path");

const methodOverride = require("method-override");//for edit and delete
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError");
const wrapAsync = require("./utils/wrapAsync.js");
const { listingSchema , reviewSchema } = require("./schema.js");
const session = require("express-session");
const flash = require("connect-flash");

const listing = require("./routes/listing.js");
const review = require("./routes/review.js")


app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({ extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);



main().then(()=>{console.log("mongo connected")}).catch((err) => {console.log(err)});
async function main() {await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust')};


const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie :{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}

app.use(session(sessionOptions));
app.use(flash());



app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();

})


app.use("/listings", listing);
app.use("/listings/:id/reviews", review);



app.use((req, res, next) => {
    next(new expressError(404, "page not found"))
})

app.use((err, req, res, next) => {
    let { status = 500, message = "Some Error Occurred" } = err;
    res.status(status).render("error.ejs", { err })
})

app.listen(443,() => {
    console.log(`server is listening port ${443}`);
});