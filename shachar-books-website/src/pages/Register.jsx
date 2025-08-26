import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username || !password || !confirmPassword) {
      setMessage("🛑 יש למלא את כל השדות");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("⚠️ הסיסמאות לא תואמות");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/addUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("✅ נרשמת בהצלחה!");
        // אפשר גם לרוקן את השדות או לנווט לדף התחברות
        setUsername("");
        setPassword("");
        setConfirmPassword("");
     navigate("/");
      } else {
        setMessage(`❌ שגיאה: ${data.error || "נסה שוב"}`);
      }
    } catch (err) {
      setMessage("❌ שגיאת שרת. נסה שוב מאוחר יותר.");
      console.error(err);
    }
  };

  return (
    <div className="register-container">
      <h1 className="register-title">רישום</h1>
      <div className="register-form">
        <input
          type="text"
          placeholder="הכנס את שמך"
          className="register-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="הכנס סיסמה"
          className="register-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="אימות סיסמה"
          className="register-input"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="button" className="register-button" onClick={handleRegister}>
          הרשם
        </button>
        {message && <p className="register-message">{message}</p>}
      </div>
    </div>
  );
}

export default Register;
