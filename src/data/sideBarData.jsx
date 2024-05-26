import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuildingUser,
  faFileLines,
  faHouse,
  faStar,
  faUser,
  faUserTie,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

export const SideBarData = [
  {
    title: "View Profile",
    path: "/ViewProfileAdmin",
    role: "HEAD",
    icon: <FontAwesomeIcon icon={faUser} style={{ fontSize: "15px" }} />,
  },
  {
    title: "Track Employee",
    path: "/TrackEmployee",
    role: "HEAD",
    icon: <FontAwesomeIcon icon={faUserTie} style={{ fontSize: "15px" }} />,
  },
];
