const orders = [
    { id: '#1234', customer: 'John Doe', amount: '$150', status: 'Completed' },
    { id: '#1235', customer: 'Jane Smith', amount: '$75', status: 'Pending' },
    { id: '#1236', customer: 'Alice Johnson', amount: '$320', status: 'Shipped' },
  ];
  
  export default function RecentOrdersTable() {
    return (
      <section className="bg-white p-5 sm:p-2 rounded-2xl shadow-md hover:shadow-lg transition">
        <h2 className="text-xl sm:text-2xl font-semibold text-[var(--color-primary)] mb-5">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm sm:text-base text-gray-700">
            <thead>
              <tr className="bg-gray-100 text-gray-600">
                <th className="py-3 px-4 text-left">Order ID</th>
                <th className="py-3 px-4 text-left">Customer</th>
                <th className="py-3 px-4 text-left">Amount</th>
                <th className="py-3 px-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t hover:bg-gray-50 transition">
                  <td className="py-3 px-4">{order.id}</td>
                  <td className="py-3 px-4">{order.customer}</td>
                  <td className="py-3 px-4">{order.amount}</td>
                  <td
                    className={`py-3 px-4 font-semibold ${
                      order.status === 'Completed'
                        ? 'text-green-500'
                        : order.status === 'Pending'
                        ? 'text-yellow-500'
                        : 'text-blue-500'
                    }`}
                  >
                    {order.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  }
  