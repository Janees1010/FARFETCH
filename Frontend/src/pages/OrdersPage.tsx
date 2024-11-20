import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Modal from "../components/Modal";
import ClipLoader from "react-spinners/ClipLoader";
import { RiVerifiedBadgeFill } from "react-icons/ri"; // Adjust the import path according to your file structure

interface deliveryDetails {
  name: string;
  phoneNumber: string;
  address: string;
}
export interface Order {
  _id: string;
  orderId:string,
  productName: string;
  price: number;
  offerPrice: number;
  category: string;
  size: string;
  color: string;
  images: string[];
  description: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  status: string ;
  deliveryDetails: deliveryDetails; // Order status like 'Shipped', 'Out for Delivery', 'Delivered'
}

const OrdersPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading ,setLoading] = useState(true)
  const [showModal, setShowModal] = useState<boolean>(false);
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null); // ID of the order to cancel

  useEffect(() => {
    axios
      .get(`http://localhost:9000/orders/${id}`)
      .then((res) => {
        
        setOrders(res.data.orders);
        setLoading(false)
      })
      .catch((err) =>{  
        setLoading(false) 
        console.log(err.message) 
      });
  }, [id]);

//   const handleCancelOrder = (orderId: string) => {
//     setOrderToCancel(orderId);
//     setShowModal(true);
//   };

  const confirmCancelOrder = async () => {
    if (orderToCancel) {
      try {
        await axios.delete(`http://localhost:9000/orders/${orderToCancel}`);
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order._id !== orderToCancel)
        );
        setShowModal(false);
        setOrderToCancel(null);
      } catch (error) {
        console.error("Error canceling order:", error);
      }
    }
  };
   
  if(loading){
    return (
      <div className="spinner-container flex justify-center items-center h-screen">
        <ClipLoader color="#3498db" size={50} />
      </div>
    );
  }

  return (
    <>
    { orders && orders.length > 0 ? 
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="border p-4 rounded shadow bg-white">
            {/* Row for Image and Details */}
            <div className="flex gap-5 items-center justify-between">
              <img
                src={order.images[0]}
                alt={order.productName}
                className="w-32 h-32 object-cover rounded"
              />
              <div className="ml-4 flex-1 ">
                <h2 className="text-lg font-semibold">{order.productName}</h2>
                {/* <p className="text-gray-700">{order.description}</p> */}
                <div className="flex justify-between mt-2">
                  <span className="text-xl text-green-500  font-bold">
                    ${order.offerPrice}
                    <span className="text-gray-500 mx-1 line-through">
                      ${order.price}
                    </span>
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-gray-600">Size: {order.size}</span>
                  <span className="ml-4 text-gray-600">
                    Color: {order.color}
                  </span>
                </div>

                {/* Place the Cancel Order Button here */}
                <div className=" sm:flex sm:justify-between">
                  <p className="text-gray-600 mt-2">Qty: {order.quantity}</p>
                  {/* <button
                    onClick={() => handleCancelOrder(order._id)}
                    className="mt-4    px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Cancel Order
                  </button> */}
                </div>
              </div>
            </div>

            <div className="mt-6">
              {/* Progress Bar Container */}
              <div className="flex items-center justify-between w-full">
                {/* Shipped Status */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-6 h-6 ${
                      order.status === "Shipped" ||
                      order.status === "outForDelivery" ||
                      order.status === "Delivered"
                        ? "bg-blue-500"
                        : "bg-gray-300"
                    } rounded-full flex items-center justify-center`}
                  >
                    {/* <span className="text-white text-xs">✔</span> */}
                    <RiVerifiedBadgeFill className="text-xl" />

                  </div>
                  <span
                    className={`text-xs mt-1 ${
                      order.status === "Shipped"
                        ? "text-blue-500"
                        : "text-gray-400"
                    }`}
                  >
                    Shipped
                  </span>
                </div>

                {/* Connector between Shipped and Out for Delivery */}
                <div
                  className={`flex-1 h-1 ${
                    order.status === "outForDelivery" ||
                    order.status === "Delivered"
                      ? "bg-yellow-500"
                      : "bg-gray-300"
                  }`}
                />

                {/* Out for Delivery Status */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-6 h-6 ${
                      order.status === "outForDelivery" ||
                      order.status === "Delivered"
                        ? "bg-yellow-500"
                        : "bg-gray-300"
                    } rounded-full flex items-center justify-center`}
                  >
                     <RiVerifiedBadgeFill className="text-xl" />
                  </div>
                  <span
                    className={`text-xs mt-1 ${
                      order.status === "outForDelivery"
                        ? "text-yellow-500"
                        : "text-gray-400"
                    }`}
                  >
                    Out for Delivery
                  </span>
                </div>

                {/* Connector between Out for Delivery and Delivered */}
                <div
                  className={`flex-1 h-1 ${
                    order.status === "Delivered"
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                />

                {/* Delivered Status */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-6 h-6 ${
                      order.status === "Delivered"
                        ? "bg-green-500"
                        : "bg-gray-300"
                    } rounded-full flex items-center justify-center`}
                  >
                  <RiVerifiedBadgeFill className="text-xl" />
                  </div>
                  <span
                    className={`text-xs mt-1 ${
                      order.status === "Delivered"
                        ? "text-green-500"
                        : "text-gray-400"
                    }`}
                  >
                    Delivered
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <Modal
          handler={confirmCancelOrder}
          title="Cancel Order"
          message="Are you sure you want to cancel this order?"
          setShowModal={setShowModal}
        />
      )}
    </div>
           :  <h1 className="text-center font-semibold text-lg flex mt-[200px] items-center justify-center gap-2">
             No order  History
         </h1>    }
    </>
  );
};

export default OrdersPage;
