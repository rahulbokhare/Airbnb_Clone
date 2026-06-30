const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const { validateUser } = require("../middleware.js")
const userController = require("../controllers/user.js")

//signup
router.route("/signup")
.get(wrapAsync(userController.signupGet))
.post(validateUser, wrapAsync(userController.signupPost));


//login
router.route("/login")
.get(wrapAsync(userController.loginGet))
.post( (req,res,next)=> {
    console.log("reached login url");
    next();
}, saveRedirectUrl,passport.authenticate("local", {failureRedirect : "/login" , failureFlash: true}), wrapAsync(userController.loginPost));

//logout Route
router.get("/logout" , userController.logoutRoute)

module.exports = router;