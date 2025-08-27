import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import harry1 from '../assets/harry_potter1.jpg';
import harry2 from '../assets/harry_potter2.jpg';
import harry3 from '../assets/harry_potter3.jpg';
import harry4 from '../assets/harry_potter4.jpg';

// כתובת API: מקומית או Production
const API_BASE =
  import.meta.env.MODE === "development"
    ? "http://localhost:3001"
    : ""; // ב-Vercel זה ישתמש בנתיב יחסי

function AllBooks() {
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);

  // רשימת ספרים קבועה (Fallback)
  const books = [
    { name: "הארי פוטר ואבן החכמים", p: "...", src: harry1, date: "1997", Ename: "harryPotter1" },
    { name: "הארי פוטר וחדר הסודות", p: "...", src: harry2, date: "1998", Ename: "harryPotter2" },
    { name: "הארי פוטר והאסיר מאזקבאן", p: "...", src: harry3, date: "1999", Ename: "harryPotter3" },
    { name: "הארי פוטר וגביע האש", p: "...", src: harry4, date: "2000", Ename: "harryPotter4" },
    { name: "הארי פוטר ומסדר עוף החול", p: "...", src: harry4, date: "2003", Ename: "harryPotter5" },
    { name: "הארי פוטר והנסיך חצוי-הדם", p: "...", src: harry4, date: "2005", Ename: "harryPotter6" },
    { name: "הארי פוטר ואוצרות המוות", p: "...", src: harry4, date: "2007", Ename: "harryPotter7" },
    { name: "שר הטבעות", p: "...", src: harry4, date: "1954", Ename: "lordOfTheRings" },
    { name: "ההוביט", p: "...", src: harry4, date: "1937", Ename: "theHobbit" },
    { name: "מסביב לעולם בשמונים יום", p: "...", src: harry4, date: "1873", Ename: "aroundTheWorld" },
  ];

  useEffect(() => {
    async function ensureAllBooksExist() {
      try {
        for (const book of books) {
          const res = await fetch(`${API_BASE}/api/ensure-book-exists`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: book.Ename }),
          });

          if (!res.ok) {
            throw new Error(`API החזיר שגיאה (${res.status})`);
          }
        }
      } catch (err) {
        console.error("❌ שגיאה בעת יצירת ספרים במסד הנתונים:", err);
        setError("⚠️ לא ניתן להתחבר לשרת. מוצגים ספרים מתוך זיכרון מקומי.");
      } finally {
        setLoading(false);
      }
    }

    ensureAllBooksExist();
  }, []);

  if (loading) {
    return <div>📚 טוען ספרים...</div>;
  }

  return (
    <>
      <div className="container">
        <h2>אוסף הספרים המלא</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
      <div className="container2">
        {books.map((book, index) => (
          <Link key={index} to="/BookInfo" state={book} className="link-wrapper">
            <Card
              name={book.name}
              p={book.p}
              src={book.src}
              Ename={book.Ename}
            />
          </Link>
        ))}
      </div>
    </>
  );
}

export default AllBooks;
