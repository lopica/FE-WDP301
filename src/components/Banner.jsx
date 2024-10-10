import React from "react";
import bannerImage from "../assets/vn-11134210-7r98o-ltza79e2ahwf46.png"; // Cập nhật đường dẫn đến hình ảnh chính xác
import Slider from "react-slick";

const Banner = () => {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <div className="flex flex-col md:flex-row items-center bg-gray-200 p-8 h-auto md:h-100">
      <div className="md:w-1/2 p-4">
        <h2 className="text-3xl font-bold mb-4">Shop With Confidence</h2>
        <p className="text-lg mb-4">New products are added every week. Check back often to see.</p>
        <button className="bg-black text-white py-2 px-4 rounded">Shop Now</button>
      </div>
      <div className="md:w-1/2 p-4">
        <Slider {...settings}>
          <div>
            <img src={bannerImage} alt="Banner" className="w-full h-auto object-cover" />
          </div>
          <div>
            <img src={bannerImage} alt="Banner" className="w-full h-auto object-cover" />
          </div>
          <div>
            <img src={bannerImage} alt="Banner" className="w-full h-auto object-cover" />
          </div>
        </Slider>
        {/* Nếu bạn muốn sử dụng một hình ảnh đơn lẻ, bỏ chú thích dòng sau và chú thích phần Slider */}
        {/* <img src={bannerImage} alt="Banner" className="w-full h-auto object-cover" /> */}
      </div>
    </div>
  );
};

export default Banner;
