import React, { useEffect, useState } from "react";
import "../styles/sidebarStyles.css";
import { NavLink } from "react-router-dom";
import { SideBarData } from "../data/sideBarData";

function SideBar() {
  const [userRole, setUserRole] = useState("");
  const [filteredSideBarData, setFilteredSideBarData] = useState([]);

  useEffect(() => {
    const role = sessionStorage.getItem("userRole");
    setUserRole(role);

    const filteredData = SideBarData.filter(
      (item) => item.role.includes(role) || item.role.includes("ALL")
    );

    setFilteredSideBarData(filteredData);
  }, []);

  const sidebarStyles = {
    height: "92vh",
    width: "229px",
    backgroundColor: "#FFFFFF",
    paddingTop: "10px",
    borderTop: "3px solid #F8C702",
    overflowY: "auto",
  };

  return (
    <div>
      <div style={sidebarStyles}>
        {filteredSideBarData.map((item, index) => (
          <div key={index} style={{ paddingTop: "5px", fontSize: "15px" }}>
            {/* Check if item has subItems */}
            {item.subItems ? (
  <>
    {/* Render the parent item without NavLink */}
    <div id="linkStyle">
      <span className="nav-title">
        <span style={{ marginRight: "18px" }}>{item.icon}</span>
        <span style={{ margin: item.margin }}>{item.title}</span>
      </span>
    </div>

    {/* Render sub-items immediately, no dropdown */}
    <div style={{ paddingLeft: "2px", marginTop: "5px" }}>
      {item.subItems.map((subItem, subIndex) => (
        <NavLink
          key={subIndex}
          className="dropdown-subitem nav-link"
          to={subItem.path}
          activeClassName="active"
        >
          <span style={{ marginRight: "15px" }}>{subItem.icon}</span>
          <span style={{ margin: item.margin }}>{subItem.title}</span>
        </NavLink>
      ))}
    </div>
  </>
) : (
  // Render regular items without subItems
  <div id="linkStyle">
    <NavLink className="nav-link" to={item.path}>
      <span style={{ marginRight: "15px" }}>{item.icon}</span>
      <span style={{ margin: item.margin }}>{item.title}</span>
    </NavLink>
  </div>
)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SideBar;

