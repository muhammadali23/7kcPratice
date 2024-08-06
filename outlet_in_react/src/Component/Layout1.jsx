import React from "react";
import { Outlet, Link } from "react-router-dom";
const Layout1 = () => {
  return (
    <div style={{ padding: "10px" }}>
      <div
        style={{
          width: "100%",
          height: "80vh",
          marginTop: "1rem",
          padding: "10px",
          border: "1px solid #ccc",
          display: "flex",
          gap: "20px",
        }}
      >
        <div
          style={{
            width: "20%",
            border: "1px solid #ccc",
            height: "100%",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <ul
            style={{
              listStyle: "none",
            }}
          >
            <li>
              <Link to="/profile/account">Account</Link>
            </li>
            <li>
              <Link to="/profile/setting">Setting</Link>
            </li>
            <li>
              <Link to="/profile/privacy">Privacy</Link>
            </li>
          </ul>
        </div>
        <div
          style={{
            width: "80%",
            height: "100%",
            border: "1px solid #ccc",
            padding: "20px",
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout1;
