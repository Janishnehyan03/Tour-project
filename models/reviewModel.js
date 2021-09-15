const mongoose = require("mongoose");
const Tour = require("./tourModel");

const reviewSchema = mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "review cannot be empty"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour", //REFERENCING
      required: [true, "review must belong to a tour"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User", //REFERENCING
      required: [true, "review must belong to a user"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true }, // it means that, when it comes as JSON data or Object data, it will work, otherwise virtuals don't work
    toObject: { virtuals: true },
  }
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// POPULATING USERS AND TOURS
// reviewSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "tour", // path defined on top
//     select: "name", //this is tour name
//   }).populate({
//     path: "user", // path defined on top
//     select: "name photo",
//   }); // multiple "populate for multiple paths"
//   next();
// });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user", // path defined on top
    select: "name photo",
  }); // multiple "populate for multiple paths"
  next();
});

// STATIC METHODS (average)
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: "$tour",
        numRating: { $sum: 1 }, //add 1 to each
        avgRating: { $avg: "$rating" },
      },
    },
  ]);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].numRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.post("save", function () {
  //post don't accept any next()
  this.constructor.calcAverageRatings(this.tour);
});

// update the ratingAverage and Quantity when a user delete the rating
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne(); //just saving whole data to a variable and pass it to down
  // console.log(this.r);
  next();
});
reviewSchema.post(/^findOneAnd/, async function () {
  // findOne doesn't work here, it already executed
  await this.r.constructor.calcAverageRatings(this.r.tour); // Get the tour Id from above function
});
const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
