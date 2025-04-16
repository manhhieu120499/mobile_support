import axiosConfig from "./axiosConfig";

const renderTime = () => {
  const times = [];
  let second = "";
  for (let i = 7; i <= 18; i++) {
    second = i < 10 ? `0${i}` : `${i}`;
    times.push({ time: `${second}:00` });
    for (let j = 10; j < 60; j = j + 10) {
      if (i < 18) times.push({ time: `${second}:${j}` });
    }
  }
  return times;
};

// format
const formatPrice = (value) => {
  return value.toLocaleString("vi-VN") + " vn₫";
};

const formatTime = (selectedDate, time) => {
  return new Date(`${selectedDate}T${`${time}:00`}`).toISOString();
};

const formatDayOfWeek = (dayOfWeek) => {
  switch (dayOfWeek) {
    case "Mon": {
      return "Thứ Hai";
    }
    case "Tue": {
      return "Thứ Ba";
    }
    case "Wed": {
      return "Thứ Tư";
    }
    case "Thu": {
      return "Thứ Năm";
    }
    case "Fri": {
      return "Thứ Sáu";
    }
    case "Sat": {
      return "Thư Bảy";
    }
    case "Sun": {
      return "Chủ Nhật";
    }
  }
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

const getAllDayBetweenDayStartAndDayEnd = (dayStart, dayEnd) => {
  let dates = [];
  let currentDate = new Date(dayStart);

  while (currentDate <= new Date(dayEnd)) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

function transferTimeToMinutes(timeString) {
  const [hours, minutes, seconds] = timeString.split(":").map(Number);
  return hours * 60 + minutes + (seconds ? seconds / 60 : 0);
}
const findTimeFitToRegisterRoom = () => {
  const currentTime = new Date();
  const currentDate = new Date().toISOString().split("T")[0];
  const timeNestedCurrent = renderTime().find(
    (item) => new Date(`${currentDate}T${item.time}:00`) > currentTime
  );
  if (timeNestedCurrent) {
    const index =
      timeNestedCurrent != undefined
        ? renderTime().findIndex((item) => item.time == timeNestedCurrent.time)
        : -1;
    const result =
      transferTimeToMinutes(
        new Date(
          `${currentDate}T${timeNestedCurrent.time}:00`
        ).toLocaleTimeString()
      ) - transferTimeToMinutes(currentTime.toLocaleTimeString());
    if (index <= renderTime().length - 2) {
      if (result >= 10) return renderTime()[index].time;
      else return renderTime()[index + 1].time;
    } else {
      return "0"; // 0 đại diện cho việc quá giờ đặt phòng
    }
  } else {
    return 0; // nếu không tìm thấy thời gian
  }
};

const formatUTC7 = (time) => {
  const temp = new Date(time)
    .toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
    })
    .split(",")[0];
  const [hour, minutes, second] = temp.split(":").map(Number);
  return `${hour}:${minutes > 10 ? minutes : "00"}`;
};

export {
  axiosConfig,
  renderTime,
  formatPrice,
  uploadImageToCloudinary,
  formatTime,
  getAllDayBetweenDayStartAndDayEnd,
  formatDayOfWeek,
  transferTimeToMinutes,
  findTimeFitToRegisterRoom,
  formatUTC7,
};
