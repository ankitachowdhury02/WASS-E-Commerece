
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  ArrowLeft,
  CalendarDays,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  XCircle,
  ShoppingBag,
  RefreshCw,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import "./Orders.css";

const API_URL = "https://ecomm-qy13.onrender.com";

const Orders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);

  const [productImages, setProductImages] = useState({});

  // =====================================================
  // FORMAT PRICE
  // =====================================================

  const formatPrice = (price) => {
    return Number(price ?? 0).toLocaleString("en-IN");
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date unavailable";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =====================================================
  // GET ORDER ID
  // =====================================================

  const getOrderId = (order) => {
    return order.id ?? order.orderId ?? order._id ?? "N/A";
  };

  // =====================================================
  // GET ORDER DATE
  // =====================================================

  const getOrderDate = (order) => {
    return (
      order.createdAt ||
      order.created_at ||
      order.orderDate ||
      order.date
    );
  };

  // =====================================================
  // GET ORDER STATUS
  // =====================================================

  const getOrderStatus = (order) => {
    return order.status || order.orderStatus || "PENDING";
  };

  // =====================================================
  // GET PAYMENT METHOD
  // =====================================================

  const getPaymentMethod = (order) => {
    return order.paymentMethod || order.payment_method || "N/A";
  };

  // =====================================================
  // GET ORDER TOTAL
  // =====================================================

  const getOrderTotal = (order) => {
    return Number(
      order.total ??
        order.grandTotal ??
        order.subtotal ??
        order.amount ??
        0
    );
  };

  // =====================================================
  // FETCH ORDERS
  // =====================================================

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login to view your orders.");
        navigate("/login");
        return;
      }

      const response = await fetch(`${API_URL}/api/orders`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log("ORDERS API RESPONSE:", data);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            "Failed to fetch orders."
        );
      }

      let orderList = [];

      if (Array.isArray(data)) {
        orderList = data;
      } else if (Array.isArray(data.orders)) {
        orderList = data.orders;
      } else if (Array.isArray(data.data)) {
        orderList = data.data;
      } else if (Array.isArray(data.result)) {
        orderList = data.result;
      } else if (data.order) {
        orderList = [data.order];
      }

      setOrders(orderList);
    } catch (err) {
      console.error("FETCH ORDERS ERROR:", err);

      setError(err.message || "Unable to load your orders.");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD ORDERS ON PAGE OPEN
  // =====================================================

  useEffect(() => {
    fetchOrders();
  }, []);

  // =====================================================
  // LOAD PRODUCT IMAGES WHEN MISSING FROM ORDER ITEMS
  // =====================================================

  useEffect(() => {
    let cancelled = false;

    const loadMissingProductImages = async () => {
      const token = localStorage.getItem("token");

      const productIds = [
        ...new Set(
          orders
            .flatMap((order) =>
              Array.isArray(order.items) ? order.items : []
            )
            .filter((item) => {
              const product = item.product || {};
              const images = product.images;

              const existingImage =
                item.image ||
                item.productImage ||
                product.image ||
                product.imageUrl ||
                product.thumbnail ||
                (Array.isArray(images)
                  ? typeof images[0] === "string"
                    ? images[0]
                    : images[0]?.url || images[0]?.imageUrl
                  : typeof images === "string"
                    ? images
                    : "");

              return item.productId && !existingImage;
            })
            .map((item) => item.productId)
        ),
      ];

      if (productIds.length === 0) return;

      const imageEntries = await Promise.all(
        productIds.map(async (productId) => {
          try {
            const response = await fetch(
              `${API_URL}/api/products/${productId}`,
              {
                headers: token
                  ? {
                      Authorization: `Bearer ${token}`,
                    }
                  : {},
              }
            );

            if (!response.ok) return null;

            const data = await response.json();

            const product =
              data.product ||
              data.data ||
              data.item ||
              data;

            const images = product.images;

            const image =
              product.image ||
              (Array.isArray(images)
                ? typeof images[0] === "string"
                  ? images[0]
                  : images[0]?.url || images[0]?.imageUrl
                : typeof images === "string"
                  ? images
                  : "") ||
              product.imageUrl ||
              product.thumbnail ||
              "";

            return image ? [productId, image] : null;
          } catch (err) {
            console.error(
              `Failed to load product image ${productId}:`,
              err
            );

            return null;
          }
        })
      );

      if (cancelled) return;

      const imageMap = Object.fromEntries(
        imageEntries.filter(Boolean)
      );

      setProductImages((previous) => ({
        ...previous,
        ...imageMap,
      }));
    };

    if (orders.length > 0) {
      loadMissingProductImages();
    }

    return () => {
      cancelled = true;
    };
  }, [orders]);

  // =====================================================
  // OPEN CANCEL CONFIRMATION MODAL
  // =====================================================

  const handleCancelOrder = (order) => {
    if (cancellingOrderId !== null) return;

    setSelectedOrder(order);
    setShowCancelModal(true);
  };

  // =====================================================
  // CLOSE MODAL WITHOUT CANCELLING
  // =====================================================

  const handleKeepOrder = () => {
    if (cancellingOrderId !== null) return;

    setShowCancelModal(false);
    setSelectedOrder(null);
  };

  // =====================================================
  // CONFIRM CANCELLATION THROUGH EXISTING API
  // =====================================================

  const confirmCancelOrder = async () => {
    if (!selectedOrder || cancellingOrderId !== null) {
      return;
    }

    const orderId = getOrderId(selectedOrder);

    if (orderId === "N/A") {
      toast.error("Order ID is unavailable.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first.");

        setShowCancelModal(false);
        setSelectedOrder(null);

        navigate("/login");
        return;
      }

      setCancellingOrderId(orderId);

      const response = await fetch(
        `${API_URL}/api/orders/${orderId}/cancel`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("CANCEL ORDER RESPONSE:", data);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            "Failed to cancel order."
        );
      }

      toast.success(
        data?.message || "Order cancelled successfully!"
      );

      setShowCancelModal(false);
      setSelectedOrder(null);

      await fetchOrders();
    } catch (err) {
      console.error("CANCEL ORDER ERROR:", err);

      toast.error(
        err.message || "Unable to cancel order."
      );
    } finally {
      setCancellingOrderId(null);
    }
  };

  // =====================================================
  // LOADING STATE
  // =====================================================

  if (loading) {
    return (
      <section className="orders-page">
        <div className="orders-loading">
          <div className="orders-spinner"></div>
          <p>Loading your orders...</p>
        </div>
      </section>
    );
  }

  // =====================================================
  // ERROR STATE
  // =====================================================

  if (error) {
    return (
      <section className="orders-page">
        <div className="orders-state">
          <Package size={50} />

          <h2>Unable to load orders</h2>

          <p>{error}</p>

          <button
            className="orders-retry-btn"
            onClick={fetchOrders}
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      </section>
    );
  }

  // =====================================================
  // EMPTY ORDERS STATE
  // =====================================================

  if (orders.length === 0) {
    return (
      <section className="orders-page">
        <div className="orders-top">
          <div>
            <p className="orders-small-title">MY ACCOUNT</p>
            <h1>My Orders</h1>
          </div>

          <button
            className="back-button"
            onClick={() => navigate("/shop")}
          >
            <ArrowLeft size={18} />
            Continue Shopping
          </button>
        </div>

        <div className="orders-state">
          <ShoppingBag size={55} />

          <h2>No orders yet</h2>

          <p>You haven't placed any orders yet.</p>

          <button
            className="shop-now-button"
            onClick={() => navigate("/shop")}
          >
            Start Shopping
          </button>
        </div>
      </section>
    );
  }

  // =====================================================
  // MAIN ORDERS PAGE
  // =====================================================

  return (
    <section className="orders-page">
      {/* PAGE HEADER */}
      <div className="orders-top">
        <div>
          <p className="orders-small-title">MY ACCOUNT</p>

          <h1>My Orders</h1>

          <p className="orders-description">
            Track and manage all your orders from one place.
          </p>
        </div>

        <button
          className="back-button"
          onClick={() => navigate("/shop")}
        >
          <ArrowLeft size={18} />
          Continue Shopping
        </button>
      </div>

      {/* ORDER COUNT */}
      <div className="orders-count">
        <Package size={18} />

        <span>
          {orders.length}{" "}
          {orders.length === 1 ? "Order" : "Orders"}
        </span>
      </div>

      {/* ORDER CARDS */}
      <div className="orders-list">
        {orders.map((order, index) => {
          const orderId = getOrderId(order);
          const status = getOrderStatus(order);
          const total = getOrderTotal(order);
          const paymentMethod = getPaymentMethod(order);
          const orderDate = getOrderDate(order);

          // Customer information is nested inside shippingAddress
          const shipping = order.shippingAddress || {};

          const customerName = [
            shipping.firstName,
            shipping.lastName,
          ]
            .filter(Boolean)
            .join(" ");

          const address = [
            shipping.streetAddress,
            shipping.city,
            shipping.state,
            shipping.pinCode,
            shipping.country,
          ]
            .filter(Boolean)
            .join(", ");

          const phone = shipping.phone || "Not available";
          const email = shipping.email || "N/A";

          const normalizedStatus = String(status).toLowerCase();

          const isCancelled = normalizedStatus === "cancelled";
          const isDelivered = normalizedStatus === "delivered";

          const items = Array.isArray(order.items)
            ? order.items
            : [];

          return (
            <article
              className="order-card"
              key={orderId !== "N/A" ? orderId : index}
            >
              {/* ORDER HEADER */}
              <div className="order-card-header">
                <div>
                  <span className="order-label">ORDER</span>
                  <h2>#{orderId}</h2>
                </div>

                <span
                  className={`order-status ${normalizedStatus.replace(
                    /\s+/g,
                    "-"
                  )}`}
                >
                  {status}
                </span>
              </div>

              {/* ORDER INFORMATION */}
              <div className="order-info-grid">
                <div className="order-info-item">
                  <CalendarDays size={18} />

                  <div>
                    <span>Order Date</span>
                    <strong>{formatDate(orderDate)}</strong>
                  </div>
                </div>

                <div className="order-info-item">
                  <CreditCard size={18} />

                  <div>
                    <span>Payment Method</span>
                    <strong>{paymentMethod}</strong>

                    {order.paymentStatus && (
                      <small>
                        Payment status: {order.paymentStatus}
                      </small>
                    )}
                  </div>
                </div>

                <div className="order-info-item">
                  <MapPin size={18} />

                  <div>
                    <span>Delivery Address</span>

                    <strong>
                      {address || "Address unavailable"}
                    </strong>
                  </div>
                </div>

                <div className="order-info-item">
                  <Phone size={18} />

                  <div>
                    <span>Phone</span>
                    <strong>{phone}</strong>
                  </div>
                </div>
              </div>

              {/* CUSTOMER DETAILS */}
              <div className="customer-details">
                <div>
                  <span>Customer</span>

                  <strong>
                    {customerName || "Name unavailable"}
                  </strong>
                </div>

                <div>
                  <span>
                    <Mail size={13} /> Email
                  </span>

                  <strong>{email}</strong>
                </div>
              </div>

              {/* PREMIUM ORDER ITEMS */}
              {items.length > 0 && (
                <div className="order-items">
                  <div className="order-items-heading">
                    <div>
                      <h3>Items in this order</h3>

                      <p>
                        {items.length}{" "}
                        {items.length === 1
                          ? "product"
                          : "products"}{" "}
                        purchased
                      </p>
                    </div>

                    <Package size={22} />
                  </div>

                  <div className="order-items-list">
                    {items.map((item, itemIndex) => {
                      const product = item.product || {};
                      const images = product.images;

                      const image =
                        item.image ||
                        item.productImage ||
                        product.image ||
                        product.imageUrl ||
                        product.thumbnail ||
                        (Array.isArray(images)
                          ? typeof images[0] === "string"
                            ? images[0]
                            : images[0]?.url ||
                              images[0]?.imageUrl
                          : typeof images === "string"
                            ? images
                            : "") ||
                        productImages[item.productId] ||
                        "";

                      const quantity = Number(item.quantity ?? 1);
                      const price = Number(item.price ?? 0);

                      return (
                        <div
                          className="order-item-card"
                          key={item.id ?? itemIndex}
                        >
                          {/* PRODUCT IMAGE */}
                          <div className="order-item-image">
                            {image && (
                              <img
                                src={image}
                                alt={
                                  item.productName ||
                                  item.name ||
                                  "Ordered product"
                                }
                                loading="lazy"
                                onError={(event) => {
                                  event.currentTarget.style.display =
                                    "none";

                                  const placeholder =
                                    event.currentTarget
                                      .nextElementSibling;

                                  if (placeholder) {
                                    placeholder.style.display = "flex";
                                  }
                                }}
                              />
                            )}

                            <div
                              className="order-item-image-placeholder"
                              style={{
                                display: image ? "none" : "flex",
                              }}
                            >
                              <ShoppingBag size={30} />
                              <span>No image</span>
                            </div>
                          </div>

                          {/* PRODUCT DETAILS */}
                          <div className="order-item-details">
                            <span className="order-item-label">
                              FURNIRO PRODUCT
                            </span>

                            <h4>
                              {item.productName ||
                                item.name ||
                                product.name ||
                                "Product"}
                            </h4>

                            <div className="order-item-meta">
                              <span>Qty: {quantity}</span>

                              <span className="order-item-unit-price">
                                ₹{formatPrice(price)} / item
                              </span>
                            </div>
                          </div>

                          {/* ITEM TOTAL */}
                          <div className="order-item-total">
                            <span>Item Total</span>

                            <strong>
                              ₹{formatPrice(price * quantity)}
                            </strong>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ORDER FOOTER */}
              <div className="order-card-footer">
                <div>
                  <span>Order Total</span>

                  <strong>
                    ₹ {formatPrice(total)}
                  </strong>
                </div>

                {!isCancelled && !isDelivered && (
                  <div className="order-actions">
                    <button
                      className="cancel-order-btn"
                      onClick={() => handleCancelOrder(order)}
                      disabled={cancellingOrderId !== null}
                    >
                      <XCircle size={17} />
                      Cancel Order
                    </button>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* CUSTOM CANCEL CONFIRMATION MODAL */}
      {showCancelModal && selectedOrder && (
        <div
          className="cancel-modal-overlay"
          onClick={handleKeepOrder}
        >
          <div
            className="cancel-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="cancel-modal-close"
              aria-label="Close confirmation"
              onClick={handleKeepOrder}
              disabled={cancellingOrderId !== null}
            >
              <X size={20} />
            </button>

            <div className="cancel-modal-icon">
              <XCircle size={30} />
            </div>

            <h2 id="cancel-modal-title">Cancel Order?</h2>

            <p>
              Are you sure you want to cancel order{" "}
              <strong>#{getOrderId(selectedOrder)}</strong>?
            </p>

            <p className="cancel-modal-description">
              If you continue, a cancellation request will
              be sent for this order.
            </p>

            <div className="cancel-modal-actions">
              <button
                type="button"
                className="keep-order-btn"
                onClick={handleKeepOrder}
                disabled={cancellingOrderId !== null}
              >
                No, Keep Order
              </button>

              <button
                type="button"
                className="confirm-cancel-btn"
                onClick={confirmCancelOrder}
                disabled={cancellingOrderId !== null}
              >
                {cancellingOrderId !== null
                  ? "Cancelling..."
                  : "Yes, Cancel Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Orders;
