import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    navigate("/auth");
  };

  return (
    <div className="p-4">
      <Navbar />
    </div>
  );
}
