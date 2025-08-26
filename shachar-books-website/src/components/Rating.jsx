import React, { useEffect, useState } from "react";

export default function Rating({ Ename, edit }) {
  const [rating, setRating] = useState(null);
  const [averageRating, setAverageRating] = useState(null);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const isEditMode = edit === "true";
  const username = localStorage.getItem("activeUser");
  const isLoggedIn = username && username !== "null";

  useEffect(() => {
    if (!Ename) {
      setError("לא הועבר שם ספר");
      return;
    }

    const controller = new AbortController();

    async function fetchEditModeData() {
      try {
        const res = await fetch(
          `http://localhost:3001/api/getCurrentBookRating/${username}/${Ename}`,
          { signal: controller.signal }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "שגיאה בטעינת הדירוג");
        setRating(data.CurrentBookRating?.rating ?? 0);
      } catch (e) {
        if (e.name !== "AbortError") setError(e.message);
      }
    }

    async function fetchViewModeData() {
      try {
        const avgRes = await fetch(
          `http://localhost:3001/api/getAverageBookRating/${Ename}`,
          { signal: controller.signal }
        );
        const avgData = await avgRes.json();
        if (!avgRes.ok) throw new Error(avgData.error || "שגיאה בטעינת ממוצע הדירוג");

        const avgRating = avgData.CurrentBookRating?.avg_rating ?? 0;
        setAverageRating(avgRating);
      } catch (e) {
        if (e.name !== "AbortError") setError(e.message);
      }
    }

    // נביא מידע רק אם edit=true וגם המשתמש מחובר
    if (isEditMode && isLoggedIn) {
      fetchEditModeData();
    } else {
      fetchViewModeData();
    }

    return () => controller.abort();
  }, [Ename, isEditMode, isLoggedIn, username]);

  async function handleRatingChange(newRating) {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:3001/api/updateUserRating`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, book: Ename, rating: newRating }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "שגיאה בשמירת הדירוג");
      setRating(newRating);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  // שגיאה
  if (error) {
    return <p style={{ color: "red" }}>שגיאה: {error}</p>;
  }

  // מצב עריכה — רק אם המשתמש מחובר
  if (isEditMode) {
    if (!isLoggedIn) {
      return <p>על מנת לדרג יש להתחבר</p>;
    }

    if (rating === null) {
      return <p>טוען דירוג נוכחי...</p>;
    }

    return (
      <div>
        <p>הדירוג שלך: {rating} / 5</p>
        <select
          value={rating}
          onChange={(e) => handleRatingChange(Number(e.target.value))}
          disabled={saving}
        >
          {[0, 1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        {saving && <p>שומר...</p>}
      </div>
    );
  }

  // מצב צפייה — תמיד מוצג
  if (averageRating === null) {
    return <p>טוען ממוצע דירוג...</p>;
  }

  return <p>ממוצע דירוג: {averageRating}</p>;
}
