import { useEffect, useState } from "react";
import api from "../api/api";

function Dashboard() {
  const [data, setData] = useState({});

  useEffect(() => {
    api.get("/dashboard").then((res) => {
      setData(res.data);
    });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-4 gap-4">
        <div className="border p-4 rounded">
          <h2>Total Products</h2>

          <p>{data.total_products}</p>
        </div>

        <div className="border p-4 rounded">
          <h2>Total Customers</h2>

          <p>{data.total_customers}</p>
        </div>

        <div className="border p-4 rounded">
          <h2>Total Orders</h2>

          <p>{data.total_orders}</p>
        </div>

        <div className="border p-4 rounded">
          <h2>Inventory Value</h2>

          <p>₹ {data.inventory_value}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
