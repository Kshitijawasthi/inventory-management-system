import { useEffect, useState } from "react";
import api from "../service/api";
import CustomerForm from "../components/CustomerForm";

function Customers() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await api.get("/customers");
      setCustomers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Customers</h1>

          <p className="text-gray-500 mt-2">Manage your customer records</p>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700">
            Total Customers
          </h2>

          <p className="text-3xl font-bold text-blue-600 mt-2">
            {customers.length}
          </p>
        </div>

        {/* Customer Form */}
        <CustomerForm refreshCustomers={fetchCustomers} />

        {/* Customer Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">Customer List</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="p-4 text-left">ID</th>
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Phone</th>
                </tr>
              </thead>

              <tbody>
                {customers.length > 0 ? (
                  customers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="p-4 font-medium">#{customer.id}</td>

                      <td className="p-4">{customer.name}</td>

                      <td className="p-4 text-gray-600">{customer.email}</td>

                      <td className="p-4 text-gray-600">{customer.phone}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center p-8 text-gray-500">
                      No customers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Customers;
