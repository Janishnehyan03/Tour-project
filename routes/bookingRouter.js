const router = require("express").Router();
const bookingController = require("../controllers/bookingController");
const authController = require("../controllers/authController");
const viewController = require("../controllers/viewController");
router.use(authController.protect);

router.use(viewController.alerts);

router.post('/:id',bookingController.createBooking)
router.post('/success/booking',bookingController.successBooking)
router.post('/user/bookings',bookingController.getMyBookings)
router.use(authController.restrictTo("admin", "lead-guide"));
router.route("/").get(bookingController.getAllBooking);
router
  .route("/:id")
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking)

module.exports = router;
