import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileLines,
  faHouse,
  faStar,
  faUser,
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
];
