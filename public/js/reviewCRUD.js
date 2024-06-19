import axios from "axios";
import { showAlert } from "./alert";

export const newReview = async (e, user, tour, review, rating) => {
  if (!user || !tour || !review || !rating)
    return showAlert("error", "Please provide all information.");
  if (rating === "1") return showAlert("error", "Rating must be above 1.0.");
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/reviews",
      data: {
        user,
        tour,
        review,
        rating,
      },
    });
    showAlert("success", "new review is added.");
    location.reload();
  } catch (err) {
    setTimeout(() => {
      showAlert(
        "error",
        "You already review this tour. You can edit in My Reviews section."
      );
      e.target.innerText = "Add Review";
      e.target.disabled = false;
    }, 1000);
  }
};

export const deleteReview = (reviewId) => {
  try {
    axios({
      method: "DELETE",
      url: `/api/v1/reviews/${reviewId}`,
    });
    showAlert("success", "Review is deleted.");
    location.reload();
  } catch (err) {
    console.log(err);
  }
};

export const updateReview = async (reviewId, review) => {
  try {
    await axios({
      method: "PATCH",
      url: `/api/v1/reviews/${reviewId}`,
      data: {
        review,
      },
    });
    setTimeout(() => {
      showAlert("success", "Review is updated.");
    }, 700);
    // location.reload();
  } catch (err) {
    console.log(err);
  }
};
