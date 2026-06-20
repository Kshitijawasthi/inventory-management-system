import { useState } from "react";
import api from "../api/api";

function ProductForm({ refreshProducts }) {
  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    description: "",
    price: "",
    stock_quantity: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/products", formData);

      alert("Product Created");

      setFormData({
        sku: "",
        name: "",
        description: "",
        price: "",
        stock_quantity: "",
      });

      refreshProducts();
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border p-4 mb-6">
      <h2 className="text-xl font-bold mb-4">Add Product</h2>

      <input
        name="sku"
        placeholder="SKU"
        value={formData.sku}
        onChange={handleChange}
        className="border p-2 mr-2"
      />

      <input
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        className="border p-2 mr-2"
      />

      <input
        name="price"
        placeholder="Price"
        value={formData.price}
        onChange={handleChange}
        className="border p-2 mr-2"
      />

      <input
        name="stock_quantity"
        placeholder="Stock"
        value={formData.stock_quantity}
        onChange={handleChange}
        className="border p-2 mr-2"
      />

      <button className="bg-blue-500 text-white px-4 py-2">Save</button>
    </form>
  );
}

export default ProductForm;
