import axios from "axios";
import { showAlert } from "./alert";

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/Users/login",
      data: {
        email,
        password,
      },
    });
    if (res.data.status === "Success") {
      showAlert("success", "Logged in successfully!");
      window.setTimeout(() => {
        location.assign("/");
      }, 500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "/api/v1/Users/logout",
    });
    if ((res.data.status = "success")) {
      location.reload(true);
    }
    window.location.assign("/");
  } catch (err) {
    location.reload();
    showAlert("error", "Error logging out! Try again.");
  }
};

export const singUp = async (name, email, password, passwordConfirm) => {
  if (!name || !email || !password || !passwordConfirm)
    return showAlert("error", "Please provide all information.");
  if (password !== passwordConfirm)
    return showAlert("error", "Password and Password confirm are different.");
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/Users/signup",
      data: {
        name,
        email,
        password,
        passwordConfirm,
      },
    });
    console.log(res);
    showAlert("success", "Signed up successfully!");
    if (res.data.status === "Success") {
      window.setTimeout(() => {
        location.assign("/");
      }, 800);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
