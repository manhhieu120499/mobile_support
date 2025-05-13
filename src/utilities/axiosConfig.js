import axios from "axios";

const axiosConfig = (token) => {
  return axios.create({
    baseURL: "http://172.16.0.113:8080",
    timeout: 5000,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export default axiosConfig;
