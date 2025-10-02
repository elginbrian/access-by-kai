'use client';

import React, { useState } from 'react';
import TrainNavigation from '@/components/trains/navbar/TrainNavigation';
import BookingProgress from '@/components/trains/booking/BookingProgress';
import FloatingChat from "@/components/trains/floatButton/FloatingChat";
import FoodMenuTabs from '@/components/trains/food-order/FoodMenuTabs';
import FoodMenuGrid from '@/components/trains/food-order/FoodMenuGrid';
import OrderSummary from '@/components/trains/food-order/OrderSummary';
import FloatingCartButton from '@/components/trains/food-order/FloatingCartButton';

// Types
interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    badge?: string;
    badgeColor?: string;
}

type FoodTabType = 'Makanan' | 'Snacks' | 'Minuman';

const handleChatClick = () => {
    console.log("Chat clicked");
    // Handle chat logic here
};

const TrainFoodOrderPage = () => {
    const [activeTab, setActiveTab] = useState<FoodTabType>('Makanan');
    const [cart, setCart] = useState<CartItem[]>([
        { id: '1', name: 'Nasi Gudeg Ayam', price: 35000, quantity: 1 },
        { id: '2', name: 'Gado-Gado Betawi', price: 28000, quantity: 2 }
    ]);
    const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

    const menuItems: MenuItem[] = [
        {
            id: 'm1',
            name: 'Nasi Rendang Sapi',
            description: 'Nasi dengan rendang sapi dan sambal lado',
            price: 42000,
            image: 'https://images.unsplash.com/photo-1563379091339-03246963d96a?w=400&h=300&fit=crop&auto=format',
            badge: 'Spicy',
            badgeColor: 'bg-green-100 text-green-700'
        },
        {
            id: 'm2',
            name: 'Nasi Rendang Sapi',
            description: 'Nasi dengan rendang sapi dan sambal lado',
            price: 42000,
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&auto=format',
            badge: 'Halal',
            badgeColor: 'bg-emerald-100 text-emerald-700'
        },
        {
            id: 'm3',
            name: 'Nasi Rendang Sapi',
            description: 'Nasi dengan rendang sapi dan sambal lado',
            price: 42000,
            image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop&auto=format',
            badge: 'Halal',
            badgeColor: 'bg-emerald-100 text-emerald-700'
        },
        {
            id: 'm4',
            name: 'Nasi Rendang Sapi',
            description: 'Nasi dengan rendang sapi dan sambal lado',
            price: 42000,
            image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=300&fit=crop&auto=format',
            badge: 'Halal',
            badgeColor: 'bg-emerald-100 text-emerald-700'
        }
    ];

    const handleQuantityChange = (id: string, delta: number) => {
        const newQuantity = Math.max(0, (quantities[id] || 0) + delta);

        setQuantities(prev => ({
            ...prev,
            [id]: newQuantity
        }));

        // Add or update item in cart when quantity changes from 0 to 1
        if (newQuantity > 0 && !cart.find(item => item.id === id)) {
            const menuItem = menuItems.find(item => item.id === id);
            if (menuItem) {
                setCart(prev => [...prev, {
                    id: menuItem.id,
                    name: menuItem.name,
                    price: menuItem.price,
                    quantity: newQuantity
                }]);
            }
        } else if (newQuantity > 0 && cart.find(item => item.id === id)) {
            // Update existing cart item quantity
            setCart(prev => prev.map(item =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            ));
        } else if (newQuantity === 0) {
            // Remove from cart when quantity becomes 0
            setCart(prev => prev.filter(item => item.id !== id));
        }
    };

    const removeFromCart = (id: string) => {
        setCart(cart.filter(item => item.id !== id));
        setQuantities(prev => ({
            ...prev,
            [id]: 0
        }));
    };

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const serviceCharge = 5000;
    const total = subtotal + serviceCharge;

    const formatPrice = (price: number) => {
        return `Rp ${price.toLocaleString('id-ID')}`;
    };

    const [currentStep, setCurrentStep] = React.useState(1);

    const bookingSteps = [
        {
            id: 'pemesanan',
            title: 'Pemesanan'
        },
        {
            id: 'makanan',
            title: 'Pemesanan Makanan'
        },
        {
            id: 'review',
            title: 'Review'
        },
        {
            id: 'bayar',
            title: 'Bayar'
        },
    ];

    const handleStepClick = (step: number) => {
        // Only allow going back to previous steps
        if (step <= currentStep) {
            setCurrentStep(step);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="sticky top-0 z-30 bg-gray-50">
                {/* Header */}
                <TrainNavigation />

                {/* Progress Steps */}
                <BookingProgress
                    steps={bookingSteps}
                    currentStep={currentStep}
                    onStepClick={handleStepClick}
                />
            </div>
            <div className="max-w-[100rem] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 px-6 py-8">
                {/* Left Section - Menu */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl border p-6 mb-6">
                        <h1 className="text-2xl font-bold text-black mb-2">Pilih Makanan & Minuman</h1>
                        <p className="text-black mb-6">Nikmati perjalanan Anda dengan menu pilihan terbaik</p>

                        {/* Tabs */}
                        <FoodMenuTabs 
                            activeTab={activeTab}
                            onTabChange={setActiveTab}
                        />
                    </div>

                    {/* Menu Grid */}
                    <FoodMenuGrid
                        menuItems={menuItems}
                        quantities={quantities}
                        onQuantityChange={handleQuantityChange}
                        formatPrice={formatPrice}
                    />
                </div>

                {/* Right Section - Order Summary */}
                <div className="lg:col-span-1">
                    <OrderSummary
                        cart={cart}
                        onRemoveFromCart={removeFromCart}
                        formatPrice={formatPrice}
                        subtotal={subtotal}
                        serviceCharge={serviceCharge}
                        total={total}
                        onCheckout={() => console.log('Proceed to checkout')}
                    />

                    {/* Floating Cart Button */}
                    <FloatingCartButton
                        itemCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
                        onClick={() => console.log('Cart clicked')}
                    />
                </div>
            </div>
            {/* Floating Chat */}
            <FloatingChat notificationCount={2} onClick={handleChatClick} />
        </div>
    );
}

export default TrainFoodOrderPage;