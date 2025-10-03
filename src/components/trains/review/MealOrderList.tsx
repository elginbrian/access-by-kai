"use client";

import React from "react";

interface MealOrder {
  id: string;
  name: string;
  forPassenger: string;
  price: number;
  image: string;
}

interface MealOrderListProps {
  mealOrders: MealOrder[];
  formatPrice: (price: number) => string;
  onAddMeal?: () => void;
}

const MealOrderList: React.FC<MealOrderListProps> = ({ mealOrders, formatPrice, onAddMeal }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 flex items-center justify-center">
          <img src="/ic_meal_blue.svg" alt="Meal" className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold text-black">Pesanan Makanan</h2>
      </div>

      {mealOrders.length === 0 ? (
        <div className="p-6 bg-gray-50 rounded-xl text-center">
          <p className="text-gray-600 mb-4">Belum ada pesanan makanan.</p>
          <div className="flex justify-center">
            <button onClick={onAddMeal} className="px-4 py-2 bg-purple-600 text-white rounded-lg">
              Pesan Makanan
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mealOrders.map((meal) => (
            <div key={meal.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <img src={meal.image} alt={meal.name} className="w-16 h-16 rounded-lg object-cover" />
              <div className="flex-1">
                <h3 className="font-semibold text-black">{meal.name}</h3>
                <p className="text-sm text-black mb-1">Untuk {meal.forPassenger}</p>
                <p className="text-sm font-bold text-blue-600">{formatPrice(meal.price)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MealOrderList;
