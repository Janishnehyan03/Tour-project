const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");
// const User = require("./userModel");
const tourSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tour must have a name"],
      unique: [true, "Tour name alreay exist"],
      trim: true,
      minlength: [5, "Requires more than 5 characters"],
      maxlength: [55, "Only accept less than 55 characters"],
      // validate: [validator.isAlpha,"Tour name don't accept any numbers 😢"],
    },
    rating: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1"],
      max: [5, "Rating must below 5"],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Minimum rating is 1"],
      max: [5, "Maximum rating is 5"],
      set: (val) => Math.round(val * 10) / 10, //round average
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    price: {
      type: Number,
      required: [true, "price not entered"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (value) {
          //custom validator
          return value < this.price;
        },
        message: `Discount price {VALUE} should be below regular price`,
      },
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group size"],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"],
      enum: {
        //works only for strings
        values: ["easy", "medium", "difficult"],
        message: "Difficulty is either easy, medium or difficulty",
      },
    },
    summary: {
      type: String,
      required: [true, "A tour must have a description"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    slug: String, //this slug makes the name property lowercase and put --- sign between words
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User", //REFERENCING
      },
    ],
  },
  {
    toJSON: { virtuals: true }, // it means that, when it comes as JSON data or Object data, it will work, otherwise virtuals don't work
    toObject: { virtuals: true },
  }
);
//index: this will help to scan a few documents, it can boost our indexes
// tourSchema.index({ price: 1 });
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: "2dsphere" });
//virtuals don't store in database, it creates a new field in response
tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

// VIRTUAL POPULATE
tourSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "tour", // stored in the Review Model
  localField: "_id",
});
// --MONGOOSE DOCUMENT MIDDLEWARE--

// here this refers to the current document
tourSchema.pre("save", function (next) {
  //pre middleware have a (next) key
  //works before .save() & .create() , not work in .insert() and not for findByIdAnd...
  this.slug = slugify(this.name, { lower: true });
  next();
});

// EMBEDDING
//Get guide's details from guideId
// tourSchema.pre("save",async function (next) { //only works in .save() or .create()
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides=await Promise.all(guidesPromises)
//   next();
// });

// QUERY MIDDLEWARE
// here this refers to the current QUERY, not to the document
tourSchema.pre(/^find/, function (next) {
  //Effects all queries starts with FIND
  this.find({ secretTour: { $ne: true } });
  next();
});

//REFERENCING
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: "guides", //take data from another collection
    select: "-__v -passwordChangedAt", // remove this fields from output
  });
  next();
});

// AGGREGATION MIDDLEWARE (remove secret tour from aggregation)
// tourSchema.pre("aggregate", function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   console.log(this.pipeline());
//   next();
// });

const Tour = mongoose.model("Tour", tourSchema);
module.exports = Tour;
