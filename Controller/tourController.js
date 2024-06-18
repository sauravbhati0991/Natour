const multer = require("multer");
const sharp = require("sharp");
const Tour = require("./../Models/tourModel");
const catchAsync = require("./../Utilities/catchAsync");
const AppError = require("../Utilities/appErrors");
const factory = require("./handlerFactory");

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else
    cb(new AppError("Not an image! Please upload only images.", 400), false);
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
exports.UpdateTourImages = upload.fields([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 3 },
]);

//if fileds name is same
// upload.single("image"); -> req.file
// upload.array("images", 5); -> req.files
exports.resizeTourImages = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) return next();

  //imageCover
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.body.imageCover}`);

  // images
  req.body.images = [];
  await Promise.all(
    req.files.images.map(async (files, i) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;
      await sharp(files.buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${filename}`);
      req.body.images.push(filename);
    })
  );
  next();
});

exports.aliastopTours = async (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

exports.getAlltours = factory.getAll(Tour);
// exports.getAlltours = catchAsync(async (req, res, next) => {
//   const features = new APIFeatures(Tour.find(), req.query)
//     .filter()
//     .sort()
//     .limiting()
//     .pagination()[0];
//   const allTours = await features.query;
//   res.status(200).json({
//     app: "Natours",
//     page: new APIFeatures(Tour.find(), req.query).pagination()[1] || 1,
//     status: "success",
//     results: allTours.length,
//     data: {
//       allTours,
//     },
//   });
//   // try {
//   //   // Filtering

//   //   // const query = Tour.find()
//   //   //   .where("duration")
//   //   //   .equals(5)
//   //   //   .where("difficulty")
//   //   //   .equals("easy");
//   //   // console.log(req.query);
//   //   // const queryObj = { ...req.query };
//   //   // const excludedFields = ["page", "sort", "limit", "fields"];
//   //   // excludedFields.forEach((el) => delete queryObj[el]);
//   //   // let querySTR = JSON.stringify(queryObj);
//   //   // querySTR = querySTR.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

//   //   // let query = Tour.find(JSON.parse(querySTR));

//   //   // Sorting

//   //   // if (req.query.sort) {
//   //   //   const sortBy = req.query.sort.split(",").join(" ");
//   //   //   query = query.sort(sortBy); // sort('price ratingsAverage')
//   //   // }

//   //   // Field Limiting

//   //   // if (req.query.fields) {
//   //   //   const fields = req.query.fields.split(",").join(" ");
//   //   //   query = query.select(fields);
//   //   // } else {
//   //   //   query = query.select("-__v");
//   //   // }

//   //   // Pagination

//   //   // const page = req.query.page * 1 || 1;
//   //   // const limit = req.query.limit * 1 || 100;
//   //   // const skip = (page - 1) * limit;
//   //   // query = query.skip(skip).limit(limit); // ?page=2&limit=10,  page-1 = 1-10, page-2 = 11-20

//   //   // if (req.query.page) {
//   //   //   const numTours = await Tour.countDocuments();
//   //   //   if (skip >= numTours) throw new Error("This page dose not exists.");
//   //   // }

//   // } catch (err) {
//   //   res.status(404).json({
//   //     status: "Fail",
//   //     message: err,
//   //   });
//   // }
// });

exports.creatTour = factory.createOne(Tour);
// exports.creatTour = catchAsync(async (req, res, next) => {
//   const newTour = await Tour.create(req.body);
//   res.status(201).json({
//     status: "success",
//     data: {
//       tours: newTour,
//     },
//   });
//   // try {
//   // } catch (err) {
//   //   res.status(400).json({
//   //     status: "fail",
//   //     message: err,
//   //   });
//   // }
// });

exports.gettour = factory.getOne(Tour, { path: "reviews" });
// exports.gettour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findById(req.params.id).populate("reviews"); // Tour.findOne({_id: req.params.id})
//   if (!tour) {
//     return next(new AppError("No tour found with that ID", 404));
//   }
//   res.status(200).json({
//     status: "success",
//     data: {
//       tour,
//     },
//   });
//   // try {
//   // } catch (err) {
//   //   res.status(404).json({
//   //     status: "Fail",
//   //     message: err,
//   //   });
//   // }
// });

exports.UpdateTour = factory.updateOne(Tour);
// exports.UpdateTour = catchAsync(async (req, res, next) => {
//   const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });
//   if (!updatedTour) {
//     return next(new AppError("No tour found with that ID", 404));
//   }
//   res.status(200).json({
//     status: "success",
//     data: {
//       updatedTour,
//     },
//   });
//   // try {
//   // } catch (err) {
//   //   res.status(404).json({
//   //     status: "Fail",
//   //     message: err,
//   //   });
//   // }
// });

exports.deleteTour = factory.deleteOne(Tour);
// exports.deleteTour = catchAsync(async (req, res, next) => {
//   const deleteTour = await Tour.findByIdAndDelete(req.params.id);
//   if (!deleteTour) {
//     return next(new AppError("No tour found with that ID", 404));
//   }
//   res.status(204).json({
//     status: "success",
//     data: null,
//   });
//   // try {
//   // } catch (err) {
//   //   res.status(404).json({
//   //     status: "Fail",
//   //     message: err,
//   //   });
//   // }
// });

exports.getTourStats = catchAsync(async (req, res) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: "$difficulty" },
        numTours: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgrating: { $avg: "$ratingsAverage" },
        avgprice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: { avgprice: 1 },
    },
    // {
    //   $match: { _id: { $ne: "EASY" } },
    // },
  ]);
  res.status(200).json({
    status: "success",
    results: stats.length,
    data: stats,
  });
  // try {
  // } catch (err) {
  //   res.status(404).json({
  //     status: "Fail",
  //     message: err,
  //   });
  // }
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numTourStarts: { $sum: 1 },
        tours: { $push: "$name" },
      },
    },
    {
      $sort: { numTourStarts: -1 },
    },
    {
      $addFields: { month: "$_id" },
    },
    {
      $project: { _id: 0 },
    },
    // {
    //   $limit: 6,
    // },
  ]);
  res.status(200).json({
    status: "success",
    results: plan.length,
    data: {
      plan,
    },
  });
  // try {
  // } catch (err) {
  //   res.status(404).json({
  //     status: "Fail",
  //     message: err,
  //   });
  // }
});
