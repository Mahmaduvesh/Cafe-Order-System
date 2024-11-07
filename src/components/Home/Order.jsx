import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ref, set } from "firebase/database";
import { database } from "../../../firebaseConfig";
import { useNavigate } from "react-router-dom";

const Order = () => {
  const navigate = useNavigate();
  const categories = {
    Coffee: [
      "Espresso",
      "Cappuccino",
      "Americano",
      "Arabic Coffee",
      "Turkish Coffee",
    ],
    Tea: [
      "Lemon Tea",
      "Green Tea",
      "Milk Tea / Karak Tea",
      "Jasmine Tea",
      "Red Tea",
    ],
    Juice: ["Orange Juice", "Pineapple Juice", "Cocktail Juice"],
    Water: ["Room Temperature Water", "Cold Water", "Boiled Water"],
  };

  const rooms = ["Room-1", "Room-2"];

  const [commonRoom, setCommonRoom] = useState("Room-1");
  const [orders, setOrders] = useState([
    { category: "", drink: "", sugar: false, quantity: 1 },
    { category: "", drink: "", sugar: false, quantity: 1 },
    { category: "", drink: "", sugar: false, quantity: 1 },
  ]);

  const handleAddOrder = () => {
    setOrders([
      ...orders,
      { category: "", drink: "", sugar: false, quantity: 1 },
    ]);
  };

  const handleOrderChange = (index, field, value) => {
    const updatedOrders = [...orders];
    updatedOrders[index][field] = value;
    if (field === "category") {
      updatedOrders[index].drink = categories[value][0] || "";
    }
    setOrders(updatedOrders);
  };

  const handleRemoveOrder = (index) => {
    const updatedOrders = orders.filter((_, i) => i !== index);
    setOrders(updatedOrders);
  };

  const handleSubmit = async () => {
    const firstOrder = orders[0];

    const isOrderValid =
      firstOrder.category && firstOrder.drink && firstOrder.quantity > 0;
    const isRoomSelected = !!commonRoom;

    if (!isOrderValid && !isRoomSelected) {
      toast.error("Minimum 1 item and room selection required for the order.");
      return;
    }

    if (!isOrderValid) {
      toast.error("Minimum 1 item required for the order.");
      return;
    }

    if (!isRoomSelected) {
      toast.error("Room selection is required for the order.");
      return;
    }

    try {
      const orderRef = ref(database, "orders/" + Date.now());
      const ordersWithRoom = orders.map((order) => ({
        ...order,
        room: commonRoom,
      }));

      await set(orderRef, ordersWithRoom);
      toast.success("Your orders have been submitted!");

      setOrders(
        [...Array(3)].map(() => ({
          category: "",
          drink: "",
          sugar: false,
          quantity: 1,
        }))
      );
      setCommonRoom("");
      navigate("/thank-you");
    } catch (error) {
      console.error("Error storing order:", error);
      toast.error("Failed to submit your order. Please try again.");
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-200 to-purple-200 flex justify-center items-center min-h-screen p-4 lg:p-10">
      <div className="bg-white p-6 lg:p-10 rounded-3xl shadow-xl w-full max-w-4xl">
        <h1 className="text-3xl lg:text-4xl font-bold mb-6 lg:mb-8 text-center text-blue-600">
          Drink Menu
        </h1>

        {/* Common Room Selection */}
        <div className="mb-6 lg:mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Room
          </label>
          <select
            value={commonRoom}
            onChange={(e) => setCommonRoom(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
          >
            {rooms.map((room) => (
              <option key={room} value={room}>
                {room}
              </option>
            ))}
          </select>
        </div>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="space-y-6 lg:space-y-8"
        >
          {orders.map((order, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded-lg p-4 shadow-md bg-gray-50"
            >
              <div className="flex justify-between mb-4">
                <h2 className="text-xl font-semibold">Drink Order</h2>
                {orders.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveOrder(index)}
                    className="text-red-500 font-bold hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Category
                </label>
                <select
                  value={order.category}
                  onChange={(e) =>
                    handleOrderChange(index, "category", e.target.value)
                  }
                  className="block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  {Object.keys(categories).map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Drink
                </label>
                <select
                  value={order.drink}
                  onChange={(e) =>
                    handleOrderChange(index, "drink", e.target.value)
                  }
                  className="block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                  disabled={!order.category}
                >
                  <option value="">Select a drink</option>
                  {order.category &&
                    categories[order.category].map((drink) => (
                      <option key={drink} value={drink}>
                        {drink}
                      </option>
                    ))}
                </select>
              </div>

              {(order.category === "Coffee" || order.category === "Tea") && (
                <div className="flex items-center mt-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={order.sugar}
                      onChange={(e) =>
                        handleOrderChange(index, "sugar", e.target.checked)
                      }
                      className="mr-2 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-lg font-medium">Add Sugar</span>
                  </label>
                </div>
              )}

              <div className="flex justify-between items-center mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  type="number"
                  value={order.quantity}
                  onChange={(e) =>
                    handleOrderChange(
                      index,
                      "quantity",
                      parseInt(e.target.value) || 1
                    )
                  }
                  className="w-20 p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={handleAddOrder}
              className="bg-green-500 text-white font-semibold rounded-lg py-2 px-4 hover:bg-green-600 transition duration-300"
            >
              Add Another Item
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              className="bg-blue-600 text-white font-semibold rounded-lg py-2 px-4 hover:bg-blue-700 transition duration-300"
            >
              Submit Orders
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Order;
