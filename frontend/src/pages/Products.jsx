import { useEffect, useState } from "react";
import api from "../service/api";

function Products() {
  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    price: "",
  });

  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data.products);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, formData);

        alert("Product Updated");
        setEditingProduct(null);
      } else {
        await api.post("/products", formData);

        alert("Product Added");
      }

      setFormData({
        name: "",
        quantity: "",
        price: "",
      });

      fetchProducts();
    } catch (error) {
      console.error(error);

      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  const editProduct = (product) => {
    setEditingProduct(product);

    setFormData({
      name: product.name,
      quantity: product.quantity,
      price: product.price,
    });
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete Product?")) return;

    try {
      await api.delete(`/products/${id}`);

      alert("Product Deleted");

      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Products</h1>

          <p className="text-gray-500 mt-2">Manage your inventory products</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingProduct ? "Edit Product" : "Add Product"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={formData.name}
                onChange={handleChange}
                className="border rounded-lg px-4 py-3"
                required
              />

              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="border rounded-lg px-4 py-3"
                required
              />

              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                className="border rounded-lg px-4 py-3"
                required
              />
            </div>

            <button
              type="submit"
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
            >
              {editingProduct ? "Update Product" : "Add Product"}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">Product List</h2>
          </div>

          <table className="w-full">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="p-4 text-left">ID</th>

                <th className="p-4 text-left">Name</th>

                <th className="p-4 text-left">Quantity</th>

                <th className="p-4 text-left">Price</th>

                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">{product.id}</td>

                    <td className="p-4">{product.name}</td>

                    <td className="p-4">{product.quantity}</td>

                    <td className="p-4">₹{product.price}</td>

                    <td className="p-4">
                      <button
                        onClick={() => editProduct(product)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-6">
                    No Products Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Products;
