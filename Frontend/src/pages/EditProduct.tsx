import React, { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

 interface productType {
  _id?: string | null;
  productName: string;
  price: number;
  offerPrice: number;
  category: string;
  quantity: number;
  size: string[];
  color: string[];
  images: File[] | null | string[];
  description: string; // Add this line to include description
}

const EditProductForm: React.FC = () => {
  const [formValue, setformValue] = useState<productType>({
    productName: "",
    description: "",
    price: 0,
    quantity: 0,
    offerPrice: 0,
    category: "",
    size: [] as string[],
    color: [] as string[],
    images: null,
  });
  const {id} = useParams()
  const navigate = useNavigate();
  const imageRef = useRef<HTMLImageElement | null>(null);
  let size: string[] = ["S", "M", "L", "XL", "XXL"];

  const [newColor, setNewColor] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLElement>) => {
    const { name, value } = e.target as
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement; // Type assertion
    setformValue({ ...formValue, [name]: value });
  };

  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files || null;
    if (files) {
      let fileArray = Array.from(files);
      setformValue({ ...formValue, images: fileArray });
      console.log("Selected image:", fileArray);
    }
  };
  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    console.log(value);

    setformValue((prev) => ({
      ...prev,
      size: checked
        ? [...prev.size, value]
        : prev.size.filter((s) => s !== value),
    }));
  };
  const handleAddColor = () => {
    if (newColor && !formValue.color.includes(newColor)) {
      setformValue((prev) => ({
        ...prev,
        color: [...prev.color, newColor],
      }));
      setNewColor("");
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append("productName", formValue.productName);
    data.append("description", formValue.description);
    data.append("price", formValue.price.toString());
    data.append("quantity", formValue.quantity.toString());
    data.append("offerPrice", formValue.offerPrice.toString());
    data.append("category", formValue.category);

    // Append size and color arrays as JSON strings (or as needed)
    data.append("size", JSON.stringify(formValue.size));
    data.append("color", JSON.stringify(formValue.color));
    if (formValue.images) {
      formValue.images.forEach((image) => {
        data.append("images", image); //
      });
    }
  console.log(data,"formdata");
  
    axios
      .post(`http://localhost:4000/editproduct/${id}`,data, {
        headers: {},
      })
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          navigate("/admin");
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  const removeSelectedColor = (color: string) => {
    console.log(color);
    setformValue((prev) => ({
      ...prev,
      color: prev.color.filter((col) => col != color),
    }));
  };

  useEffect(()=>{
     axios.get(`http://localhost:4000/product/${id}`).then((res)=>{
        console.log(res.data,"ddd");
  
   setformValue((prev)=> ({...prev,
    color:res.data.color,
    size:res.data.size,
    images:res.data.images,
    productName:res.data.productName,
    description:res.data.description,
    category:res.data.category,
    price:res.data.price,
    offerPrice:res.data.offerPrice,
    quantity:res.data.quantity

}))
     }).catch((err)=>{
        console.log(err.message);   
     })
  },[])

  return (
    <div className="max-w-2xl m-3 mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">
        EditProduct
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="product-name"
            className="block text-sm font-medium text-gray-700"
          >
            Product Name
          </label>
          <input
            type="text"
            id="product-name"
            name="productName"
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formValue?.productName}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="product-name"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            rows={3}
            id="description"
            name="description"
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            value={formValue?.description}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            Price
          </label>
          <input
            type="text"
            id="price"
            name="price"
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formValue?.price}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="offer-price"
            className="block text-sm font-medium text-gray-700"
          >
            Offer Price
          </label>
          <input
            type="text"
            id="offer-price"
            name="offerPrice"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formValue?.offerPrice}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="product-name"
            className="block text-sm font-medium text-gray-700"
          >
            Quantity
          </label>
          <input
            type="text"
            id="quantity"
            name="quantity"
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formValue?.quantity}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formValue?.category}
            onChange={handleChange}
          >
            <option value="">Select a category</option>
            <option value="Mens">Mens</option>
            <option value="Womens">Womens</option>
            <option value="Kids">Kids</option>
            {/* Add more categories as needed */}
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="new-color"
            className="block text-sm font-medium text-gray-700"
          >
            Add Available Color
          </label>
          <div className="flex items-center mt-1">
            <input
              type="text"
              id="new-color"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              className="mt-1 block w-[50%] p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handleAddColor}
              className="ml-2 py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Add Color
            </button>
          </div>
        </div>
        <div className="mb-4">
          <div className="flex items-center mt-1">
            {formValue.color.map((color, index) => (
              <span key={index} className="flex items-center mr-4">
                <span
                  className="w-6 h-6 rounded-full border-2 border-gray-300 mr-2"
                  style={{ backgroundColor: color }}
                />
                <span className=" flex items-center gap-2 text-sm text-gray-700 capitalize">
                  {color}
                  <IoClose onClick={() => removeSelectedColor(color)} />
                </span>
              </span>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 pb-3">
            Select Sizes
          </label>
          <div className="flex gap-2">
            {size.map((s) => {
              return (
                <label
                  key={s}
                  className=" text-sm font-medium flex gap-1 text-gray-700"
                  htmlFor=""
                >
                  <input
                    onChange={handleSizeChange}
                    type="checkbox"
                    value={s}
                    checked={formValue?.size.includes(s)}         
                  />
                  {s}
                </label>
              );
            })}
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="product-image"
            className="block text-sm font-medium text-gray-700"
          >
            Product Image
          </label>
          <input
            type="file"
            multiple
            id="product-image"
            name="image"
            accept="image/*"
            // required
            // value={formValue.images}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleImageChange}
          />
        </div>

        <div className="mb-4 flex flex-wrap gap-3">
          {formValue.images
            ? formValue.images.map((img, index) => {
                if (typeof img === "string") {
                  // If the image is a URL string
                  return (
                    <img
                      ref={imageRef}
                      key={index}
                      className="w-[200px] h-[160px]"
                      src={img}
                      alt="Uploaded image"
                    />
                  );
                } else if (img instanceof File) {
                  // If the image is a File object
                  return (
                    <img
                      ref={imageRef}
                      key={img.name} // File objects have a name property
                      className="w-[200px] h-[160px]"
                      src={URL.createObjectURL(img)}
                      alt="Loading...."
                    />
                  );
                }
                return null; // Fallback case
              })
            : null }
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Save Product
        </button>
      </form>
      <div></div>
    </div>
  );
};

export default EditProductForm;
