import { useState } from "react";
import api from "../api/api";

function CustomerForm({ refreshCustomers }) {
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await api.post("/customers", customer);

    refreshCustomers();

    setCustomer({
      name: "",
      email: "",
      phone: "",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-lg rounded-xl p-6 mb-6 border"
    >
      <h2 className="text-xl font-semibold mb-4">Add Customer</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          placeholder="Customer Name"
          value={customer.name}
          onChange={(e) =>
            setCustomer({
              ...customer,
              name: e.target.value,
            })
          }
          className="border rounded-lg px-4 py-2"
        />

        <input
          placeholder="Email"
          value={customer.email}
          onChange={(e) =>
            setCustomer({
              ...customer,
              email: e.target.value,
            })
          }
          className="border rounded-lg px-4 py-2"
        />

        <input
          placeholder="Phone"
          value={customer.phone}
          onChange={(e) =>
            setCustomer({
              ...customer,
              phone: e.target.value,
            })
          }
          className="border rounded-lg px-4 py-2"
        />
      </div>

      <button
        type="submit"
        className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
      >
        Add Customer
      </button>
    </form>
  );
}

export default CustomerForm;
