import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();


  const handleLogin = async () => {
    if (username.trim() === "" || password.trim() === "") {
      alert("אנא הכנס שם משתמש וסיסמה.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/checkLogin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("activeUser", username);
        window.dispatchEvent(new Event("userStatusChanged"));

        alert(`שלום ${username}, התחברת בהצלחה!`);
   
        navigate("/"); 
      } else {
        alert("שם משתמש או סיסמה שגויים.");
      }
    } catch (err) {
      alert("שגיאה בחיבור לשרת.");
      console.error(err);
    }
  };

  return (
    <div className="register-container">
      <h1 className="register-title">התחבר</h1>
      <div className="register-form">
        <input
          type="text"
          id="user_name"
          name="user_name"
          placeholder="הכנס את שמך"
          className="register-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          id="user_password"
          name="user_password"
          placeholder="הכנס סיסמה"
          className="register-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="button" className="register-button" onClick={handleLogin}>
          שלח
        </button>
      </div>
    </div>
  );
}

export default Login;
