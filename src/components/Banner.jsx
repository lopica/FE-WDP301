import React from "react";
import bannerImage from "../assets/vn-11134210-7r98o-ltza79e2ahwf46.png"; // Cập nhật đường dẫn đến hình ảnh chính xác
import banner2Image from "../assets/banner22.png";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";

const Banner = () => {
  const navigate = useNavigate();

  const handleShopNowClick = () => {
    navigate("/all-category");
  };

  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    slickNext: false,
    slickPrev: false,
  };

  return (
    <div className="flex flex-col md:flex-row items-center bg-gray-200 p-8 h-auto md:h-100 mx-10">
      <div className="md:w-1/2 p-4">
        <h2 className="text-3xl font-bold mb-4">Shop With Confidence</h2>
        <p className="text-lg mb-4">New products are added every week. Check back often to see.</p>
        <button onClick={handleShopNowClick} className="bg-black text-white py-2 px-4 rounded">
          Shop Now
        </button>
      </div>
      <div className="md:w-1/2 p-4">
        <Slider {...settings}>
          <div className="w-full md:h-80 flex items-center justify-center ">
            <div className="relative w-full h-full flex items-center justify-center">
              <img src={banner2Image} alt="Banner" className="max-w-full max-h-full object-contain" />
            </div>
          </div>

          <div className="w-full md:h-80 flex items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center">
              <img src={bannerImage} alt="Banner" className="max-w-full max-h-full object-contain" />
            </div>
          </div>

          <div className="w-full md:h-80 flex items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center">
              <img src={bannerImage} alt="Banner" className="max-w-full max-h-full object-contain" />
            </div>
          </div>

          <div className="w-full md:h-80 flex items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center">
              <img src={bannerImage} alt="Banner" className="max-w-full max-h-full object-contain" />
            </div>
          </div>
        </Slider>
        {/* Nếu bạn muốn sử dụng một hình ảnh đơn lẻ, bỏ chú thích dòng sau và chú thích phần Slider */}
        {/* <img src={bannerImage} alt="Banner" className="w-full h-auto object-cover" /> */}
      </div>
    </div>
  );
};

export default Banner;
