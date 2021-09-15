import axios from "axios";
import { showAlert } from "./alerts";
// import Stripe from "stripe";
export const bookTour = async (tourId) => {
  try {
    const stripe = Stripe(
      "pk_test_51JZZ7eSAxKBwoS4hffwoy2M638J4YZNlp8UbwOsNCp0o9S29l4ulhXRVckqnxg0NFoKYNWz54JYWjeVllfcwBIfr00rtQbnFaT"
    );
    // 1) Get session from server
    const session = await axios({
      url: `/api/v1/bookings/checkout-session/${tourId}`,
    });
    // 2) Create checkout form automatically + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (error) {
    showAlert("error", error);
  }
};
