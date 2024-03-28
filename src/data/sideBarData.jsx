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
    title: "Home",
    path: "/",
    role: "employee",
    icon: <FontAwesomeIcon icon={faHouse} style={{ fontSize: "15px" }} />,
  },
  {
    title: "View Profile",
    path: "/viewProfile",
    role: "employee",
    icon: <FontAwesomeIcon icon={faUser} style={{ fontSize: "15px" }} />,
  },
  {
    title: "Take Evaluation",
    path: "/takeEvaluation",
    role: "employee",
    icon: <FontAwesomeIcon icon={faFileLines} style={{ fontSize: "15px" }} />,
  },
  {
    title: "View Ratings",
    path: "/viewRatings",
    role: "employee",
    icon: <FontAwesomeIcon icon={faStar} style={{ fontSize: "15px" }} />,
  },
  {
    title: "Manage Account",
    path: "/manageAccount",
    role: "admin",
    icon: <FontAwesomeIcon icon={faUsers} style={{ fontSize: "15px" }} />,
  },
  {
    title: "Manage Offices",
    path: "/manageOffices",
    role: "admin",
    icon: (
      <FontAwesomeIcon icon={faBuildingUser} style={{ fontSize: "15px" }} />
    ),
  },
  {
    title: "Manage Employee",
    path: "/manageEmployee",
    role: "admin",
    icon: <FontAwesomeIcon icon={faUserTie} style={{ fontSize: "15px" }} />,
  },
];
