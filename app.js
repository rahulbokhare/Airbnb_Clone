const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");//for edit and delete
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const Listing = require("./models/listing.js");//listing from another file
const Review = require("./models/review.js");
const User = require("./models/user.js")
const { listingSchema , reviewSchema } = require("./schema.js");

const expressError = require("./utils/expressError");
const wrapAsync = require("./utils/wrapAsync.js");


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js")
const UserRouter = require("./routes/user.js");


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

app.use(passport.initialize())
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();

})


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", UserRouter);



app.use((req, res, next) => {
    next(new expressError(404, "page not found"))
})

app.use((err, req, res, next) => {
    let { status = 500, message = "Some Error Occurred" } = err;
    res.status(status).render("error.ejs", { err })
    console.log(err);
})



const port = 8080;
app.listen(port,() => {
    console.log(`server is listening port ${port}`);
});