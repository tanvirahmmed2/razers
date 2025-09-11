import {  createContext, useState } from "react";
import { shoes } from "../data/shoes";

export const ShopContext= createContext()


export const ContextProvider=({children})=>{
    const [data, setData]= useState(shoes)
    return(
        <ShopContext.Provider value={{data, setData}}>
            {children}
        </ShopContext.Provider>
    )
}