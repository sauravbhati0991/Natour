const mongoose = require("mongoose");
const slugify = require("slugify");
const { trim } = require("validator");
// const validator = require("validator");
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, "A Tour must have a name"],
      trim: true,
      maxlength: [
        40,
        "A tour name must have less than or equal to 40 characters.",
      ],
      minlength: [
        10,
        "A tour name must have more than or equal to 10 characters.",
      ],
      //   validate: [
      //     validator.isAlpha,
      //     "Tour name must only constains characters.",
      //   ], // 'isAlpha' not constains numbers or spaces
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "A Tour must have a duration."],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A Tour must have a max group size"],
    },
    difficulty: {
      type: String,
      required: [true, "A Tour must have a difficulty"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty is either: easy, medium, difficult",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5"],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A Tour must have a price"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price; // this. only points to current doc on New document creation
        },
        message: "Discount price ({VALUE}) should be below regular price .",
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "A Tour must have a summary"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      trim: true,
      required: [true, "A Tour must have a cover image"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      // GeoJson
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
    // guides: Array,   // Embeding
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// tourSchema.index({ price: 1 });
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });

tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

// Virtual populate
tourSchema.virtual("reviews", {
  ref: "Reviews",
  foreignField: "tour",
  localField: "_id",
});

// Document Middleware, runs before and after .save() and .create()
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

/////////////////////////////////////
// Embedding
// tourSchema.pre("save", async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

/////////////////////////////////////////////

// tourSchema.post("save", function (doc, next) {
//   console.log(doc);
//   next();
// });

// Query Middleware, runs before and after .find()
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: "guides",
    select: "-__v -passwordChangedAt",
  });
  next();
});
// tourSchema.post(/^find/, function (doc, next) {
//   // console.log(`Query took ${Date.now() - this.start} milliseconds!`);
//   next();
// });

// Aggregation Middleware, run before and after aggregation
tourSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
