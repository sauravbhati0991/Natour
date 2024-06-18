// import Stripe from'stripe'
import axios from "axios";
import { showAlert } from "./alert";
const stripe = Stripe(
  "pk_test_51PSXqbSBKO8TOFQ3H066gd684NEbAmtcxd21nZht3VUeLJ6EX21B4W9BpF7TRKGNI5gfIIsGIQ9xy6viogRYmtTY00LvtTyWeJ"
);

export const bookTour = async (tourID) => {
  try {
    // get the session from the server
    const session = await axios(`/api/v1/bookings/checkout-session/${tourID}`);

    // create checkout form + credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    showAlert("error", err);
  }
};
