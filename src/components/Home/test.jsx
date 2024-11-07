import React, { useState, useEffect } from "react";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { database } from "../../../firebaseConfig";
import { ref, onValue, update, remove } from "firebase/database";

const Home = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const requestNotificationPermission = async () => {
      if (Notification.permission !== "granted") {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          console.warn("Notification permission denied.");
        }
      }
    };

    requestNotificationPermission();

    const ordersRef = ref(database, "orders");

    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      const ordersList = [];

      for (const id in data) {
        ordersList.push({
          id,
          ...data[id],
          status: data[id].status || "Pending",
        });
      }

      const sortedOrders = ordersList.sort((a, b) => {
        return (
          (a.status === "Pending" ? -1 : 1) - (b.status === "Pending" ? -1 : 1)
        );
      });

      const previousPendingOrders = orders.filter(
        (order) => order.status === "Pending"
      ).length;

      setOrders(sortedOrders);
      setLoading(false);

      const newPendingOrders = sortedOrders.filter(
        (order) => order.status === "Pending"
      );
      const newPendingOrdersCount =
        newPendingOrders.length - previousPendingOrders;

      if (newPendingOrdersCount > 0) {
        toast.info(`You have ${newPendingOrdersCount} new order(s)!`);

        if (Notification.permission === "granted") {
          new Notification(`You have ${newPendingOrdersCount} new order(s)!`);
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [orders]);

  const handleLogout = () => {
    navigate("/");
  };

  const openModal = (order) => {
    setCurrentOrder(order);
    setNewStatus(order.status);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentOrder(null);
    setNewStatus("");
  };

  const handleStatusChange = async () => {
    if (currentOrder) {
      const orderRef = ref(database, `orders/${currentOrder.id}`);
      await update(orderRef, { status: newStatus });
      closeModal();
      toast.success("Order status updated successfully!");
    }
  };

  const confirmDelete = (order) => {
    setShowConfirmation(true);
    setOrderToDelete(order);
  };

  const handleDelete = async () => {
    if (orderToDelete) {
      const orderRef = ref(database, `orders/${orderToDelete.id}`);
      await remove(orderRef);
      setShowConfirmation(false);
      toast.success("Order deleted successfully!");
    }
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
    setOrderToDelete(null);
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-400">
      <div className="bg-white rounded-2xl shadow-2xl p-10">
        <div className="flex justify-center items-center mb-6">
          <h1 className="text-4xl mr-4 font-extrabold text-blue-600">
            Admin Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white rounded px-4 py-2"
          >
            Logout
          </button>
        </div>

        <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">
          Order Summary
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {loading ? (
            <div className="col-span-full flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : orders.length > 0 ? (
            orders.map((order) => (
              <div
                key={order.id}
                className="relative bg-white rounded-lg shadow-lg p-4 border border-gray-200 transition-transform transform hover:scale-105 hover:shadow-xl flex flex-col justify-between"
              >
                {order.status === "Pending" && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    New
                  </span>
                )}
                <div>
                  <h3 className="text-lg font-bold mb-2">
                    Order ID: {order.id}
                  </h3>

                  <p className="text-gray-700 text-sm">Room: {order.room}</p>

                  {Object.keys(order).map((key) => {
                    if (!isNaN(key)) {
                      const drinkDetail = order[key];
                      // Check if drinkDetail is valid before rendering
                      if (drinkDetail.drink && drinkDetail.quantity) {
                        return (
                          <div key={key} className="mb-2">
                            <p className="text-gray-700 text-sm">
                              Drink: {drinkDetail.drink}
                            </p>
                            <p className="text-gray-700 text-sm">
                              Quantity: {drinkDetail.quantity}
                            </p>
                          </div>
                        );
                      }
                    }
                    return null;
                  })}

                  <p
                    className={`font-semibold mt-2 text-sm ${
                      order.status === "Success"
                        ? "text-green-500"
                        : order.status === "Cancelled"
                        ? "text-red-500"
                        : "text-yellow-500"
                    }`}
                  >
                    Status: {order.status || ""}
                  </p>
                </div>

                <div className="mt-4 flex space-x-2 justify-center">
                  <button
                    onClick={() => openModal(order)}
                    className="bg-blue-200 text-blue-700 p-2 rounded-full hover:bg-blue-300 transition duration-200"
                  >
                    <FaEye className="text-blue-700" />
                  </button>
                  <button
                    onClick={() => confirmDelete(order)}
                    className="bg-red-200 text-red-700 p-2 rounded-full hover:bg-red-300 transition duration-200"
                  >
                    <FaTrash className="text-red-700" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-700">No orders found.</p>
          )}
        </div>

        {isModalOpen && currentOrder && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-gray-50 rounded-3xl shadow-2xl p-8 transition-transform transform w-full max-w-lg max-h-screen overflow-y-auto relative">
              <h3 className="text-2xl font-bold mb-6 text-center text-gray-800">
                Order Details
              </h3>

              <div className="grid grid-cols-2 gap-x-10 gap-y-5 mb-8">
                {/* Order ID */}
                <div className="font-semibold text-gray-800">Order ID:</div>
                <div className="text-black">{currentOrder.id}</div>

                {/* Room */}
                <div className="font-semibold text-gray-800">Room:</div>
                <div className="text-black">{currentOrder.room}</div>

                {/* Drinks */}
                <div className="font-semibold text-gray-800">Drinks:</div>
                <div className="text-black">
                  {Object.keys(currentOrder).map((key) => {
                    if (!isNaN(key)) {
                      const drinkDetail = currentOrder[key];
                      // Check if drinkDetail is valid before rendering
                      if (drinkDetail.drink && drinkDetail.quantity) {
                        return (
                          <div key={key} className="mb-2">
                            <p className="font-medium">{drinkDetail.drink}</p>
                            <p className="text-sm text-gray-800">
                              Quantity: {drinkDetail.quantity}
                            </p>
                          </div>
                        );
                      }
                    }
                    return null;
                  })}
                </div>

                {/* Current Status */}
                <div className="font-semibold text-gray-800">
                  Current Status:
                </div>
                <div className="text-black">{currentOrder.status}</div>

                <div className="font-semibold text-gray-800">
                  Update Status:
                </div>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="border border-gray-300 rounded p-1"
                >
                  <option value="Pending">Pending</option>
                  <option value="Success">Success</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex justify-between mt-4">
                <button
                  onClick={handleStatusChange}
                  className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
                >
                  Update Status
                </button>
                <button
                  onClick={closeModal}
                  className="bg-gray-300 text-black px-4 py-2 rounded shadow hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {showConfirmation && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm mx-auto">
              <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
              <p>Are you sure you want to delete this order?</p>
              <div className="mt-4 flex justify-between">
                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={cancelDelete}
                  className="bg-gray-300 text-black px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <ToastContainer />
      </div>
    </div>
  );
};

export default Home;
