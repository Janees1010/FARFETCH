import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { cartItem } from "./UserCart";
import { Toaster, toast } from "react-hot-toast";
import { useAppSelector } from "../redux/slices/userSlicer";
import { MdRemoveShoppingCart } from "react-icons/md";
import ClipLoader from "react-spinners/ClipLoader";

// dotenv.config()

type Address = {
  name: string;
  phoneNumber: string;
  address: string;
  paymentMethod: string;
};

interface props {
  type: string;
}

const CheckoutPage = ({ type }: props) => {
  const [cartItems, setCartItems] = useState<cartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const user = useAppSelector((state) => state.userDetails);
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState<Address>({
    name: "",
    phoneNumber: "",
    address: "",
    paymentMethod: "COD",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const findTotalPrice = () => {
    const total = cartItems.reduce((accumulator: number, item) => {
      return accumulator + item.offerPrice * item.quantity;
    }, 0);
    return total;
  };

  const createRazorpayOrder = async (totalAmount: number) => {
    try {
      const response = await axios.post("http://localhost:9000/create-order", {
        amount: totalAmount,
      });
      return response.data;
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
      throw error;
    }
  };

  console.log(cartItems, "cccc");

  const handleOnlinePayment = async () => {
    try {
      const totalAmount = findTotalPrice() * 100; // Convert to paise
      const order = await createRazorpayOrder(totalAmount);

      const options = {
        key: "rzp_test_ZKcJLyt29WoYex",
        amount: order.amount,
        currency: order.currency,
        name: "FARFETCH",
        description: "farfetch a clothing store ",
        order_id: order.id,
        handler: async function (response: any) {
          console.log("Payment successful:", response);
          const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
            response;
          axios
            .post("http://localhost:9000/verify-payment", {
              order_id: razorpay_order_id,
              payment_id: razorpay_payment_id,
              payment_signature: razorpay_signature,
            })
            .then((res) => {
              console.log(res.data);
              if (res.data.message === "verified") {
                toast.success("order placed sucessfully");
                const products = cartItems.map((item) => ({
                  product: item._id,
                  quantity: item.quantity,
                  color: item.selectedColor,
                  size: item.selectedSize,
                }));
                const shippingAddress = {
                  name: formData.name,
                  address: formData.address,
                  phoneNumber: formData.phoneNumber,
                };
                const body = {
                  user: user._id,
                  totalAmount,
                  products,
                  paymentMethod: formData.paymentMethod,
                  shippingAddress,
                  status: "Shipped",
                  checkoutType: type,
                };
                console.log(body, "data to send");
                axios
                  .post("http://localhost:9000/save-order", { ...body })
                  .then((res) => {
                    if (res.data) {
                      navigate(`/orders/${user._id}`);
                    }
                  })
                  .catch((err) => console.log(err.message));
              } else {
                console.log("Payment verification failed.");
                toast.error("Payment verification failed. Please try again.");
              }
            })
            .catch((err) => {
              console.log("Payment verification failed." + " " + err.message);
              toast.error("Payment verification failed. Please try again.");
            });
          // Call your API to save the order details after successful payment
          //   try {
          //     await axios.post('http://localhost:9000/save-order', {
          //       orderId: response.razorpay_order_id,
          //       paymentId: response.razorpay_payment_id,
          //       signature: response.razorpay_signature,
          //       ...formData,
          //     });
          //     toast.success('Order placed successfully!');
          //   } catch (error) {
          //     console.error('Error saving order:', error);
          //     toast.error('Failed to save order. Please try again.');
          //   }
        },
        prefill: {
          name: formData.name,
          email: "", // Add email if available
          contact: formData.phoneNumber,
        },
        notes: {
          address: formData.address,
        },
        theme: {
          color: "#F37254", // Customize your Razorpay popup theme color
        },
      };

      const razorpay = new (window as any).Razorpay(options); // Use "any" for window typecasting
      razorpay.open();
    } catch (error) {
      console.error("Error during payment:", error);
      toast.error("Failed to initiate payment. Please try again.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Move preventDefault to the top
    if (!formData.name || !formData.phoneNumber || !formData.address) {
      toast.error("Please provide your address to confirm the order.");
    } else {
      console.log("Order submitted:", formData);
      if (formData.paymentMethod.toUpperCase() === "COD") {
        const totalAmount = findTotalPrice() * 100;
        const products = cartItems.map((item) => ({
          product: item._id,
          quantity: item.quantity,
          color: item.selectedColor,
          size: item.selectedSize,
        }));
        const shippingAddress = {
          name: formData.name,
          address: formData.address,
          phoneNumber: formData.phoneNumber,
        };
        const body = {
          user: user._id,
          totalAmount,
          products,
          paymentMethod: formData.paymentMethod,
          shippingAddress,
          status: "Shipped",
          checkoutType: type,
        };
        console.log(body, "data to send");
        axios
          .post("http://localhost:9000/save-order", { ...body })
          .then((res) => {
            if (res.data) {
              toast.success("Order placed successfully with Cash on Delivery!");
              navigate(`/orders/${user._id}`);
            }
          })
          .catch((err) => console.log(err.message));
      
      } else {
        handleOnlinePayment(); 
      }
    }
  };

  const findTotalSaving = () => {
    const totalSaving = cartItems?.reduce((accumulator, item) => {
      return accumulator + (item.price - item.offerPrice) * item.quantity;
    }, 0);
    return totalSaving;
  };

  useEffect(() => {
    axios
      .get(`http://localhost:5000/${id}`)
      .then((res) => {
        if (res.data) {
          setCartItems(res.data.cart);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err.message);
        setLoading(false);
      });
  }, [id]);
  if (loading) {
    return (
      <div className="spinner-container flex justify-center items-center h-screen">
        <ClipLoader color="#3498db" size={50} /> {/* Customize spinner */}
      </div>
    );
  }
  return (
    <>
      {cartItems && cartItems.length > 0 ? (
        <div className="max-w-5xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md flex gap-8">
          <Toaster />
          {/* Form Section */}
          <div className="w-full lg:w-2/3 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Shipping Details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="paymentMethod"
                  className="block text-sm font-medium text-gray-700"
                >
                  Payment Method
                </label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="COD">Cash on Delivery</option>
                  <option value="Online">Online Payment</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full mt-4 px-4 py-2 text-white bg-blue-600 rounded-md font-medium hover:bg-blue-700 transition duration-200"
              >
                Place Order
              </button>
            </form>
          </div>

          {/* Order Summary Section */}
          <div className="w-full lg:w-1/3 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4">
              {cartItems?.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between bg-gray-50 p-4 rounded-md"
                >
                  <img
                    src={item.images[0]}
                    alt={item.productName}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1 ml-4">
                    <h3 className="text-gray-800 font-medium">
                      {item.productName}
                    </h3>
                    <div className="text-sm text-gray-500 flex items-center">
                      <p className="line-through text-red-500 mr-2">
                        ${item.price.toFixed(2)}
                      </p>
                      <p className="text-green-600 font-semibold">
                        ${item.offerPrice.toFixed(2)}
                      </p>
                    </div>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-300 mt-4 pt-4">
              <div className="flex justify-between text-gray-700 font-semibold">
                <span>Total Savings:</span>
                <span className="text-red-500">- ${findTotalSaving()}</span>
              </div>
              <div className="flex justify-between mt-2 text-gray-700 font-semibold">
                <span>Total Price:</span>
                <span className="text-green-500">${findTotalPrice()}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <h1 className="text-center font-semibold text-lg flex mt-[200px] items-center justify-center gap-2">
          No Product selected to Checkout <MdRemoveShoppingCart className="text-2xl" />
        </h1>
      )}
    </>
  );
};

export default CheckoutPage;
