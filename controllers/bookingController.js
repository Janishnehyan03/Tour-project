const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Razorpay = require("razorpay");
const instance = new Razorpay({
  key_id: "rzp_test_bHrsVB132Fbm8O",
  key_secret: "vcu9cO2KgYNyQTWIzqff1VUf",
});

const Tour = require("../models/tourModel");
const AppError = require("../utils/appError");
const Booking = require("../models/bookingModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("../controllers/handlerFactory");
const User = require("../models/userModel");
exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get current booked tour
  const tour = await Tour.findById(req.params.tourId);
  const options = {
    amount: tour.price, // amount in the smallest currency unit
    currency: "INR",
    receipt: "order_rcptid_11",
  };
  instance.orders.create(options, function (err, order) {
    res.status(200).json({
      status: "success",
      order,
    });
  });
});

const createBookingCheckout = async (session) => {
  const tour = session.client_reference_id;
  const user = (await User.findOne({ email: session.customer_email })).id;
  const price = session.display_items[0].amount / 100;
  await Booking.create({ tour, user, price });
  console.log(session);
};
exports.webhookCheckout = (req, res, next) => {
  const signature = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return res.status(400).send("webook-error", error);
  }
  if (event.type === "checkout.session.complete")
    createBookingCheckout(event.data.object);
  res.status(200).json({ received: true });
};
exports.createBooking = async (req,res,next) => {
  console.log(req.body);
};
exports.getBooking = factory.getOne(Booking);
exports.getAllBooking = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
