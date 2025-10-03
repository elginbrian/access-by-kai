import SimpleQuickBookingTest from '@/components/SimpleQuickBookingTest';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Quick Booking Test</h1>
        <SimpleQuickBookingTest />
      </div>
    </div>
  );
}