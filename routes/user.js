const express = require("express");
const router = express.Router();
const {userSchema} = require("../schema.js");
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user.js");
const expressError = require("../utils/expressError");
const passport = require("passport");

const validateUser = (req, res, next) => {
     let {error} = userSchema.validate(req.body);
            console.log(error);
            if(error){
                throw new expressError(400, error.details.map(el => el.message).join(", "));
            }else{
                next();
            }
        }


//signup
router.get("/signup", wrapAsync(async(req,res) => {
    res.render("user/signup.ejs");
}));

router.post("/signup", validateUser, wrapAsync(async(req, res, next) => {
    try{
        let { password, username , email} = req.body;
        const newUser = new User({username, email});
        await User.register(newUser, password);
        res.redirect("/listings");
        req.flash("success","user registered successfully");
        console.log("User added successfully");  
        console.log(newUser); 
    }catch(e){
        console.log(e);
        req.flash("error", "user already exist");
        res.redirect("/signup");
    }
}));

//login
router.get("/login", wrapAsync(async(req,res) => {
    res.render("user/login.ejs");
}));

router.post("/login", passport.authenticate("local", {failureRedirect : "/login" , failureFlash: true}), async(req, res ) => {
    req.flash("success", "welcome to the wanderlust");
    res.redirect("/listings");
});

router.get("/logout" , (req, res, next) => {
    req.logout((err) => {
        console.log(err);
        if(err){
            return next(err);
        }
        req.flash("success","User logged Out");
        res.redirect("/listings");
    })
})



module.exports = router;