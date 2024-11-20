import { useEffect, useState } from "react";
import { useAppSelector } from "../redux/slices/userSlicer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MdRemoveShoppingCart } from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

export interface cartItem {
  _id: string;
  productName: string;
  price: number;
  offerPrice: number;
  quantity: number;
  color: string[]; // Available colors
  size: string[]; // Available sizes
  selectedSize: string; // User selected size
  selectedColor: string; // User selected color
  images: string[];
}

const UserCart = () => {
  const user = useAppSelector((state) => state.userDetails);
  const [cartItems, setCartItems] = useState<cartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const calculateTotalPrice = () => {
    return cartItems.reduce((accum, item) => accum + item.offerPrice * item.quantity, 0);
  };

  const handleUpdateItem = (id: string, field: "selectedColor" | "selectedSize", value: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, [field]: value } : item
      )
    );
    axios.post("http://localhost:5000/update-item", {
      userId: user._id,
      productId: id,
      [field]: value,
    }).catch((err) => {
      console.log(err.message);
    });
  };

  const incrementQuantity = (id: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
    axios.post("http://localhost:5000/incriment", {
      userId: user._id,
      productId: id,
    }).catch((err) => {
      console.log(err.message);
    });
  };

  const decrementQuantity = (id: string) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item._id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
    axios.post("http://localhost:5000/decriment", {
      userId: user._id,
      productId: id,
    }).catch((err) => {
      console.log(err.message);
    });
  };

  // useEffect(() => {
  //   const fetchCartItems = async () => {
  //     if (user._id) {
  //       try {
  //         const res = await axios.get(`http://localhost:5000/${user._id}`);
  //         console.log(res,"reed");
          
  //         if (res.data.cart) {
  //           setCartItems(res.data.cart);
  //           setLoading(false);
  //         }
  //           setLoading(false)
          
  //       } catch (err: any) {
  //         console.log(err.statusCode);
  //         setLoading(false)   
  //         navigate("/signin");
  //       }
  //     }
  //   };
  //   fetchCartItems();
  // }, [user._id,navigate]);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (user._id) {
        try {
          const res = await axios.get(`http://localhost:5000/${user._id}`);
          if (res.data.cart) {
            setCartItems(res.data.cart);
            setLoading(false);
          }
        } catch (err: any) {
          console.log(err.message);
          setLoading(false)
          // navigate("/signin");
        }
      }
    };
    fetchCartItems();
  }, [user._id, navigate]);

  setTimeout(() => {
    setLoading(false);
  }, 900);


  if (loading) {
    return (
      <div className="spinner-container flex justify-center items-center h-screen">
        <ClipLoader color="#3498db" size={50} />
      </div>
    );
  }
  if (!loading) {
    if (!user.username) {
      navigate("/signin");
    }
  }
  return (
    <>
      {cartItems && cartItems.length > 0 ? (
        <div className="max-w-5xl mx-auto mt-5 p-6 bg-gray-100 rounded-lg shadow-md">
          <h1 className="text-2xl font-semibold mb-6 flex justify-center items-center gap-2">
            <FaShoppingCart /> Your Cart
          </h1>

          <div className="space-y-4">
            {cartItems.map((item) => {
              const savingsPercentage = Math.round(
                ((item.price - item.offerPrice) / item.price) * 100
              );

              return (
                <div
                  key={item._id}
                  className="flex items-center bg-white p-4 rounded-lg shadow-sm"
                >
                  <img
                    src={item.images[0]}
                    alt={item.productName}
                    className="w-20 h-22 object-cover rounded mr-4"
                  />

                  <div className="flex-1">
                    <h2 className="font-semibold text-gray-800">
                      {item.productName}
                    </h2>
                    <div className="flex items-center gap-2">
                      <p className="text-red-500 line-through">
                        ${item.price.toFixed(2)}
                      </p>
                      <p className="text-green-500 font-bold">
                        ${item.offerPrice.toFixed(2)}
                      </p>
                    </div>
                    <p className="text-sm text-green-600">
                      Save {savingsPercentage}%
                    </p>

                    <div className="flex  gap-2 items-center">
                            {/* Color Selector */}
                    <div className="mt-2">
                      <label className="text-sm font-semibold">Color:</label>
                      <select
                        value={item.selectedColor}
                        onChange={(e) =>
                          handleUpdateItem(item._id, "selectedColor", e.target.value)
                        }
                        className="ml-2 p-1 border rounded"
                      >
                        {item.color.map((color) => (
                          <option key={color} value={color}>
                            {color}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Size Selector */}
                    <div className="mt-2">
                      <label className="text-sm font-semibold">Size:</label>
                      <select
                        value={item.selectedSize}
                        onChange={(e) =>
                          handleUpdateItem(item._id, "selectedSize", e.target.value)
                        }
                        className="ml-2 p-1 border rounded"
                      >
                        {item.size.map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </div>
                    </div>

                   
                  </div>

                  <div className="flex items-center">
                    <button
                      onClick={() => decrementQuantity(item._id)}
                      className="px-2 py-1 text-gray-600 hover:text-gray-800 bg-gray-200 rounded-md"
                    >
                      -
                    </button>
                    <span className="mx-2 font-medium">{item.quantity}</span>
                    <button
                      onClick={() => incrementQuantity(item._id)}
                      className="px-2 py-1 text-gray-600 hover:text-gray-800 bg-gray-200 rounded-md"
                    >
                      +
                    </button>
                  </div>

                  <div className="ml-4">
                    <p className="text-lg font-bold text-gray-700">
                      ${(item.offerPrice * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 w-full p-4 bg-gray-50 rounded-lg shadow">
            <div className="flex justify-between font-semibold text-gray-700">
              <span>Total Price:</span>
              <span className="text-green-500">${calculateTotalPrice()}</span>
            </div>
            <Link to={`/checkout/${user._id}`}>
              <button className="w-full mt-4 px-4 py-2 text-white bg-blue-600 rounded-md font-medium hover:bg-blue-700 transition duration-200">
                Proceed to Checkout
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <h1 className="text-center font-semibold text-lg flex mt-[200px] items-center justify-center gap-2">
          Cart is Empty <MdRemoveShoppingCart className="text-2xl" />
        </h1>
      )}
    </>
  );
};

export default UserCart;
