const express=require("express");
const router = express.Router();
const passport = require("passport");

const wrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectUrl } = require("../middleware.js");
const userConroller = require("../controllers/users.js")

router.route("/signup")
.get(userConroller.renderSignUpForm)
.post(wrapAsync(userConroller.signUp));

router.route("/login")
.get(userConroller.renderLogInForm)
.post(saveRedirectUrl ,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}) ,userConroller.login);

router.get("/logout",userConroller.logout);

module.exports= router;