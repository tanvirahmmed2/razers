import React, { useContext } from "react";
import { ShopContext } from "../components/ContextProvider";

const Cart = () => {
  const { cartData, removeFromCart, getTotalAmount } = useContext(ShopContext);

  const handleCoupon = (e) => {
    e.preventDefault();
  };

  const totalItems = cartData.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <section className="w-full h-auto flex flex-col items-center justify-center gap-6 p-2">
      <h1 className="text-3xl font-semibold">Welcome to cart</h1>

      <div className="w-full grid grid-cols-5 text-center border-2">
        <p>Product</p>
        <p>Name</p>
        <p>Quantity</p>
        <p>Price</p>
        <p>Remove</p>
      </div>

      {cartData.map(({ image, name, id, new_price, quantity }) => (
        <div
          className="w-full grid grid-cols-5 text-center border-2 justify-items-center"
          key={id}
        >
          <img src={image} alt="" className="h-10" />
          <p className="w-auto flex items-center justify-center">{name}</p>
          <p className="w-auto flex items-center justify-center">{quantity}</p>
          <p className="w-auto flex items-center justify-center">${new_price * quantity}</p>
          <button
            onClick={() => removeFromCart(id)}
            className="text-red-600 font-semibold"
          >
            Remove
          </button>
        </div>
      ))}

      <div className="w-full flex flex-col md:flex-row items-center justify-between">
        <div className="w-full flex flex-col p-4">
          <p>Total items: {totalItems}</p>
          <p>Total amount: ${getTotalAmount()}</p>
        </div>
        <form
          className="w-full bg-blue-600 text-white rounded-lg flex flex-col gap-2 p-4"
          onSubmit={handleCoupon}
        >
          <label htmlFor="coupon">Get Discount</label>
          <input
            type="text"
            name="coupon"
            id="coupon"
            placeholder="type coupon"
            required
            className="p-1 px-3 rounded-lg outline-none placeholder-blue-500 placeholder-opacity-25 text-black"
          />
          <button className="bg-white text-blue-600 rounded-lg" type="submit">
            Apply coupon
          </button>
        </form>
      </div>

      <p className="bg-gradient-to-br from-amber-500 to-red-600 text-white p-1 rounded-lg px-6">
        Pay
      </p>
    </section>
  );
};

export default Cart;
