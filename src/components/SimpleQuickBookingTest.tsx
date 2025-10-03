import React from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useUserQuickBookingSimple } from '@/lib/hooks/useUserQuickBookingSimple';

export default function SimpleQuickBookingTest() {
  const { user } = useAuth();
  const { data, isLoading, error } = useUserQuickBookingSimple();

  // Get numeric user_id like mytickets does
  const rawUserId = user?.profile?.user_id;
  const numericUserId = rawUserId == null ? NaN : typeof rawUserId === "string" ? parseInt(rawUserId, 10) : (rawUserId as number);

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Simple Quick Booking Test</h2>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Simple Quick Booking Test</h2>
        <p className="text-red-600">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Simple Quick Booking Test</h2>
      
      <div className="mb-4">
        <p><strong>Auth User ID (UUID):</strong> {user?.id || 'Not logged in'}</p>
        <p><strong>Profile User ID (Numeric):</strong> {numericUserId || 'Not found'}</p>
        <p><strong>Message:</strong> {data?.message}</p>
        <p><strong>Is New User:</strong> {data?.isNewUser ? 'Yes' : 'No'}</p>
        <p><strong>Is Empty:</strong> {data?.isEmpty ? 'Yes' : 'No'}</p>
        <p><strong>Recommendations Count:</strong> {data?.recommendations?.length || 0}</p>
      </div>

      {data?.recommendations && data.recommendations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Recommendations:</h3>
          {data.recommendations.map((rec, index) => (
            <div key={index} className="p-4 bg-white rounded-lg border">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold">{rec.trainName} ({rec.trainCode})</h4>
                  <p className="text-sm text-gray-600">{rec.fromCity} → {rec.toCity}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">Rp {rec.price.toLocaleString('id-ID')}</p>
                  <p className="text-sm text-gray-600">{rec.date}</p>
                </div>
              </div>
              
              <div className="flex justify-between text-sm mb-2">
                <span>{rec.departureTime} - {rec.arrivalTime}</span>
                <span>{rec.duration}</span>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {rec.badges.map((badge, badgeIndex) => (
                  <span 
                    key={badgeIndex}
                    className={`px-2 py-1 text-xs rounded ${
                      badge.variant === 'premium' ? 'bg-purple-100 text-purple-800' :
                      badge.variant === 'new-generation' ? 'bg-blue-100 text-blue-800' :
                      badge.variant === 'available' ? 'bg-green-100 text-green-800' :
                      'bg-orange-100 text-orange-800'
                    }`}
                  >
                    {badge.text}
                  </span>
                ))}
                <span className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-800">
                  Traveled {rec.frequency}x
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}