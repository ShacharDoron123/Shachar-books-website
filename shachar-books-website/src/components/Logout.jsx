import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
   localStorage.removeItem("activeUser");
   window.dispatchEvent(new Event("userStatusChanged"));

    navigate(-1);  
  }, []);

  return null;
}
