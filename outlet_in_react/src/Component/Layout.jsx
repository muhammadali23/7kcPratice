import React from "react";
import { Link, Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div style={{ padding: "10px" }}>
      <div style={{ width: "100%", padding: "1rem", border: "1px solid #ccc" }}>
        <ul
          style={{
            listStyle: "none",
          }}
        >
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/service">Service</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
        </ul>
      </div>
      <div
        style={{
          width: "100%",
          height: "90vh",
          marginTop: "1rem",
          border: "1px solid #ccc",
          padding: "10px",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
