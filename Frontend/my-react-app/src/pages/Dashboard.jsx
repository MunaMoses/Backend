// src/components/Dashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

// Images
import img1 from "../assets/img1.jpg";
import img2 from "../assets/img2.jpg";
import img3 from "../assets/img3.jpg";
import img4 from "../assets/img4.jpg";

import "./Dashboard.css"; // ← put the CSS below in this file

const API_BASE = "http://127.0.0.1:8000";

const Dashboard = () => {
  const [activePage, setActivePage] = useState("home");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [slideImage, setSlideImage] = useState(0);

  const slideImages = [img1, img2, img3, img4];

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/products/`);
      setProducts(res.data || []);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_BASE}/cart/`);
      setOrders(res.data || []);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideImage((prev) => (prev + 1) % slideImages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const handleMakeOrder = async (product) => {
    const phone = prompt("Enter phone number for payment:");
    if (!phone) {
      alert("Phone number is required!");
      return;
    }
    const bank = prompt("Bank name (optional):") || "";

    const controlNumber = Math.floor(100000 + Math.random() * 900000);
    alert(`Payment confirmed!\nControl number: ${controlNumber}`);

    try {
      await axios.post(`${API_BASE}/cart/`, {
        product: product.id,
        quantity: 1,
        phone,
        bank,
      });
      alert("Order placed successfully!");
      fetchOrders();
      setActivePage("recent");
    } catch (err) {
      console.error(err);
      alert("Failed to place order");
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
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
            <span className="nav-icon">🛍️</span>Make Order
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

      {/* Main content */}
      <main className="main-content">
        {/* HOME */}
        {activePage === "home" && (
          <section className="home-section">
            <div className="slider-wrapper">
              <img
                src={slideImages[slideImage]}
                alt="promotion"
                className="slider-image"
              />
            </div>
            <h2>Welcome to Wholesale System</h2>
            <p className="lead-text">
              Connect with verified suppliers • Place bulk orders quickly • Grow your business efficiently
            </p>
          </section>
        )}

        {/* PRODUCTS / MAKE ORDER */}
        {activePage === "cart" && (
          <section>
            <h2>Available Products</h2>
            <div className="products-grid">
              {products.length === 0 ? (
                <p className="empty-state">Loading products...</p>
              ) : (
                products.map((product) => (
                  <div key={product.id} className="product-card">
                    <h3>{product.name}</h3>
                    <p className="description">{product.description || "—"}</p>
                    <div className="price">TSh {product.price.toLocaleString()}</div>
                    <button
                      className="btn-primary"
                      onClick={() => handleMakeOrder(product)}
                    >
                      Place Order
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {/* RECENT ORDERS – two columns */}
        {activePage === "recent" && (
          <section>
            <h2>Recent Orders</h2>

            {orders.length === 0 ? (
              <p className="empty-state">No orders placed yet.</p>
            ) : (
              <div className="orders-grid">
                {orders.map((order) => {
                  const dateStr = order.created_at
                    ? new Date(order.created_at).toLocaleString("en-GB", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                    : "—";

                  return (
                    <div key={order.id} className="order-card">
                      <h3 className="order-title">Order #{order.id}</h3>
                      <div className="order-details">
                        <div>
                          <strong>Product:</strong> {order.product?.name || "—"}
                        </div>
                        <div>
                          <strong>Quantity:</strong> {order.quantity}
                        </div>
                        <div>
                          <strong>Total:</strong>{" "}
                          {order.total_price
                            ? `TSh ${order.total_price.toLocaleString()}`
                            : `TSh ${(order.product?.price * order.quantity || 0).toLocaleString()}`}
                        </div>
                        <div>
                          <strong>Status:</strong>{" "}
                          <span className={`status ${order.status || "pending"}`}>
                            {(order.status || "Pending").charAt(0).toUpperCase() +
                              (order.status || "Pending").slice(1)}
                          </span>
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

        {/* ABOUT */}
        {activePage === "about" && (
          <section>
            <h2>About Wholesale System</h2>
            <p>
              A modern platform connecting wholesale buyers and suppliers in Zanzibar and beyond.
            </p>
            <div className="contact-info">
              <p>📞 +255 785 574 216</p>
              <p>✉️ munamoses1@gmail.com</p>
            </div>
            <p className="copyright">
              © {new Date().getFullYear()} Wholesale System
            </p>
          </section>
        )}
      </main>
    </div>
  );
};

export default Dashboard;