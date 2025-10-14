import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
export default function LogoutButton() {
  const navigate = useNavigate();
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      toast.success("Logged out!");
      navigate("/login");
    }
  };
  return (
    <button className="btn btn-outline-danger mx-2" onClick={handleLogout}>
      Logout
    </button>
  );
}
