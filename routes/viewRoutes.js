const router = require("express").Router();
const viewController = require("../controllers/viewController");
const authController = require("../controllers/authController");
const bookingController = require("../controllers/bookingController");

// router.use(authController.isLoggedIn)

router.get(
  "/",
  bookingController.createBookingCheckout,//this will work only if booking created, otherwise never runs
  authController.isLoggedIn,
  viewController.getOverView
); //isLoggedIn is used for unprotected routes
router.get("/tour/:slug", authController.isLoggedIn, viewController.getTour);
router.get("/login", authController.isLoggedIn, viewController.getLoginForm);
// router.get("/signup", authController.isLoggedIn, viewController.getSignupForm);
router.get("/me", authController.protect, viewController.getAccount);
router.get("/my-tours", authController.protect, viewController.getMyTours);
router.post(
  "submit-user-data",
  authController.protect,
  viewController.updateUserData
);
module.exports = router;
