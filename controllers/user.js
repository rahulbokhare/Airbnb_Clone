
const User = require("../models/user")

module.exports.signupGet = async(req,res) => {
    res.render("user/signup.ejs");
}

module.exports.signupPost = async(req, res, next) => {
    try{
        let { password, username , email} = req.body;
        const newUser = new User({username, email});
        const regUser = await User.register(newUser, password);
        req.login(regUser, (err) => {
            if(err){
                return next(err);
            }
            res.redirect("/listings");
            req.flash("success","user registered successfully");
        })
        console.log("User added successfully");  
        console.log(newUser); 
    }catch(e){
        console.log(e);
        req.flash("error", "user already exist");
        res.redirect("/signup");
    }
}

module.exports.loginGet = async(req,res) => {
    res.render("user/login.ejs");
}

module.exports.loginPost = async(req, res ) => {
        req.flash("success", "welcome to the wanderlust");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        console.log(redirectUrl)
        return res.redirect(redirectUrl);
        
}

module.exports.logoutRoute = (req, res, next) => {
    req.logout((err) => {
        console.log(err);
        if(err){
            return next(err);
        }
        req.flash("success","User logged Out");
        res.redirect("/listings");
    })
}