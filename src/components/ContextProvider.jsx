import {  createContext, useState } from "react";

export const ShopContext= createContext()


export const ContextProvider=({children})=>{
    const [data, setData]= useState()
    return(
        <ShopContext.Provider value={data}>
            {children}
        </ShopContext.Provider>
    )
}