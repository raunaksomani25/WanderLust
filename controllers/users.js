const User = require("../models/user.js");


module.exports.renderSignUpForm = (req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signUp = async(req,res,next)=>{
    try{
        let {username,email,password} = req.body;
    const newUser=new User({email,username});
    const reg = await User.register(newUser,password);
    req.login(reg,(err)=>{
        if(err){
            return next(err);
        }
        else{
            req.flash("success","Welcome to Wanderlust");
            res.redirect("/listings");
        }
    })
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
    
}


module.exports.renderLogInForm = (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login = async(req,res)=>{
    req.flash("success","Welcome to Wanderlust!! You are logged in.");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}


module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        next(err);
    });
    req.flash("success","You have logged out successfully");
    res.redirect("/listings");
}