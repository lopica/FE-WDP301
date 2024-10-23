import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";
import axios from "axios";

const brandData = [
  { _id: "6680361f6980cbef1d1b1f70", name: "Adidas" },
  { _id: "6680361f6980cbef1d1b1f71", name: "Calvin Klein" },
  { _id: "6680361f6980cbef1d1b1f72", name: "Gucci" },
  { _id: "6680361f6980cbef1d1b1f73", name: "Lacoste" },
  { _id: "6680361f6980cbef1d1b1f74", name: "Dior" },
  { _id: "6680361f6980cbef1d1b1f75", name: "Chloé" },
  { _id: "6680361f6980cbef1d1b1f76", name: "Balenciaga" },
];

const FormAddProduct = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("");
  const [tag, setTag] = useState("");
  const [type, setType] = useState("");
  const [brand, setBrand] = useState("");
  const [images, setImages] = useState([{ url: "", file: null }]);
  const [thumbnail, setThumbnail] = useState({ url: "", file: null });
  const [stock, setStock] = useState(0);
  const [availabilityStatus, setAvailabilityStatus] = useState("InActive");
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [types, setTypes] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResponse = await axios.get("http://localhost:9999/api/category/get-all");
        const tagsResponse = await axios.get("http://localhost:9999/api/tag/get-all");
        const typesResponse = await axios.get("http://localhost:9999/api/type/get-all");
        setCategories(categoriesResponse.data);
        setTags(tagsResponse.data);
        setTypes(typesResponse.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleImageChange = (index, type, value) => {
    const updatedImages = [...images];
    updatedImages[index][type] = value;
    if (type === "url") {
      updatedImages[index].file = null;
    } else {
      updatedImages[index].url = "";
    }
    setImages(updatedImages);
  };

  const handleThumbnailChange = (type, value) => {
    const updatedThumbnail = { ...thumbnail, [type]: value };
    if (type === "url") {
      updatedThumbnail.file = null;
    } else {
      updatedThumbnail.url = "";
    }
    setThumbnail(updatedThumbnail);
  };

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      if (file.size <= 5 * 1024 * 1024) {
        handleImageChange(index, "file", file);
        setErrorMessage("");
      } else {
        setErrorMessage("Only files smaller than 5MB are allowed.");
      }
    } else {
      setErrorMessage("Only image files are allowed.");
    }
  };

  const handleThumbnailFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      if (file.size <= 5 * 1024 * 1024) {
        handleThumbnailChange("file", file);
        setErrorMessage("");
      } else {
        setErrorMessage("Only files smaller than 5MB are allowed.");
      }
    } else {
      setErrorMessage("Only image files are allowed.");
    }
  };

  const imageAsDataUrl = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => resolve(fileReader.result);
      fileReader.onerror = (error) => reject(error);
    });
  };

  const handleAddImage = () => {
    if (images.length < 5) {
      setImages([...images, { url: "", file: null }]);
    } else {
      toast.error("A maximum of 5 images is allowed.");
    }
  };

  const handleDeleteImage = (index) => {
    const updatedImages = images.filter((_, imgIndex) => imgIndex !== index);
    setImages(updatedImages);
  };

  const handleClearFile = (index) => {
    handleImageChange(index, "file", null);
  };

  const handleClearThumbnailFile = () => {
    handleThumbnailChange("file", null);
  };

  const validateImageUrl = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const base64Thumbnail = thumbnail.file ? await imageAsDataUrl(thumbnail.file) : thumbnail.url;
    const base64Images = await Promise.all(images.map(async (image) => (image.file ? await imageAsDataUrl(image.file) : image.url)));

    // Validate image URLs
    const validUrls = await Promise.all(base64Images.map((url) => validateImageUrl(url)));
    if (validUrls.includes(false)) {
      setErrorMessage("One or more image URLs are invalid.");
      return;
    }

    const productData = {
      title,
      description,
      category,
      price: price || 0,
      stock: stock || 0,
      type,
      tag,
      brand,
      availabilityStatus,
      images: base64Images,
      thumbnail: base64Thumbnail,
    };

    console.log("Submitting product data:", productData);
    try {
      const response = await axios.post("http://localhost:9999/api/product/create", productData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      toast.success("Product added successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error adding product:", error.response ? error.response.data : error);
      toast.error("Failed to add product.");
    }
  };

  return (
    <div className="border-t-2">
      <div className="mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4 mt-5">
          <div className="grid grid-cols-12 gap-4">
            {/* Row 1: Title, Description, Price */}
            <div className="col-span-4 flex flex-col">
              <Label className="mb-2">Title</Label>
              <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="col-span-4 flex flex-col">
              <Label className="mb-2">Price</Label>
              <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} readOnly />
            </div>
            <div className="col-span-4 flex flex-col">
              <Label className="mb-2">Stock</Label>
              <Input type="number" value={stock} onChange={(e) => setStock(e.target.value)} readOnly />
            </div>
            {/* Row 2: Category, Tag, Type */}
            <div className="col-span-4 flex flex-col">
              <Label className="mb-2">Category</Label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} required className="p-2 border border-gray-300 rounded-md">
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-4 flex flex-col">
              <Label className="mb-2">Tag</Label>
              <select value={tag} onChange={(e) => setTag(e.target.value)} required className="p-2 border border-gray-300 rounded-md">
                <option value="" disabled>
                  Select a tag
                </option>
                {tags.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-4 flex flex-col">
              <Label className="mb-2">Type</Label>
              <select value={type} onChange={(e) => setType(e.target.value)} required className="p-2 border border-gray-300 rounded-md">
                <option value="" disabled>
                  Select a type
                </option>
                {types.map((ty) => (
                  <option key={ty._id} value={ty._id}>
                    {ty.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Row 3: Brand, Stock, Availability Status */}
            <div className="col-span-4 flex flex-col mt-3">
              <Label className="mb-2">Brand</Label>
              <select value={brand} onChange={(e) => setBrand(e.target.value)} required className="p-2 border border-gray-300 rounded-md">
                <option value="" disabled>
                  Select a brand
                </option>
                {brandData.map((br) => (
                  <option key={br._id} value={br._id}>
                    {br.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-4 flex flex-col mt-3">
              <Label className="mb-2">Availability Status</Label>
              <select value={availabilityStatus} onChange={(e) => setAvailabilityStatus(e.target.value)} required className="p-2 border border-gray-300 rounded-md">
                <option value="InActive">InActive</option>
                <option value="In Stock">In Stock</option>
                <option value="Sold Out">Sold Out</option>
              </select>
            </div>
            <div className="col-span-12 flex flex-col">
              <Label className="mb-2">Description</Label>
              <Textarea type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
            {/* Row 4: Images */}
            {images.map((image, index) => (
              <div key={index} className="col-span-12 flex flex-col md:flex-row items-center relative">
                <div className="flex flex-col w-full md:w-1/2 mt-5">
                  <Label className="mb-2">Image {index + 1}</Label>
                  {!image.file && <Input className="mb-2 w-3/4" type="text" value={image.url} onChange={(e) => handleImageChange(index, "url", e.target.value)} placeholder={`Ex: URL${index + 1}`} />}
                  {!image.url && <Input accept="image/png, image/jpeg" className="w-3/4" type="file" onChange={(e) => handleFileChange(e, index)} />}
                  {image.file && (
                    <Button variant="outline" type="button" onClick={() => handleClearFile(index)} className="w-3/4 bg-gray-200 mt-2">
                      Clear File
                    </Button>
                  )}
                  {index > 0 && (
                    <Button variant="outline" type="button" onClick={() => handleDeleteImage(index)} className="w-3/4 bg-red-200 right-0 mt-5">
                      Delete
                    </Button>
                  )}
                </div>
                <div className="flex items-center justify-center w-full md:w-1/2 mt-11">
                  {image.url && <img src={image.url} alt={`Image ${index + 1} Preview`} className="w-40 h-auto border border-gray-300 rounded-md" />}
                  {image.file && <img src={URL.createObjectURL(image.file)} alt={`Image ${index + 1} Preview`} className="w-40 h-auto border border-gray-300 rounded-md" />}
                </div>
              </div>
            ))}
            {images.length < 5 && (
              <div className="col-span-12 flex flex-col w-1/2">
                <Button variant="outline" className="w-3/4 bg-blue-200" type="button" onClick={handleAddImage}>
                  Add Image
                </Button>
              </div>
            )}
            {/* Row 5: Thumbnail */}
            <div className="col-span-12 flex flex-col">
              <Label className="mb-2">Thumbnail</Label>
              {!thumbnail.file && <Input className="mb-2" type="text" value={thumbnail.url} onChange={(e) => handleThumbnailChange("url", e.target.value)} placeholder="Thumbnail URL" />}
              {!thumbnail.url && <Input accept="image/png, image/jpeg" type="file" onChange={handleThumbnailFileChange} />}
              {thumbnail.file && (
                <Button variant="outline" type="button" onClick={handleClearThumbnailFile} className="w-full bg-gray-200 mt-2">
                  Clear File
                </Button>
              )}
              {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
            </div>
          </div>
          {/* Thumbnail Preview */}
          <div className="col-start-6 col-span-5 flex flex-col items-center justify-center">
            <Label className="mb-5">Thumbnail Preview</Label>
            {thumbnail.file ? (
              <img src={URL.createObjectURL(thumbnail.file)} alt="Thumbnail Preview" className="w-1/2 h-auto border border-gray-300 rounded-md" />
            ) : (
              thumbnail.url && <img src={thumbnail.url} alt="Thumbnail Preview" className="w-1/2 h-auto border border-gray-300 rounded-md" />
            )}
          </div>
          {/* Submit Button */}
          <div className="flex justify-center">
            <Button className="w-full" type="submit">
              Add Product
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormAddProduct;
