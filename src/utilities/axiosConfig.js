import axios from "axios";

const axiosConfig = (token) => {
  return axios.create({
    baseURL: "http://192.168.1.29:8080",
    timeout: 5000,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export default axiosConfig;
