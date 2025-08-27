import mysql from 'mysql2'
import express from "express";
import cors from "cors";

const pool = mysql.createPool({
    host:"localhost",
    user:"root",
    password:"983305sd",
    database:"books"
}).promise()

const app = express();
app.use(cors());
app.use(express.json());

//דירוג ספרים

async function getCurrentBookRating(username, bookName) {
  const [rows] = await pool.query(
    "SELECT rating FROM ratings WHERE userName = ? AND bookName = ?",
    [username, bookName]
  );

  if (rows.length === 0) {
    return { rating: 0 }; 
  }

  return rows[0]; 
}

async function getAverageBookRating(bookName) {
    //מחזירה את הדירוג הנוכחי שמשתמש דירג לפי המשתמש והספר
    //משתמש ב book_ratings
  const [rows] = await pool.query(
  "SELECT avg_rating FROM book_ratings WHERE name = ?",
  [bookName]
);

  return rows[0]; 
}

async function updateUserRating(username, bookName, newRating) {
  // בדיקה אם למשתמש כבר יש דירוג קיים לספר הזה
  const [existing] = await pool.query(
    "SELECT rating FROM ratings WHERE userName = ? AND bookName = ?",
    [username, bookName]
  );

  if (existing.length > 0) {
    // -----> דירוג קיים: מעדכנים רק את הדירוג והסכום <-----
    const oldRating = existing[0].rating;

    await pool.query(
      "UPDATE ratings SET rating = ? WHERE userName = ? AND bookName = ?",
      [newRating, username, bookName]
    );

    await pool.query(
      "UPDATE book_ratings SET sum_ratings = sum_ratings - ? + ? WHERE name = ?",
      [oldRating, newRating, bookName]
    );
  } else {
    // -----> דירוג חדש: מוסיפים רשומה ומעלים את ספירת הדירוגים <-----
    await pool.query(
      "INSERT INTO ratings (userName, bookName, rating) VALUES (?, ?, ?)",
      [username, bookName, newRating]
    );

    await pool.query(
      "UPDATE book_ratings SET sum_ratings = sum_ratings + ?, count_ratings = count_ratings + 1 WHERE name = ?",
      [newRating, bookName]
    );
  }

  // avg_rating מתעדכן אוטומטית ב-MySQL, אין צורך לעדכן ידנית
}

//טבלת משתמשים

async function checkUserCredentials(username, password) {
  const [rows] = await pool.query(
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [username, password]
  );

  return rows.length > 0;
}

async function addUser(username, password) {
  // בדיקת קלט
  if (!username || !password) {
    throw new Error("חסרים פרטים: שם משתמש או סיסמה");
  }

  // בדוק אם המשתמש כבר קיים במסד הנתונים
  const [existing] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);

  if (existing.length > 0) {
    throw new Error("המשתמש כבר קיים");
  }

  // שמור את הסיסמה כמו שהיא (לא מוצפנת)
  await pool.query(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, password]
  );
}

//api

app.get("/api/getCurrentBookRating/:username/:bookName", async (req, res) => {
  const { username, bookName } = req.params;

  try {
    const CurrentBookRating = await getCurrentBookRating(username, bookName);
    res.json({ CurrentBookRating });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/api/checkLogin", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: "שם משתמש או סיסמה חסרים" });
  }

  try {
    const userExists = await checkUserCredentials(username, password);
    res.json({ success: userExists });
  } catch (err) {
    console.error("Database error:", err.message);
    res.status(500).json({ success: false, message: "שגיאת שרת" });
  }
});

app.get("/api/getAverageBookRating/:bookName", async (req, res) => {
  const {bookName} = req.params;

  try {
    const CurrentBookRating = await getAverageBookRating(bookName);
    res.json({ CurrentBookRating });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/api/updateUserRating", async (req, res) => {
  const { username, book, rating } = req.body;

  if (!username || !book || rating === undefined) {
    return res.status(400).json({ error: "חסרים נתונים" });
  }

  try {
    await updateUserRating(username, book, rating);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// פונקציה שמוודאת שהספר קיים בטבלה book_ratings או מוסיפה אותו אם חסר
async function ensureBookExists(bookName) {
  console.log(`📘 בודק אם קיים ספר: "${bookName}"`);

  const [rows] = await pool.query(
    "SELECT * FROM book_ratings WHERE name = ?",
    [bookName]
  );

  if (rows.length === 0) {
    console.log(`➕ מוסיף ספר חדש: "${bookName}"`);

    await pool.query(
  "INSERT INTO book_ratings (name, sum_ratings, count_ratings) VALUES (?, 0, 0)",
  [bookName]
);

  } else {
    console.log(`✅ הספר כבר קיים: "${bookName}"`);
  }
}

// הנתיב API שמקבל את שם הספר
app.post("/api/ensure-book-exists", async (req, res) => {
  const { name } = req.body;

  if (!name) {
    console.warn("⚠️ בקשה חסרה – לא סופק שם ספר");
    return res.status(400).json({ error: "חסר שם ספר" });
  }

  try {
    await ensureBookExists(name);
    res.json({ success: true });
  } catch (err) {
    console.error("❌ שגיאה בשרת בעת בדיקה/הוספה של ספר:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/addUser", async (req, res) => {
  const { username, password } = req.body;

  if (!username) {
    console.warn("תקלה בשם המשתמש או הסיסמה");
    return res.status(400).json({ error: "תקלה בשם המשתמש או הסיסמה" });
  }

  try {
    await addUser(username, password);
    res.json({ success: true });
  } catch (err) {
    console.error("שגיאה בהוספת שם משתמש או סיסמה", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Export the app as the default export for Vercel
export default app;
