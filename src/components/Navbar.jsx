import React, { useState, useEffect } from "react";
import {
  FaChartLine,
  FaSearch,
  FaReceipt,
  FaUserShield
} from "react-icons/fa";

import "./Css/Navbar.css";
import Admin from "./Admin";
import User from "./User"; // Make sure you have created this component file
import Transactions from "./Transactions";
import Dashboard from "./Dashboard";
import Fraud from "./Fraud";

const Navbar = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [userRole, setUserRole] = useState("USER"); // Default to 'USER' for safety

  // Check localStorage for user role on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // Update role if it exists, otherwise default to USER
        if (parsedUser && parsedUser.role) {
          setUserRole(parsedUser.role);
        }
      } catch (error) {
        console.error("Error parsing user data from local storage", error);
      }
    }
  }, []);

  const renderComponent = () => {
    switch (activeTab) {
      case "fraud":
        return <Fraud />;
      case "transactions":
        return <Transactions />;
      case "admin":
        // Security check: Only render Admin component if role is NOT USER
        // If a USER tries to force this state, we fallback to Dashboard
        return userRole !== "USER" ? <Admin /> : <Dashboard />;
      case "user":
        // Explicitly handle the 'user' tab
        return <User />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      <nav className="navbar">
        <ul className="nav-list">
          <li
            className={`nav-item ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            <FaChartLine />
            <span>Dashboard</span>
          </li>

          {/* <li
            className={`nav-item ${activeTab === "fraud" ? "active" : ""}`}
            onClick={() => setActiveTab("fraud")}
          >
            <FaSearch />
            <span>Fraud</span>
          </li> */}

          <li
            className={`nav-item ${activeTab === "transactions" ? "active" : ""}`}
            onClick={() => setActiveTab("transactions")}
          >
            <FaReceipt />
            <span> Manual Transactions</span>
          </li>

          {/* CONDITIONAL RENDERING: ADMIN vs USER */}
          {userRole !== "USER" ? (
            // Show Admin Tab for non-users
            <li
              className={`nav-item admin ${activeTab === "admin" ? "active" : ""}`}
              onClick={() => setActiveTab("admin")}
            >
              <FaUserShield />
              <span>Admin</span>
            </li>
          ) : (
            // Show User Tab for users
            <li
              className={`nav-item admin ${activeTab === "user" ? "active" : ""}`}
              onClick={() => setActiveTab("user")}
            >
              <FaUserShield />
              <span>User</span>
            </li>
          )}
        </ul>
      </nav>

      <div className="page-container">
        <div key={activeTab} className="page">
          {renderComponent()}
        </div>
      </div>
    </>
  );
};

export default Navbar;