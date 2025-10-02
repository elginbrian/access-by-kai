'use client';

import React from 'react';

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

interface OrderSummaryProps {
    cart: CartItem[];
    onRemoveFromCart: (id: string) => void;
    formatPrice: (price: number) => string;
    subtotal: number;
    serviceCharge: number;
    total: number;
    onCheckout?: () => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
    cart,
    onRemoveFromCart,
    formatPrice,
    subtotal,
    serviceCharge,
    total,
    onCheckout
}) => {
    return (
        <div className="bg-white rounded-2xl border p-6 sticky top-6">
            <h2 className="text-xl font-bold text-black mb-6">Ringkasan Pesanan</h2>

            {/* Cart Items */}
            <div className="space-y-4 mb-6">
                {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-start">
                        <div className="flex-1">
                            <h3 className="font-medium text-black mb-1">{item.name}</h3>
                            <p className="text-sm text-black">
                                {item.quantity}x {formatPrice(item.price)}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                            <button className="text-orange-400 hover:bg-yellow-200 p-1 rounded-lg">
                                <img src="/ic_pencil.svg" alt="Edit" className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => onRemoveFromCart(item.id)}
                                className="text-orange-400 hover:bg-yellow-200 p-1 rounded-lg"
                            >
                                <img src="/ic_delete.svg" alt="Hapus" className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 mb-4"></div>

            {/* Pricing */}
            <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                    <span className="text-black">Subtotal</span>
                    <span className="font-medium text-black">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-black">Biaya Layanan</span>
                    <span className="font-medium text-black">{formatPrice(serviceCharge)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                    <span className="font-bold text-lg text-black">Total</span>
                    <span className="font-bold text-lg text-black">{formatPrice(total)}</span>
                </div>
            </div>

            {/* Checkout Button */}
            <button 
                onClick={onCheckout}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors mb-4 bg-gradient-to-b from-[#6b46c1] to-[#3b82f6]"
            >
                Lanjut ke Review
            </button>

            <p className="text-xs text-black text-center">
                Makanan akan disiapkan sebelum keberangkatan
            </p>
        </div>
    );
};

export default OrderSummary;