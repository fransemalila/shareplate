import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import Button from '../common/Button';

export const ShoppingCart: React.FC = () => {
  const navigate = useNavigate();
  const { items, subtotal, tax, total, updateQuantity, removeFromCart, updateNotes } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity >= 0) {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) return;
    setIsCheckingOut(true);
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Cart is Empty</h2>
        <p className="text-gray-600 mb-6">Start adding some delicious items to your cart!</p>
        <Button variant="primary" onClick={() => navigate('/listings')}>
          Browse Listings
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Shopping Cart</h2>
        
        {/* Cart Items */}
        <div className="space-y-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg"
            >
              {/* Item Image */}
              <div className="w-24 h-24 flex-shrink-0">
                <img
                  src={item.listing.images[0]}
                  alt={item.listing.title}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>

              {/* Item Details */}
              <div className="flex-grow">
                <h3 className="text-lg font-medium text-gray-900">{item.listing.title}</h3>
                <p className="text-sm text-gray-500">{item.listing.description}</p>
                
                {/* Price and Quantity */}
                <div className="mt-2 flex items-center space-x-4">
                  <div className="text-lg font-medium text-gray-900">
                    ${(item.listing.price * item.quantity).toFixed(2)}
                  </div>
                  
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="px-3 py-1 text-gray-600 hover:text-gray-800"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 border-x border-gray-300">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="px-3 py-1 text-gray-600 hover:text-gray-800"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Notes */}
                <div className="mt-2">
                  <textarea
                    value={item.notes || ''}
                    onChange={(e) => updateNotes(item.id, e.target.value)}
                    placeholder="Add special instructions..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    rows={2}
                  />
                </div>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-600 hover:text-red-800"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="mt-8 border-t border-gray-200 pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold text-gray-900">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Checkout Button */}
          <div className="mt-6">
            <Button
              variant="primary"
              className="w-full"
              onClick={handleCheckout}
              disabled={isCheckingOut || items.length === 0}
            >
              {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}; 