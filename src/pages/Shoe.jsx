import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../components/ContextProvider";

const Shoe = () => {
    const { id } = useParams();
    const { data } = useContext(ShopContext);

    // Use find and convert id to number
    const shoe = data.find((item) => item.id === Number(id));

    if (!shoe) {
        return <p>Shoe not found</p>;
    }

    
    return (
        <div className="p-4 w-full flex flex-col md:flex-row items-center justify-center gap-12 px-0 md:px-6 lg:px-20">
            <div className="w-full p-2 flex items-center justify-center">
                <img src={shoe.image} alt={shoe.name} className="w-80 rounded-lg mt-2" />
            </div>
            <div className="w-full p-2 flex flex-col gap-2">
                <div className="w-full flex flex-row items-center justify-between">
                    <h2 className="text-xl font-bold">{shoe.name}</h2>
                    {shoe.isAvailable ? <p>Available</p> : <p>Stock out</p>}

                </div>
                <p className="text-red-400 line-through">Old Price: ${shoe.old_price}</p>
                <p>New Price: ${shoe.new_price}</p>
                <p>Category: {shoe.category}</p>
                <p>Sub-category: {shoe.sub_category}</p>
                <select name="" id="">
                    <option value="">Select size</option>
                    {
                        shoe.sizes.map((size) => {
                            return (
                                <option value={size} key={size}>{size}</option>
                            )
                        })
                    }
                </select>
                <button  className='bg-gradient-to-br from-sky-500 to-blue-600 text-white px-2 p-1 rounded-lg'>Add to cart</button>
                <p>{shoe.description}</p>
            </div>


        </div>
    );
};

export default Shoe;
