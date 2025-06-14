const express=require("express");
const router = express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");

const { isLoggedIn,isAuthor,validateReview } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");


router.post("/",isLoggedIn, validateReview , wrapAsync(reviewController.createReview));

router.delete("/:reviewId",isLoggedIn,isAuthor,wrapAsync(reviewController.destroyReview))

module.exports = router;