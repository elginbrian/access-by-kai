const HotelCard: React.FC<{
  title: string;
  price: string;
  subtitle?: string;
  rating?: string;
  tags?: string[];
}> = ({ title, price, subtitle, rating, tags }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
      <div className="flex gap-4">
        <img src="/img_illustrate_hotel.png" alt={title} className="w-36 h-36 rounded-xl" />

        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-bold text-gray-900">{title}</h3>
              {subtitle && <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                <img src="/ic_location.svg" alt="location" className="w-3 h-3" />
                {subtitle}
              </p>}
            </div>
            <div className="text-right">
              {rating && <div className="text-sm text-yellow-500 font-medium flex items-center gap-1">
                ⭐ {rating} <span className="text-gray-400">(320 reviews)</span>
              </div>}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <img src="/ic_wifi.svg" alt="WiFi" className="w-4 h-4" />
              <span className="text-sm text-gray-600">WiFi</span>
            </div>
            <div className="flex items-center gap-2">
              <img src="/ic_ac.svg" alt="AC" className="w-4 h-4" />
              <span className="text-sm text-gray-600">AC</span>
            </div>
            <div className="flex items-center gap-2">
              <img src="/ic_family_seat.svg" alt="Parking" className="w-4 h-4" />
              <span className="text-sm text-gray-600">Parking</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <p className="text-gray-500 text-sm">Starting from</p>
              <div className="text-lg font-bold text-black">
                {price}
              </div>
              <p className="text-green-500 text-sm">Special near station</p>
            </div>

            <div className="text-right">
              <button className="mt-2 px-6 py-2 bg-gradient-to-r from-[#6b46c1] to-[#3b82f6] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity">
                Choose Room
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;