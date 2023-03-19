const Tour = require("../models/tourModel");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Booking = require("../models/bookingModel");
const moment = require("moment/moment");

exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  if (alert === "booking") res.locals.alert = "your booking is successfull";
  next();
};

exports.getOverView = async (req, res) => {
  try {
    const tours = await Tour.find().lean()
    const datas = tours.map((tour) => {
      return {
        name: tour.name,
        description: tour.description,
        difficulty: tour.difficulty,
        rating: tour.rating,
        ratingsAverage: tour.ratingsAverage,
        ratingsQuantity: tour.ratingsQuantity,
        duration: tour.duration,
        price: tour.price,
        maxGroupSize: tour.maxGroupSize,
        summary: tour.summary,
        imageCover: tour.imageCover,
        slug: tour.slug,
        startLocation: tour.startLocation,
        locations: tour.locations,
      };
    })
    res.render("overview", { title: "All Tours", tours: datas });
  } catch (error) {
    res.status(400).json(error);
  }
};
exports.getTour = catchAsync(async (req, res, next) => {
  let tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    fields: "review rating user",
  }).lean()

  if (!tour) {
    return next(new AppError("There is no tour with this name", 404));
  } else {
    let nextDate=moment(tour.startDates[1]).format('DD MMM YYYY')
    res.status(200).render("tour", { title: tour.name, tour,nextDate });
  }
});
exports.getLoginForm = (req, res) => {
  res.status(200).render("login", { title: "login page" });
};
// exports.getSignupForm = (req, res) => {
//   res.status(200).render("signup", { title: "sign up page" });
// };
exports.getAccount = (req, res) => {
  res.status(200).render("account", { title: "Manage Account" });
};
exports.updateUserData = catchAsync(async (req, res) => {
  const updateUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res
    .status(200)
    .render("account", { title: "Manage Account", user: updateUser });
});

//Render booked tours
exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1) Find All Bookings
  const bookings = await Booking.find({ user: req.user.id });
  // 2) Find tours in the returned IDs
  const tourIDs = bookings.map((el) => el.tour); //el is current element
  const tours = await Tour.find({ _id: { $in: tourIDs } });
  console.log(tours);
  res.status(200).render("overview", {
    title: "My Bookings",
    tours,
  });
});
