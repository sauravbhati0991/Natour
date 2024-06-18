import axios from "axios";
import { showAlert } from "./alert";

// type is either 'password' or 'data

export const updateSettings = async (data, type) => {
  try {
    const url =
      type === "password"
        ? "/api/v1/Users/updateMyPassword"
        : "/api/v1/Users/updateMe";
    const res = await axios({
      method: "PATCH",
      url,
      data,
    });
    if (res.data.status === "Success" || "success") {
      showAlert("success", `${type.toUpperCase()} updated successsfully!`);
      setTimeout(() => {
        location.reload();
      }, 500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
