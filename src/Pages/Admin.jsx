import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  LogOut,
  LayoutDashboard,
} from "lucide-react";

const Admin = () => {
  const navigate = useNavigate();

  const handleAdminLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRefreshToken");
    localStorage.removeItem("adminLoggedIn");

    navigate("/login");
  };

  return (
    <section
      style={{
        minHeight: "100vh",
        background: "#f8f7f3",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "30px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "650px",
          background: "#fff",
          padding: "55px 40px",
          borderRadius: "8px",
          textAlign: "center",
          boxShadow: "0 10px 35px rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            margin: "0 auto 20px",
            borderRadius: "50%",
            background: "#f5ead0",
            color: "#b88e2f",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ShieldCheck size={45} />
        </div>

        <p
          style={{
            color: "#b88e2f",
            fontSize: "13px",
            fontWeight: "700",
            letterSpacing: "2px",
            marginBottom: "10px",
          }}
        >
          ADMIN PORTAL
        </p>

        <h1
          style={{
            margin: "0 0 15px",
            fontSize: "32px",
            color: "#222",
          }}
        >
          Admin Login Successful
        </h1>

        <p
          style={{
            color: "#777",
            fontSize: "15px",
            lineHeight: "1.7",
            maxWidth: "480px",
            margin: "0 auto 30px",
          }}
        >
          Your admin authentication is working successfully.
          The complete administration dashboard is currently
          under development.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            disabled
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 22px",
              border: "none",
              borderRadius: "4px",
              background: "#eee",
              color: "#999",
              cursor: "not-allowed",
            }}
          >
            <LayoutDashboard size={18} />
            Dashboard Coming Soon
          </button>

          <button
            type="button"
            onClick={handleAdminLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 22px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              background: "#fff",
              color: "#333",
              cursor: "pointer",
            }}
          >
            <LogOut size={18} />
            Admin Logout
          </button>
        </div>
      </div>
    </section>
  );
};

export default Admin;