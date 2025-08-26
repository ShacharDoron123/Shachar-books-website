import { forwardRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import harry1 from '../assets/harry_potter1.jpg';
import harry2 from '../assets/harry_potter2.jpg';
import harry3 from '../assets/harry_potter3.jpg';
import harry4 from '../assets/harry_potter4.jpg';

function AllBooks() {
  const [loading, setLoading] = useState(true); // שליטה בטעינה

  const books = [
    { name: "הארי פוטר ואבן החכמים", p: "...", src: harry1, date: "1997", Ename: "harryPotter1" },
    { name: "הארי פוטר וחדר הסודות", p: "...", src: harry2, date: "1998", Ename: "harryPotter2" },
    { name: "הארי פוטר והאסיר מאזקבאן", p: "...", src: harry3, date: "1999", Ename: "harryPotter3" },
    { name: "הארי פוטר וגביע האש", p: "...", src: harry4, date: "2000", Ename: "harryPotter4" },
    { name: "הארי פוטר ומסדר עוף החול", p: "...", src: harry4, date: "2000", Ename: "harryPotter5" },
    { name: "הארי פוטר והנסיך חצוי-הדם", p: "...", src: harry4, date: "2000", Ename: "harryPotter6" },
    { name: "הארי פוטר ואוצרות המוות" ,p: "...", src: harry4, date: "2000", Ename: "harryPotter4" },
    { name: "שר הטבעות", p: "...", src: harry4, date: "2000", Ename: "harryPotter4" },
    { name: "ההוביט", p: "...", src: harry4, date: "2000", Ename: "harryPotter4" },
    { name: "מסביב לעולם בשמונים יום", p: "...", src: harry4, date: "2000", Ename: "harryPotter4" },
  ];

  useEffect(() => {
    async function ensureAllBooksExist() {
      for (const book of books) {
        await fetch("http://localhost:3001/api/ensure-book-exists", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: book.Ename })
        });
      }

      setLoading(false); // רק לאחר סיום - מציגים
    }

    ensureAllBooksExist();
  }, []);

  if (loading) {
    return <div>טוען ספרים...</div>; // מסך טעינה
  }

  return (
    <>
      <div className="container">
        <h2>אוסף הספרים המלא</h2>
      </div>
      <div className="container2">
        {books.map((book, index) => (
          <Link key={index} to="/BookInfo" state={book} className="link-wrapper">
            <Card name={book.name} p={book.p} src={book.src} Ename={book.Ename} />
          </Link>
        ))}
      </div>
    </>
  );
}
 
export default AllBooks