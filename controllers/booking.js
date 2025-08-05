const Booking = require("../models/booking");
const Listing = require("../models/listing");


module.exports.createBooking = async (req, res) => {
  const { id } = req.params;
  const { checkIn, checkOut } = req.body;
  const listing = await Listing.findById(id).populate("bookings");
  const conflict = listing.bookings.some(booking =>
    (new Date(checkIn) < booking.checkOut && new Date(checkOut) > booking.checkIn)
  );
  if (conflict) {
    req.flash("error", "Selected dates are already booked.");
    return res.redirect(`/listings/${id}`);
  }
  const booking = new Booking({
    listing: id,
    user: req.user._id,
    checkIn,
    checkOut
  });
  listing.bookings.push(booking);
  await booking.save();
  await listing.save();

  req.flash("success", "Booking confirmed!");
  res.redirect(`/listings/${id}`);
};

module.exports.viewBooking = async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).populate("listing");
  res.render("bookings/myBookings", { bookings });
};

module.exports.deleteBooking = async (req, res) => {
  const { id } = req.params;
  const booking = await Booking.findById(id);

  if (!booking.user.equals(req.user._id)) {
    req.flash("error", "Unauthorized action.");
    return res.redirect("/my/bookings");
  }

  await Booking.findByIdAndDelete(id);
  req.flash("success", "Booking cancelled.");
  res.redirect("/my/bookings");
};

module.exports.editBooking = async (req, res) => {
  const { id } = req.params;
  const booking = await Booking.findById(id).populate("listing");

  if (!booking) {
    req.flash("error", "Booking not found");
    return res.redirect("/my/bookings");
  }

  if (!booking.user.equals(req.user._id)) {
    req.flash("error", "You do not have permission to edit this booking");
    return res.redirect("/my/bookings");
  }

  const allBookings = await Booking.find({
    listing: booking.listing._id,
    _id: { $ne: booking._id }
  });

  res.render("bookings/editBooking", {
    booking,
    listing: booking.listing,
    allBookings,
  });
};

module.exports.updateBooking = async (req, res) => {
  const { id } = req.params;
  const { checkIn, checkOut } = req.body;

  const booking = await Booking.findById(id).populate("listing");

  if (!booking.user.equals(req.user._id)) {
    req.flash("error", "Unauthorized action.");
    return res.redirect("/my-bookings");
  }
  const newStart = new Date(checkIn);
  const newEnd = new Date(checkOut);
  const overlapping = await Booking.find({
    _id: { $ne: booking._id }, 
    listing: booking.listing._id,
    $or: [
      {
        checkIn: { $lte: newEnd },
        checkOut: { $gte: newStart }
      }
    ]
  });

  if (overlapping.length > 0) {
    req.flash("error", "The selected dates are already booked.");
    return res.redirect("/my/bookings");
  }
  booking.checkIn = newStart;
  booking.checkOut = newEnd;
  await booking.save();

  req.flash("success", "Booking updated!");
  res.redirect("/my/bookings");
};
