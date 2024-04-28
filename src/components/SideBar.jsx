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
      (item) => item.role === role || item.role === "ALL"
    );
    setFilteredSideBarData(filteredData);
  }, []);

  console.log(filteredSideBarData);

  const sidebarStyles = {
    height: "92vh",
    width: "229px",
    backgroundColor: "#FFFFFF",
    paddingTop: "10px",
    borderTop: "3px solid #F8C702",
  };

  return (
    <div>
      <div style={sidebarStyles}>
        {filteredSideBarData.map((item, index) => {
          return (
            <div key={index} style={{ paddingTop: "5px",fontSize: "15px",}}>
              <div id="linkStyle">
                <NavLink className="nav-link" to={item.path}>
                  <span style={{ marginRight: "15px" }}>{item.icon}</span>
                  <span style={{ margin: item.margin}}>{item.title}</span>
                </NavLink>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SideBar;
