import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

import img1 from "../assets/img1.jpg";
import img2 from "../assets/img2.jpg";
import img3 from "../assets/img3.jpg";
import img4 from "../assets/img4.jpg";
import "./Dashboard.css";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/+$/, "");

const formatCurrency = (value) => {
  const numeric = Number(value || 0);
  return Number.isFinite(numeric) ? numeric.toLocaleString() : "0";
};

const Dashboard = () => {
  const [activePage, setActivePage] = useState("home");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [slideImage, setSlideImage] = useState(0);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [productsError, setProductsError] = useState("");
  const [ordersError, setOrdersError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const slideImages = [img1, img2, img3, img4];

  const fetchProducts = async () => {
    setLoadingProducts(true);
    setProductsError("");
    try {
      const res = await axios.get(`${API_BASE}/products/`);
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch products", err);
      setProductsError("Unable to load products right now.");
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    setOrdersError("");
    try {
      const res = await axios.get(`${API_BASE}/cart/`);
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch orders", err);
      setOrdersError("Unable to load recent orders.");
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideImage((prev) => (prev + 1) % slideImages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [slideImages.length]);

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const max = maxPrice.trim() ? Number(maxPrice) : null;

    return products.filter((product) => {
      const matchesTerm =
        !term ||
        String(product.name || "").toLowerCase().includes(term) ||
        String(product.description || "").toLowerCase().includes(term);
      const price = Number(product.price || 0);
      const matchesPrice = max === null || (Number.isFinite(price) && price <= max);
      return matchesTerm && matchesPrice;
    });
  }, [products, searchTerm, maxPrice]);

  const handleMakeOrder = async (product) => {
    const phone = prompt("Enter phone number for payment:");
    if (!phone) {
      alert("Phone number is required.");
      return;
    }
    const bank = prompt("Bank name (optional):") || "";

    try {
      await axios.post(`${API_BASE}/cart/`, {
        product: product.id,
        quantity: 1,
        phone,
        bank,
      });
      alert("Order placed successfully.");
      fetchOrders();
      setActivePage("recent");
    } catch (err) {
      console.error("Failed to place order", err);
      alert("Failed to place order.");
    }
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <span className="icon">🛒</span>
          <h1>Wholesale System</h1>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activePage === "home" ? "active" : ""}`}
            onClick={() => setActivePage("home")}
          >
            <span className="nav-icon">🏠</span>Home
          </button>

          <button
            className={`nav-item ${activePage === "cart" ? "active" : ""}`}
            onClick={() => setActivePage("cart")}
          >
            <span className="nav-icon">🧾</span>Make Order
          </button>

          <button
            className={`nav-item ${activePage === "recent" ? "active" : ""}`}
            onClick={() => {
              fetchOrders();
              setActivePage("recent");
            }}
          >
            <span className="nav-icon">📋</span>Recent Orders
          </button>

          <button
            className={`nav-item ${activePage === "about" ? "active" : ""}`}
            onClick={() => setActivePage("about")}
          >
            <span className="nav-icon">ℹ️</span>About
          </button>
        </nav>
      </aside>

      <main className="main-content">
        {activePage === "home" && (
          <section className="home-section">
            <div className="slider-wrapper">
              <img src={slideImages[slideImage]} alt="promotion" className="slider-image" />
            </div>
            <h2>Welcome to Wholesale System</h2>
            <p className="lead-text">
              Connect with verified suppliers, place bulk orders quickly, and grow your business
              efficiently.
            </p>
          </section>
        )}

        {activePage === "cart" && (
          <section>
            <h2>Available Products</h2>

            <div className="filters">
              <input
                type="text"
                placeholder="Search by product name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <input
                type="number"
                min="0"
                placeholder="Max price (TSh)"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>

            {loadingProducts && <p className="empty-state">Loading products...</p>}
            {!loadingProducts && productsError && <p className="error-state">{productsError}</p>}
            {!loadingProducts && !productsError && filteredProducts.length === 0 && (
              <p className="empty-state">No products available for the current filter.</p>
            )}

            {!loadingProducts && !productsError && filteredProducts.length > 0 && (
              <div className="products-grid">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="product-card">
                    <div className="product-image-wrap">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="product-image" />
                      ) : (
                        <div className="product-image-fallback">No Image</div>
                      )}
                    </div>
                    <h3>{product.name}</h3>
                    <p className="description">{product.description || "No description provided."}</p>
                    <div className="price">TSh {formatCurrency(product.price)}</div>
                    <button className="btn-primary" onClick={() => handleMakeOrder(product)}>
                      Place Order
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {activePage === "recent" && (
          <section>
            <h2>Recent Orders</h2>

            {loadingOrders && <p className="empty-state">Loading recent orders...</p>}
            {!loadingOrders && ordersError && <p className="error-state">{ordersError}</p>}
            {!loadingOrders && !ordersError && orders.length === 0 && (
              <p className="empty-state">No orders placed yet.</p>
            )}

            {!loadingOrders && !ordersError && orders.length > 0 && (
              <div className="orders-grid">
                {orders.map((order) => {
                  const dateStr = order.created_at
                    ? new Date(order.created_at).toLocaleString("en-GB", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                    : "-";
                  const unitPrice = Number(order.product?.price || 0);
                  const total = Number(order.total_price || unitPrice * Number(order.quantity || 0));

                  return (
                    <div key={order.id} className="order-card">
                      <h3 className="order-title">Order #{order.id}</h3>
                      <div className="order-details">
                        <div>
                          <strong>Product:</strong> {order.product?.name || "-"}
                        </div>
                        <div>
                          <strong>Quantity:</strong> {order.quantity}
                        </div>
                        <div>
                          <strong>Total:</strong> TSh {formatCurrency(total)}
                        </div>
                        <div className="order-time">
                          <span className="clock-icon">🕒</span> {dateStr}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {activePage === "about" && (
          <section>
            <h2>About Wholesale System</h2>
            <p>A modern platform connecting wholesale buyers and suppliers in Zanzibar and beyond.</p>
            <div className="contact-info">
              <p>📞 +255 785 574 216</p>
              <p>✉️ munamoses1@gmail.com</p>
            </div>
            <p className="copyright">© {new Date().getFullYear()} Wholesale System</p>
          </section>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
