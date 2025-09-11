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
        <div className="p-4 w-full flex flex-col md:flex-row items-center justify-center gap-12">
            <div>
                <img src={shoe.image} alt={shoe.name} className="w-64 mt-2" />
            </div>
            <div>
                <h2 className="text-xl font-bold">{shoe.name}</h2>
                <p>Old Price: ${shoe.old_price}</p>
                <p>New Price: ${shoe.new_price}</p>
                <p>Category: {shoe.category}</p>
                <p>Sub-category: {shoe.subCategory}</p>
            </div>


        </div>
    );
};

export default Shoe;
