const Razorpay = require("razorpay");
const instance = new Razorpay({
  key_id: "rzp_test_PXZvFNXpJFylGx",
  key_secret: process.env.RAZOR_PAY_SECRET,
});

const Tour = require("../models/tourModel");
const crypto = require("crypto");

const Booking = require("../models/bookingModel");
const catchAsync = require("../utils/catchAsync");
const factory = require("../controllers/handlerFactory");
const User = require("../models/userModel");

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get current booked tour
});

const createBookingCheckout = async (session) => {
  const tour = session.client_reference_id;
  const user = (await User.findOne({ email: session.customer_email })).id;
  const price = session.display_items[0].amount / 100;
  await Booking.create({ tour, user, price });
  console.log(session);
};

exports.createBooking = async (req, res, next) => {
  try {
    const tour = await Tour.findById(req.params.id);
    const options = {
      amount: tour.price * 100, // amount in the smallest currency unit
      currency: "INR",
      receipt: "order_rcptid_11",
    };
    instance.orders.create(options, async function (err, order) {
      await Booking.create({
        tour: req.params.id,
        user: req.user._id,
        razorpay_order_id: order.id,
        price: tour.price,
      });
      res.status(200).json({
        status: "success",
        order,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};
exports.successBooking = async (req, res, next) => {
  try {
    const tour = await Booking.findOneAndUpdate(
      { razorpay_order_id: req.body.razorpay_order_id },
      {
        tour: req.body.tour,
        user: req.user._id,
        razorpay_payment_id: req.body.razorpay_payment_id,
        razorpay_order_id: req.body.razorpay_order_id,
        razorpay_signature: req.body.razorpay_signature,
        price: Math.floor(req.body.price / 100),
      }
    );
    try {
      await verifyPayment(
        req.body.razorpay_payment_id,
        req.body.razorpay_order_id,
        req.body.razorpay_signature
      );
      res.status(200).json({
        status: "success",
        tour,
      });
    } catch (error) {
      res.status(400).send("Payment verification failed");
    }
  } catch (error) {
    next(error);
  }
};
exports.getMyBookings = async (req, res, next) => {
  try {
    let data = await Booking.find({ user: req.user._id, paid: true });
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(error);
  }
};
function verifyPayment(paymentId, orderId, signature) {
  return new Promise(async (resolve, reject) => {
    const hmac = crypto.createHmac("sha256", process.env.RAZOR_PAY_SECRET);
    hmac.update(orderId + "|" + paymentId);
    const calculatedSignature = hmac.digest("hex");
    if (calculatedSignature === signature) {
      await Booking.findOneAndUpdate(
        { razorpay_order_id: orderId },
        { paid: true },
        { new: true }
      );
      resolve();
    } else {
      reject();
    }
  });
}

exports.getBooking = factory.getOne(Booking);
exports.getAllBooking = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
