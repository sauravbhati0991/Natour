import axios from "axios";
import { showAlert } from "./alert";

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
