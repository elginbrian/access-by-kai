"use client";

import React, { useState, useMemo } from "react";
import TrainNavigation from "@/components/trains/navbar/TrainNavigation";
import BookingProgress from "@/components/trains/booking/BookingProgress";
import FloatingChat from "@/components/trains/floatButton/FloatingChat";
import FoodMenuTabs from "@/components/trains/food-order/FoodMenuTabs";
import FoodMenuGrid from "@/components/trains/food-order/FoodMenuGrid";
import OrderSummary from "@/components/trains/food-order/OrderSummary";
import FloatingCartButton from "@/components/trains/food-order/FloatingCartButton";
import BookingLayout from "@/components/layout/BookingLayout";
import { useBookingContext } from "@/lib/hooks/useBookingContext";
import { useCentralBooking } from "@/lib/hooks/useCentralBooking";
import { useMenuByCategory } from "@/lib/hooks/useMenuRailfood";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
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

type FoodTabType = "Makanan" | "Snacks" | "Minuman";

const handleChatClick = () => {
  console.log("Chat clicked");
};

const TrainFoodOrderContent = () => {
  const { currentStep, handleStepClick, nextStep } = useBookingContext();
  const { setFoodOrders } = useCentralBooking();
  const [activeTab, setActiveTab] = useState<FoodTabType>("Makanan");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  const categoryMapping: Record<FoodTabType, string> = {
    Makanan: "MAKANAN_UTAMA",
    Snacks: "SNACK",
    Minuman: "MINUMAN",
  };

  const { data: menuItems, isLoading: menuLoading } = useMenuByCategory(categoryMapping[activeTab]);

  const formattedMenuItems = useMemo(() => {
    if (!menuItems) return [];
    return menuItems.map((item) => ({
      id: item.id.toString(),
      name: item.nama,
      description: item.deskripsi || `Menu ${item.nama}`,
      price: item.harga,
      image: item.gambar_url || "https://images.unsplash.com/photo-1563379091339-03246963d96a?w=400&h=300&fit=crop&auto=format",
      badge: item.is_halal ? "Halal" : item.is_vegetarian ? "Vegetarian" : undefined,
      badgeColor: item.is_halal ? "bg-emerald-100 text-emerald-700" : item.is_vegetarian ? "bg-green-100 text-green-700" : undefined,
    }));
  }, [menuItems]);

  const handleQuantityChange = (id: string, delta: number) => {
    const newQuantity = Math.max(0, (quantities[id] || 0) + delta);

    setQuantities((prev) => ({
      ...prev,
      [id]: newQuantity,
    }));

    if (newQuantity > 0 && !cart.find((item) => item.id === id)) {
      const menuItem = formattedMenuItems.find((item) => item.id === id);
      if (menuItem) {
        setCart((prev) => [
          ...prev,
          {
            id: menuItem.id,
            name: menuItem.name,
            price: menuItem.price,
            quantity: newQuantity,
            image: menuItem.image,
          },
        ]);
      }
    } else if (newQuantity > 0 && cart.find((item) => item.id === id)) {
      setCart((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)));
    } else if (newQuantity === 0) {
      setCart((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
    setQuantities((prev) => ({
      ...prev,
      [id]: 0,
    }));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const serviceCharge = 5000;
  const total = subtotal + serviceCharge;

  const formatPrice = (price: number) => {
    return `Rp ${price.toLocaleString("id-ID")}`;
  };

  React.useEffect(() => {
    const foodOrderItems = cart.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      forPassenger: "Main Passenger",
      image: item.image,
    }));
    setFoodOrders(foodOrderItems);
  }, [cart, setFoodOrders]);

  const bookingSteps = [
    {
      id: "pemesanan",
      title: "Pemesanan",
    },
    {
      id: "makanan",
      title: "Pemesanan Makanan",
    },
    {
      id: "review",
      title: "Review",
    },
    {
      id: "bayar",
      title: "Bayar",
    },
  ];

  if (menuLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat menu makanan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-30 bg-gray-50">
        {/* Header */}
        <TrainNavigation />

        {/* Progress Steps */}
        <BookingProgress steps={bookingSteps} currentStep={currentStep} onStepClick={handleStepClick} />
      </div>
      <div className="max-w-[100rem] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 px-6 py-8">
        {/* Left Section - Menu */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border p-6 mb-6">
            <h1 className="text-2xl font-bold text-black mb-2">Pilih Makanan & Minuman</h1>
            <p className="text-black mb-6">Nikmati perjalanan Anda dengan menu pilihan terbaik</p>

            {/* Tabs */}
            <FoodMenuTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          {/* Menu Grid */}
          <FoodMenuGrid menuItems={formattedMenuItems} quantities={quantities} onQuantityChange={handleQuantityChange} formatPrice={formatPrice} />
        </div>

        {/* Right Section - Order Summary */}
        <div className="lg:col-span-1">
          <OrderSummary cart={cart} onRemoveFromCart={removeFromCart} formatPrice={formatPrice} subtotal={subtotal} serviceCharge={serviceCharge} total={total} onCheckout={nextStep} />

          {/* Floating Cart Button */}
          <FloatingCartButton itemCount={cart.reduce((sum, item) => sum + item.quantity, 0)} onClick={() => console.log("Cart clicked")} />
        </div>
      </div>
      {/* Floating Chat */}
      <FloatingChat notificationCount={2} onClick={handleChatClick} />
    </div>
  );
};

const TrainFoodOrderPage = () => {
  return (
    <BookingLayout>
      <TrainFoodOrderContent />
    </BookingLayout>
  );
};

export default TrainFoodOrderPage;
