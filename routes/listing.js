const express=require("express");
const router = express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedIn,validateListing,isOwner} = require("../middleware.js");
const listingController = require("../controllers/listings.js")
const multer  = require('multer')
const {storage} = require("../cloudconfig.js");
const upload = multer({ storage })

router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn, validateListing,upload.single('listing[image]'),wrapAsync(listingController.createListing));

router.get("/new",isLoggedIn,listingController.renderNewForm);
 
router.route("/:id")
.get(wrapAsync(listingController.show))
.put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

 
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderUpdateForm));
 
module.exports = router;