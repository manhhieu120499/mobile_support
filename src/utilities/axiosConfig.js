import axios from "axios";

const axiosConfig = (token) => {
  return axios.create({
    baseURL: "http:///26.246.75.13:8080",
    timeout: 5000,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export default axiosConfig;
