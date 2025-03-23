import axiosConfig from "./axiosConfig";

const renderTime = () => {
  const times = [];
  let second = "";
  for (let i = 7; i <= 18; i++) {
    second = i < 10 ? `0${i}` : `${i}`;
    times.push({ time: `${second}:00` });
    if (i < 18) times.push({ time: `${second}:30` });
  }
  return times;
};

const formatPrice = (value) => {
  return value.toLocaleString("vi-VN") + " vn₫";
};

export { axiosConfig, renderTime, formatPrice };
