import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="flex gap-4 p-4 bg-gray-100 shadow">
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/category">Category</Link>
      <Link to="/expense">Expense</Link>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
}
