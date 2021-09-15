import axios from "axios";
import { showAlert } from "./alerts";

// export const signup = async (name,email, password) => {
//   try {
//     const res = await axios({
//       method: "POST",
//       url: "/api/v1/users/signup",
//       data: {
//         name,
//         email,
//         password,
//       },
//     });
//     if (res.data.status === "success") {
//       showAlert("success", "logged in successfully");
//       window.setTimeout(() => {
//         // location.assign("/");
//       }, 1000);
//     }
//   } catch (error) {
//     showAlert("error", error.response.data.message);
//     console.log(error);
//   }
// };
export const login = async (email, password) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/users/login",
      data: {
        
        email,
        password,
      },
    });
    if (res.data.status === "success") {
      showAlert("success", "logged in successfully");
      window.setTimeout(() => {
        location.assign("/");
      }, 1000);
    }
  } catch (error) {
    showAlert("error", error.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "/api/v1/users/logout",
    });
    if (res.data.status === "success") {
      showAlert('dark','logged out successfully')
      location.reload(true); //from the server
    }
  } catch (error) {
    showAlert("error", "Error loggin out, try again !");
  }
};
