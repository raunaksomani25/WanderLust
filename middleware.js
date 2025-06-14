const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("./schema.js");



module.exports.isLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in to create listing");
        res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        console.log(listing.owner._id);
        console.log(res.locals.currUser.__id);
        req.flash("error","You are not the owner of the lisitng");
       return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isAuthor = async (req,res,next)=>{
    let {reviewId,id} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the author of the review");
       return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req,res,next)=>{
    let {err} = listingSchema.validate(req.body);
    if(err){
        let errmess = err.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmess);
    }else{
        next();
    }
}

module.exports.validateReview = (req,res,next)=>{
    let {err} = reviewSchema.validate(req.body);
    if(err){
        let errmess = err.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmess);
    }else{
        next();
    }
}