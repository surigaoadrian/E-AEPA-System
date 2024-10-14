import React, { useEffect, useState } from "react";
import "../styles/sidebarStyles.css";
import { NavLink } from "react-router-dom";
import { SideBarData } from "../data/sideBarData";

function SideBar() {
  const [userRole, setUserRole] = useState("");
  const [filteredSideBarData, setFilteredSideBarData] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    const role = sessionStorage.getItem("userRole");
    setUserRole(role);

    const filteredData = SideBarData.filter(
      (item) => item.role.includes(role) || item.role.includes("ALL")
    );

    setFilteredSideBarData(filteredData);
  }, []);

  console.log(filteredSideBarData);

  const toggleDropdown = (index) => { 
    setOpenDropdown(openDropdown === index ? null : index);
  };

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
      {filteredSideBarData.map((item, index) => {
        return (
          <div key={index} style={{ paddingTop: "5px", fontSize: "15px" }}>
            {/* Check if item has subItems for dropdown */}
            {item.subItems ? (
              <>
                <div
                  onClick={() => toggleDropdown(index)} // Toggle dropdown
                  style={{ cursor: "pointer", display: "flex", alignItems: "right",  paddingLeft: "29px",}}
                >
                  <span style={{ marginRight: "18px" }}>{item.icon}</span>
                  <span style={{ margin: item.margin }}>{item.title}</span>
                </div>
                {openDropdown === index && ( // Check if dropdown is open
                  <div style={{ paddingLeft: "23px", marginTop: "5px" }}>
                    {item.subItems.map((subItem, subIndex) => (
                      <NavLink key={subIndex} className="dropdown-subitem nav-link" to={subItem.path} activeClassName="active">
                        <span style={{ marginRight: "15px" }}>{subItem.icon}</span>
                        <span style={{ margin: item.margin }}>{subItem.title}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div id="linkStyle">
                <NavLink className="nav-link" to={item.path}>
                  <span style={{ marginRight: "15px" }}>{item.icon}</span>
                  <span style={{ margin: item.margin }}>{item.title}</span>
                </NavLink>
              </div>
            )}
          </div>
        );
      })}
    </div>
  </div>
);
}

export default SideBar;
