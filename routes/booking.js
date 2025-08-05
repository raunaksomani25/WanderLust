const express = require("express");
const router = express.Router();
const bookings = require("../controllers/booking.js");
const { isLoggedIn } = require("../middleware");

router.post("/listings/:id/book", isLoggedIn, bookings.createBooking);
router.get("/my/bookings", isLoggedIn,bookings.viewBooking);
router.delete("/bookings/:id", isLoggedIn, bookings.deleteBooking);
router.get("/bookings/:id/edit", isLoggedIn,bookings.editBooking);
router.put("/bookings/:id",isLoggedIn,bookings.updateBooking);


module.exports = router;
