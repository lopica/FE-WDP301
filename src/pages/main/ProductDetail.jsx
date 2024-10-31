import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "@/App";
import { useNavigate, useParams } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";
import { CiShoppingCart } from "react-icons/ci";
import Slider from "react-slick";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Tabs } from "@/components/TabUnderline";
import { Button } from "@/components/ui/button";
// import TryOn from "@/components/TryOn";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [filter, setFilter] = useState(null);
  const [error, setError] = useState("");
  const [currentImage, setCurrentImage] = useState(null);
  const [showSlider, setShowSlider] = useState(true); // State to manage slider visibility
  const { userAuth, setUserAuth } = useContext(UserContext);
  const navigate = useNavigate();
  const shippingRate = 35000;
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:9999/api/product/get-detail-product/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(()=>{console.log(product)},[product])

  if (!product) {
    return <div>Loading...</div>;
  }

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 5000,
    autoplaySpeed: 5000,
  };

  const handleQuantityChange = (delta) => {
    const maxQuantity = selectedColor && selectedSize ? getStockForSelectedColorSize() : product.stock;
    setQuantity((prevQuantity) => Math.min(Math.max(1, prevQuantity + delta), maxQuantity));
  };

  const handleQuantityInputChange = (event) => {
    const value = Math.max(1, Math.min(Number(event.target.value), getStockForSelectedColorSize()));
    setQuantity(value);
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setSelectedSize(null);
    setQuantity(1);
    setError("");
    const colorDetail = product.stockDetails.find((detail) => detail.colorCode === color);
    if (colorDetail && colorDetail.imageLink) {
      setCurrentImage(colorDetail.imageLink);
      setShowSlider(false); // Hide slider if specific image exists for the color
    } else {
      setShowSlider(true); // Show slider if no specific image exists for the color
    }
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setQuantity(1);
    setError("");
  };

  const handleAddToCart = async () => {
    if (!selectedColor || !selectedSize) {
      setError("Please select a color and a size.");
      return;
    }
    const totalPrice = quantity * product.price;
    const userId = userAuth?.user?.id;
    if (userId === undefined) {
      localStorage.setItem("productSelection", JSON.stringify({ productId: id, selectedColor, selectedSize, quantity }));
      toast.error("Please login to add items to your cart.");
      navigate("/login");
      return;
    }
    const colorDetail = product.stockDetails.find((detail) => detail.colorCode === selectedColor);
    const thumbnail = colorDetail && colorDetail.imageLink ? colorDetail.imageLink : product.thumbnail;
    // console.log("Thumbnail to be used:", thumbnail); // Debugging line to verify thumbnail selection
    const cartItem = {
      productTitle: product.title,
      productId: product._id,
      thumbnail: thumbnail,
      color: selectedColor,
      size: selectedSize,
      quantity: quantity,
      price: product.price,
    };
    try {
      const response = await axios.post(`http://localhost:9999/api/cart/add-product-to-cart`, {
        userId: userId,
        cartItem: cartItem,
        totalPrice: totalPrice,
      });
      if (response.status === 201) {
        toast.success("Product added to cart successfully!");
      } else {
        toast.error("Failed to add product to cart.");
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
      toast.error("An error occurred while adding the product to cart.");
    }
  };
  const calculateTotal = (subtotal) => {
    const subtotalNumber = parseFloat(subtotal.replace(/,/g, ""));
    return (subtotalNumber + shippingRate).toLocaleString("en-US");
  };
  const handleBuyNow = async () => {
    const userId = userAuth?.user?.id;
    if (userId === undefined) {
      localStorage.setItem("productSelection", JSON.stringify({ productId: id, selectedColor, selectedSize, quantity }));
      toast.error("Please login to add items to your cart.");
      navigate("/login");
      return;
    }
    if (!selectedColor || !selectedSize) {
      setError("Please select a color and a size.");
      return;
    }

    const subtotal = (quantity * product.price).toLocaleString("en-US");
    const total = calculateTotal(subtotal);
    const colorDetail = product.stockDetails.find((detail) => detail.colorCode === selectedColor);
    const thumbnail = colorDetail && colorDetail.imageLink ? colorDetail.imageLink : product.thumbnail;
    // console.log("Thumbnail to be used:", thumbnail); // Debugging line to verify thumbnail selection
    const buyItem = {
      productTitle: product.title,
      productId: product._id,
      thumbnail: thumbnail,
      color: selectedColor,
      size: selectedSize,
      quantity: quantity,
      price: product.price,
    };

    navigate("/checkout", {
      state: {
        products: [
          {
            productTitle: product.title,
            productId: product._id,
            thumbnail: thumbnail,
            color: selectedColor,
            size: selectedSize,
            quantity: quantity,
            price: product.price,
          },
        ],
        subtotal,
        shipping: shippingRate,
        total,
      },
    });
  };

  const getStockForSelectedColorSize = () => {
    const colorDetails = product.stockDetails.find((detail) => detail.colorCode === selectedColor);
    const sizeDetail = colorDetails ? colorDetails.details.find((s) => s.size === selectedSize) : null;
    return sizeDetail ? sizeDetail.quantity : 0;
  };

  const filteredReviews = filter ? product.reviews.filter((review) => review.rating === filter) : product.reviews;
  const availableSizes = selectedColor
    ? product.stockDetails
        .find((detail) => detail.colorCode === selectedColor)
        ?.details.filter((d) => d.quantity > 0)
        .map((d) => d.size)
    : [];
  const availableStock = selectedColor && selectedSize ? getStockForSelectedColorSize() : product.stock;
  // Filter out colors that have no available stock in any size
  const availableColors = product.stockDetails.filter((detail) => detail.details.some((sizeDetail) => sizeDetail.quantity > 0));

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
  };

  return (
    <>
      <div className="container mx-auto p-6 bg-white rounded mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ======================================= product image ======================================= */}
          <div>
            <div className="flex justify-center items-center">
              <div className="w-2/3">
                {showSlider ? (
                  <Slider {...settings}>
                    {product.images.map((image, index) => (
                      <div key={index}>
                        <div className="m-5 flex justify-center">
                          <img src={image} alt={`${product.title} - Image ${index + 1}`} className="h-auto rounded-lg" />
                        </div>
                      </div>
                    ))}
                  </Slider>
                ) : (
                  <div className="m-5 flex justify-center items-center">
                    <img src={currentImage} alt={product.title} className="w-full h-full rounded-lg" />
                  </div>
                )}
              </div>
            </div>
            {/* <div className="pt-10">
              <TryOn />
            </div> */}
          </div>
          <div className="flex-1">
            {/* ======= Product Title ======= */}
            <div className="flex mb-2 justify-between items-center">
              <h1 className="text-3xl font-bold ">{product.title}</h1>
              <div className=" px-4 py-1 text-green-600 bg-green-100 rounded-md font-bold">{product.availabilityStatus}</div>
            </div>
            {/* <h2 className="mb-2 font-medium">{`${product.brand.name} ${product.type.name} for ${product.category.name}.`}</h2> */}
            {/* ======================================= rating ======================================= */}
            <div className="flex items-center mb-2">
              {[...Array(5)].map((_, i) => (product.rating > i ? <FaStar key={i} className="text-yellow-500" /> : <FaRegStar key={i} className="text-gray-300" />))}
              <span className="text-gray-600 ml-2">({product.rating} rating)</span>
            </div>
            {/* ======================================= price ======================================= */}
            {/* <div className="p-2 bg-gray-100 w-1/2 flex items-center"> */}
            <p className="text-xl text-red-500 font-semibold mb-6">{formatCurrency(product.price)}</p>
            {/* </div> */}
            <p className="mb-2">
              It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less
              normal distribution of letters.
            </p>
            {/* ======================================= availability status ======================================= */}
            {/* <div className="flex items-center mb-4">
              <span className="text-gray-700">Status:</span>
              <span className="text-green-500 font-bold ml-2">{product.availabilityStatus}</span>
            </div> */}
            {/* ======================================= color select ======================================= */}
            <span className="text-gray-700 font-bold">Color:</span>
            <div className="flex space-x-2 mt-2">
              {availableColors.map((detail) => (
                <div
                  key={detail.colorCode}
                  className={`w-5 h-5 rounded-full cursor-pointer border-2 ${selectedColor === detail.colorCode ? `ring-2 ring-offset-2` : ""}`}
                  style={{ backgroundColor: detail.colorCode }}
                  onClick={() => handleColorSelect(detail.colorCode)}
                ></div>
              ))}
            </div>
            {/* Size select */}
            {selectedColor && (
              <div className="mt-4">
                <span className="text-gray-700 font-bold">Size:</span>
                <div className="flex space-x-2 mt-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      className={`px-3 py-1 border-[1px] rounded ${selectedSize === size ? "bg-black font-medium text-white border-black" : "bg-white text-black border-black"}`}
                      onClick={() => handleSizeSelect(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {/* ======================================= quantity  ======================================= */}
            <div className="mt-4">
              <span className="text-gray-700 font-bold">Quantity :</span>
              <span className="text-gray-600 ml-1">{availableStock} pieces available</span>
              <div className="flex items-center mb-10 mt-2">
                {/* <div className="flex items-center mx-4">
                  <button onClick={() => handleQuantityChange(-1)} className="px-2 py-1 border rounded-l">
                    -
                  </button>
                  <input type="number" value={quantity} onChange={handleQuantityInputChange} className="w-12 text-center border-t border-b" min="1" max={availableStock} />
                  <button onClick={() => handleQuantityChange(1)} className="px-2 py-1 border rounded-r">
                    +
                  </button>
                </div> */}

                <div className="py-2 px-3 inline-block bg-white border border-black rounded-sm" data-hs-input-number="">
                  <div className="flex items-center gap-x-1.5">
                    <button
                      type="button"
                      className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                      tabIndex="-1"
                      aria-label="Decrease"
                      data-hs-input-number-decrement=""
                      onClick={() => handleQuantityChange(-1)}
                    >
                      <svg
                        className="shrink-0 size-3.5"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14"></path>
                      </svg>
                    </button>
                    <input
                      className="p-0 w-6 bg-transparent border-0 text-gray-800 text-center focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      style={{ MozAppearance: "textfield" }}
                      type="number"
                      aria-roledescription="Number field"
                      value={quantity}
                      onChange={handleQuantityInputChange}
                      min="1"
                      max={availableStock}
                      data-hs-input-number-input=""
                    />
                    <button
                      type="button"
                      className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                      tabIndex="-1"
                      aria-label="Increase"
                      data-hs-input-number-increment=""
                      onClick={() => handleQuantityChange(1)}
                    >
                      <svg
                        className="shrink-0 size-3.5"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14"></path>
                        <path d="M12 5v14"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {error && <p className="text-red-500">{error}</p>}

              {/* ======================================= button add to cart ======================================= */}
              <div className="flex space-x-4">
                <button className="flex items-center space-x-2 px-10 py-2 border border-black text-black rounded" onClick={handleAddToCart}>
                  <CiShoppingCart size={24} />
                  <span>Add to Cart</span>
                </button>
                <button className="px-4 py-2 bg-black text-white rounded" onClick={handleBuyNow}>
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* ======================================= product description + review ======================================= */}
        <div className="mt-10 grid grid-cols-2 gap-5">
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-2">Reviews</h2>
            <div className="flex space-x-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setFilter(star)} className={`px-4 py-2 border ${filter === star ? "bg-yellow-500 text-white" : "bg-white text-gray-700"} rounded`}>
                  {star} Star{star > 1 && "s"}
                </button>
              ))}
              <button onClick={() => setFilter(null)} className={`px-4 py-2 border ${filter === null ? "bg-yellow-500 text-white" : "bg-white text-gray-700"} rounded`}>
                All
              </button>
            </div>
            {filteredReviews.length > 0 ? (
              filteredReviews.map((review, index) => (
                <div key={index} className="border-b py-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={`${review.rating > i ? "text-yellow-500" : "text-gray-300"}`} />
                    ))}
                  </div>
                  <p className="text-gray-600 mt-2">{review.comment}</p>
                  <p className="text-gray-400 text-sm">{review.reviewerName}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-700">No reviews for this rating.</p>
            )}
          </div>
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-2">Product Description</h2>
            <p className="mt-2">{product.description}.</p>
            <div className="grid grid-cols-2 w-1/2 mt-5">
              {/* <div className="">
                <p>{product.brand.name}</p>
                <p className="mt-2">{product.category.name}</p>
                <p className="mt-2">{product.type.name}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="inline-block bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">{product.tag?.name}</span>
                </div>
              </div> */}
            </div>
          </div>
        </div>
        <div className="mt-10">
          <Tabs />
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
