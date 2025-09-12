import { createContext, useState } from "react";
import { shoes } from "../data/shoes";

export const ShopContext = createContext()


export const ContextProvider = ({ children }) => {
    const [data, setData] = useState(shoes)
    const [cartData, setCartData] = useState([])

    const addToCart = (id) => {
        const selectedItem = data.find((item) => item.id === Number(id));
        if (selectedItem) {
            setCartData((prev) => [...prev, selectedItem]);
        }
    };

    const contextValue={ data, setData, addToCart, cartData }
    return (
        <ShopContext.Provider value={contextValue}>
            {children}
        </ShopContext.Provider>
    )
}