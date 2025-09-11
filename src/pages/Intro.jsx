import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../components/ContextProvider';
import Shoes from './Shoes';

const Intro = () => {
  
      const {data} = useContext(ShopContext)
      const latestData= data.slice(0,4)
  return (
    <section className='w-full flex flex-col lg:flex-row items-center justify-center gap-6 p-4'>
      <div className="w-full h-auto py-44  bg-gradient-to-br from-blue-400 to-sky-500 flex flex-col items-center justify-center text-white px-4 rounded-lg">
        <h1 className="text-5xl font-bold mb-4 text-center">
          Welcome to Razers
        </h1>
        <p className="text-lg md:text-xl mb-6 text-center max-w-xl">
          Discover the latest sneakers, boots, and casual shoes.
          Quality footwear for men, women, and kids. Step into style and comfort today!
        </p>
        <div className="flex gap-4">
          <Link
            to="/sneaker"
            className="bg-white text-blue-500 font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300"
          >
            Sneakers
          </Link>
          <Link
            to="/hiking"
            className="bg-white text-blue-500 font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition duration-300"
          >
            Hikings
          </Link>
        </div>
        <p className="mt-8 text-sm opacity-80">
          Free shipping on orders over $100!
        </p>
      </div>
      <div className='w-auto flex flex-wrap gap-4 justify-center'>
            {
            latestData.map((shoe)=>{
                const {name, id, old_price, new_price, image}= shoe
                return(
                    <Shoes name={name} old_price={old_price} new_price={new_price} image={image} key={id} id={id}/>
                )
            })
        }
        </div>
    </section>
  );
};

export default Intro;
