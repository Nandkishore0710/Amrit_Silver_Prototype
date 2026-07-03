import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiHeart, FiTrash2 } from 'react-icons/fi';
import { toggleWishlistItem } from '../store/slices/wishlistSlice';
import { addToCart } from '../store/slices/cartSlice';
import toast from 'react-hot-toast';

const WishlistPage = () => {
  const { items } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();

  const handleRemove = (product) => {
    dispatch(toggleWishlistItem(product));
    toast.success('Removed from wishlist');
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart({ ...product, quantity: 1 }));
    toast.success('Added to cart');
  };

  return (
    <>
      <Helmet>
        <title>My Wishlist - AMRIT SILVER</title>
      </Helmet>

      <div className="bg-[#fcfcfc] min-h-screen py-16">
        <div className="container mx-auto px-4 max-w-[1100px]">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#1F1F1F] font-serif mb-4">My Wishlist</h1>
            <p className="text-[#696C70]">Your curated collection of premium silver covers.</p>
          </div>

          {items.length === 0 ? (
            <div className="bg-white p-16 text-center border border-[#E9E9E9] shadow-sm rounded-lg">
              <FiHeart className="mx-auto text-6xl text-[#D1D1D1] mb-6" />
              <h2 className="text-2xl font-bold text-[#1F1F1F] mb-4">Your wishlist is empty</h2>
              <p className="text-[#696C70] mb-8">You haven't saved any items yet. Start exploring our premium collections!</p>
              <Link to="/products" className="inline-block bg-[#1F1F1F] text-white px-8 py-3 rounded text-sm font-bold tracking-wider uppercase hover:bg-[#333] transition-colors">
                Explore Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map((item) => (
                <div key={item._id} className="bg-white border border-[#E9E9E9] rounded-lg overflow-hidden group hover:shadow-lg transition-shadow">
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#F8F8F8]">
                    <img 
                      src={item.images?.[0] || 'https://images.unsplash.com/photo-1601593346740-925612772716?q=80&w=600&auto=format&fit=crop'} 
                      alt={item.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                    <button 
                      onClick={() => handleRemove(item)}
                      className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center text-red-500 shadow-md hover:scale-110 transition-transform"
                      title="Remove from Wishlist"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                  
                  <div className="p-6">
                    <Link to={`/product/${item.slug}`} className="block">
                      <h3 className="text-lg font-bold text-[#1F1F1F] mb-2 hover:text-[#c8a97e] transition-colors">{item.name}</h3>
                    </Link>
                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-[#1F1F1F] font-bold text-lg">Rs. {item.price.toLocaleString()}</span>
                      {item.compareAtPrice && (
                        <span className="text-sm text-[#8F9296] line-through">Rs. {item.compareAtPrice.toLocaleString()}</span>
                      )}
                    </div>
                    <button 
                      onClick={() => handleAddToCart(item)}
                      className="w-full py-3 bg-black text-white text-sm font-bold uppercase tracking-wider rounded hover:bg-[#c8a97e] hover:text-white transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WishlistPage;
