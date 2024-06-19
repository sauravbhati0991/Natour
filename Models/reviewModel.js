const mongoose = require("mongoose");
const Tour = require("./tourModel");

const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: [1, "Rating must be above 1.0"],
      max: [5, "rating must be below 5"],
    },
    review: {
      type: String,
      required: [true, "Review can not be empty!"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: [true, "Review must belong to a tour."],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user."],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.statics.clacAverageRatings = async function (tourID) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourID },
    },
    {
      $group: {
        _id: "$tour",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);
  console.log(stats);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourID, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourID, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.post("save", function () {
  this.constructor.clacAverageRatings(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await Review.findOne(this);
  console.log(this.r);
  next();
});
reviewSchema.post(/^findOneAnd/, async function (next) {
  await this.r.constructor.clacAverageRatings(this.r.tour);
});

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "tour",
    select: "name",
  }).populate({
    path: "user",
    select: "name photo",
  });

  // this.populate({
  //   path: "user",
  //   select: "name photo",
  // });
  next();
});
const Review = mongoose.model("Reviews", reviewSchema);

module.exports = Review;
