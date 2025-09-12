import { createContext, useState } from "react";
import { shoes } from "../data/shoes";

export const ShopContext = createContext();

export const ContextProvider = ({ children }) => {
  const [data, setData] = useState(shoes);
  const [cartData, setCartData] = useState([]);

  const addToCart = (id) => {
    setCartData((prev) => {
      const existing = prev.find((item) => item.id === Number(id));
      if (existing) {
        return prev.map((item) =>
          item.id === Number(id)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        const selectedItem = data.find((item) => item.id === Number(id));
        if (selectedItem) {
          return [...prev, { ...selectedItem, quantity: 1 }];
        }
      }
      return prev;
    });
  };

  const removeFromCart = (id) => {
    setCartData((prev) =>
      prev
        .map((item) =>
          item.id === Number(id)
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const getTotalAmount = () => {
    return cartData.reduce(
      (total, item) => total + item.new_price * item.quantity,
      0
    );
  };

  const contextValue = {
    data,
    setData,
    cartData,
    addToCart,
    removeFromCart,
    getTotalAmount,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {children}
    </ShopContext.Provider>
  );
};
