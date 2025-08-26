import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkLogin = () => {
    const activeUser = localStorage.getItem("activeUser");
    setIsLoggedIn(activeUser && activeUser !== "null");
  };

  useEffect(() => {
    // בדיקה ראשונית
    checkLogin();

    // האזנה לאירוע שינוי התחברות
    window.addEventListener("userStatusChanged", checkLogin);

    // ניקוי מאזין כשהרכיב נעלם
    return () => {
      window.removeEventListener("userStatusChanged", checkLogin);
    };
  }, []);

  return (
    <div className="colorN">
      <Link to="/">
        <button className="colorN">דף הבית</button>
      </Link>

      <Link to="/AllBooks">
        <button className="colorN">האוסף המלא</button>
      </Link>

      <Link to="/About">
        <button className="colorN">אודות</button>
      </Link>

      {!isLoggedIn && (
        <>
          <Link to="/login">
            <button className="colorN">התחברות</button>
          </Link>

          <Link to="/Register">
            <button className="colorN">הירשם</button>
          </Link>
        </>
      )}

      {isLoggedIn && (
        <Link to="/logout">
          <button className="colorN">התנתקות</button>
        </Link>
      )}

      <hr />
    </div>
  );
}
