import axios from "axios";

const axiosConfig = (token) => {
  return axios.create({
    baseURL: "http://192.168.40.53:8080",
    timeout: 5000,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export default axiosConfig;
