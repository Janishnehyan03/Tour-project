const router = require("express").Router({ mergeParams: true }); // access to get parameter from other routes (look at the tourRoutes)
const reviewController = require("../controllers/reviewController");
const authController = require("../controllers/authController");

// --Both routes are working same action--//
//(POST) {{URL}}/tours/:tourId/reviews
//(POST) {{URL}}/reviews
router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo("user"),
    reviewController.setTourUserIds,
    reviewController.createReview
  );
router
  .route("/:id")
  .get(reviewController.getReview)
  .patch(
    authController.protect,
    authController.restrictTo("user", "admin"),
    reviewController.updateReview
  )
  .delete(
    authController.protect,
    authController.restrictTo("user", "admin"),
    reviewController.deleteReview
  );
module.exports = router;
