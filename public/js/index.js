import "@babel/polyfill";
import { login, logout, singUp } from "./LinLoutSup";
import { updateSettings } from "./updateSettings";
import { bookTour } from "./stripe";
import { newReview, deleteReview, updateReview } from "./reviewCRUD";

const loginForm = document.querySelector(".form--login");
const signupForm = document.querySelector(".form--signup");
const logOutBtn = document.querySelector(".nav__el--logout");
const userDataForm = document.querySelector(".form-user-data");
const userPasswordForm = document.querySelector(".form-user-password");
const bookBtn = document.getElementById("book-tour");
const bookReviewBtn = document.getElementById("book-tour-review");
const ratingInput = document.querySelector(".rating-input");
const valueDisplay = document.querySelector("#valueDisplay");
const reviewUpdate = document.querySelectorAll("#review__update");
const reviewDelete = document.querySelectorAll("#review__delete");

if (ratingInput)
  ratingInput.addEventListener("input", () => {
    valueDisplay.textContent = ratingInput.value;
  });

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });
}

if (signupForm) {
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("passwordConfirm").value;
    const signupBtn = document.getElementById("signup-btn");
    signupBtn.innerText = "Creating your account...";
    singUp(name, email, password, passwordConfirm);
  });
}

if (logOutBtn) {
  logOutBtn.addEventListener("click", logout);
}

if (userDataForm) {
  userDataForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("name", document.getElementById("name").value);
    form.append("email", document.getElementById("email").value);
    form.append("photo", document.getElementById("photo").files[0]);
    updateSettings(form, "data");
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    document.querySelector(".btn--save--password").textContent = "Updating...";
    const passwordCurrent = document.getElementById("password-current").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password-confirm").value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      "password"
    );
    document.querySelector(".btn--save--password").textContent =
      "Save Password";
    document.getElementById("password-current").value = "";
    document.getElementById("password").value = "";
    document.getElementById("password-confirm").value = "";
  });
}

if (bookBtn)
  bookBtn.addEventListener("click", (e) => {
    e.target.textContent = "Processing...";
    const { tourId } = e.target.dataset; // const tourId = e.target.dataset.touId
    bookTour(tourId);
  });

if (bookReviewBtn)
  bookReviewBtn.addEventListener("click", (e) => {
    e.target.innerText = "Adding...";
    e.target.disabled = true;
    const reviewText = document.getElementById("review-input").value;
    const ratingInput = document.querySelector(".rating-input").value;
    const { userId, tourId } = e.target.dataset;
    newReview(e, userId, tourId, reviewText, ratingInput);
    document.getElementById("review-input").value = "";
  });

if (reviewUpdate)
  reviewUpdate.forEach((button) => {
    button.addEventListener("click", (e) => {
      const { reviewId } = e.target.dataset;
      const reviewsText = document.querySelector(
        `textarea[data-review-id='${reviewId}']`
      ).value;
      console.log(reviewId, reviewsText);
      updateReview(reviewId, reviewsText);
    });
  });

if (reviewDelete)
  reviewDelete.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.target.innerText = "Deleting...";
      e.target.disabled = true;
      const { reviewId } = e.target.dataset;
      deleteReview(reviewId);
    });
  });
