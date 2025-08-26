import { useLocation, useNavigate } from "react-router-dom";
import Rating from "../components/Rating";

function BookInfo() {
    const location = useLocation();
    const book = location.state;

    const navigate = useNavigate();

    if (!book) {
        return (
            <div className="book-info not-found">
                <h2>אין מידע להצגה</h2>
                <button onClick={() => navigate(-1)} className="back-button">⬅ חזור</button>
            </div>
        );
    }

    return (
        <div className="book-info">
            <h1 className="book-title">{book.name}</h1>
            <img src={book.src} alt={book.name} className="book-image" />
            <h3>שנת הוצאה: {book.date}</h3>
            <p className="book-description">{book.p}</p>
            <Rating edit="true" name={book.name} Ename={book.Ename}/>
            <button onClick={() => navigate(-1)} className="back-button">⬅ חזור</button>
        </div>
    );
}

export default BookInfo;
