const express = require("express");
const router = express.Router();
const bookings = require("../controllers/booking.js");
const { isLoggedIn } = require("../middleware");
const wrapAsync=require("../utils/wrapAsync.js");

router.post("/listings/:id/book", isLoggedIn, wrapAsync(bookings.createBooking));
router.get("/my/bookings", isLoggedIn,wrapAsync(bookings.viewBooking));
router.delete("/bookings/:id", isLoggedIn, wrapAsync(bookings.deleteBooking));
router.get("/bookings/:id/edit", isLoggedIn,wrapAsync(bookings.editBooking));
router.put("/bookings/:id",isLoggedIn,wrapAsync(bookings.updateBooking));


module.exports = router;
