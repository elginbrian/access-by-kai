interface Passenger {
  id: string;
  name: string;
  type: 'Adult' | 'Child' | 'Toddler' | string;
  isSelected: boolean;
}

const PassengerSelectionCard: React.FC<{
  passengers: Passenger[];
  onPassengerToggle: (id: string) => void;
  maxPorters: number;
}> = ({ passengers, onPassengerToggle, maxPorters }) => {
  const selectedCount = passengers.filter(p => p.isSelected).length;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-lg">
      <div className="flex items-center space-x-2 mb-4">
        <img src="/ic_family_seat.svg" alt="Select Passengers" className="w-8 h-8 p-1 bg-blue-100 rounded" />
        <h3 className="font-bold text-black">Select Passengers</h3>
      </div>

      <p className="text-xs text-gray-500 mb-4">Choose which passengers need the extra services</p>

      <div className="space-y-3">
        {passengers.map((passenger) => (
          <label key={passenger.id} className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={passenger.isSelected}
              onChange={() => onPassengerToggle(passenger.id)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">{passenger.name}</div>
              <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${passenger.type === 'Adult'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-green-100 text-green-700'
                }`}>
                {passenger.type}
              </div>
            </div>
          </label>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-800">
          <strong>Maximum porters allowed: {maxPorters}</strong> (equal to total passengers booked)
        </p>
      </div>
    </div>
  );
};

export default PassengerSelectionCard;