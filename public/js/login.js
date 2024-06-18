import axios from "axios";
import { showAlert } from "./alert";

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:3000/api/v1/Users/login",
      data: {
        email,
        password,
      },
    });
    console.log(res.data.status);
    if (res.data.status === "Success") {
      showAlert("success", "logged in successfully!");
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
      url: "http://127.0.0.1:3000/api/v1/Users/logout",
    });
    if ((res.data.status = "success")) {
      location.reload(true);
    }
    window.location.assign("/");
  } catch (err) {
    location.reload();
    console.log(err.response);
    showAlert("error", "Error logging out! Try again.");
  }
};
