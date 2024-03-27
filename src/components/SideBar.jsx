import React from "react";
import "../styles/sidebarStyles.css";
import { NavLink } from "react-router-dom";
import { SideBarData } from "../data/sideBarData";

function SideBar() {
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
        {SideBarData.map((item, index) => {
          return (
            <div key={index} style={{ paddingTop: "5px" }}>
              <div id="linkStyle">
                <NavLink className="nav-link" to={item.path}>
                  <span style={{ marginRight: "15px" }}>{item.icon}</span>
                  <span>{item.title}</span>
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
