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

const uploadImageToCloudinary = async (imageUri) => {
  const cloudName = "drfbxuss6";
  const uploadPreset = "picture";
  const data = new FormData();
  data.append("file", {
    uri: imageUri,
    type: "image/jpeg", // hoặc 'image/png'
    name: "upload.jpg",
  });
  data.append("upload_preset", uploadPreset); // Thay thế bằng upload_preset của bạn
  data.append("cloud_name", cloudName); // Thay thế bằng Cloud Name của bạn

  try {
    let response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: data,
      }
    );
    let result = await response.json();
    console.log("Tải ảnh thành công!:", result.secure_url); // URL ảnh trên Cloudinary
    return {
      data: result.secure_url,
      status: "success",
      message: "Tải ảnh thành công",
    };
  } catch (error) {
    return {
      data: "",
      status: "failed",
      message: `Lỗi tải ảnh: ${error.message}`,
    };
  }
};

const formatTime = (selectedDate, time) => {
  return new Date(`${selectedDate}T${`${time}:00`}`).toISOString();
};

const getAllDayBetweenDayStartAndDayEnd = (dayStart, dayEnd) => {
  let dates = [];
  let currentDate = new Date(dayStart);

  while (currentDate <= new Date(dayEnd)) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

export {
  axiosConfig,
  renderTime,
  formatPrice,
  uploadImageToCloudinary,
  formatTime,
  getAllDayBetweenDayStartAndDayEnd,
};
