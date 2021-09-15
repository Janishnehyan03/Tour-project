const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Tour = require("../models/tourModel");
const AppError = require("../utils/appError");
const Booking = require("../models/bookingModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("../controllers/handlerFactory");
const User = require("../models/userModel");
exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get current booked tour
  const tour = await Tour.findById(req.params.tourId);
  // 2) create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    // success_url: `${req.protocol}://${req.get("host")}/?tour=${
    //   req.params.tourId
    // }&user=${req.user.id}&price=${tour.price}`,
    success_url: `${req.protocol}://${req.get("host")}/my-tours?alert=booking`,
    cancel_url: `${req.protocol}://${req.get("host")}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: [
          `${req.protocol}://${req.get("host")}/img/tours/${tour.imageCover}`,
        ],
        amount: tour.price * 100,
        currency: "INR",
        quantity: 1,
      },
    ],
  });
  // 3) send session to client
  res.status(200).json({
    status: "success",
    session,
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
exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBooking = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
