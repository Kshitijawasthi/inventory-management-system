import { useEffect, useState } from "react";
import api from "../service/api";

function Inventory() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchLowStock();
  }, []);

  const fetchLowStock = async () => {
    try {
      const response = await api.get("/low-stock");
      setProducts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Inventory Alerts</h2>

      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>

              <td>{product.quantity}</td>

              <td>
                {product.quantity < 5 && (
                  <span style={{ color: "red" }}>Low Stock</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Inventory;
