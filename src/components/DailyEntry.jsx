import React, { useState, useMemo } from "react";

export default function DailyEntry({ customers, addEntry, allEntries }) {
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);

  // 🔍 Check if ANY entry exists for selected date
  const hasAnyEntryForDate = allEntries?.some(
    (e) => e.date === selectedDate
  );

  // 🔒 Lock only if past date AND already has entry
  const isDateLocked = selectedDate !== today && hasAnyEntryForDate;

  // Initial state
  const [entries, setEntries] = useState(
    customers.map((c) => ({
      customerId: c.id,
      customerName: c.name,
      quantity: c.defaultQty || 1,
      rate: c.rate || 45,
      present: true,
    }))
  );

  // 🔊 Hindi voice
  const speakInHindi = (text) => {
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = "hi-IN";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(msg);
  };

  // 📊 Attendance map for selected date
  const attendanceMap = useMemo(() => {
    const map = {};
    allEntries?.forEach((e) => {
      if (e.date === selectedDate) {
        map[e.customerId] = true;
      }
    });
    return map;
  }, [allEntries, selectedDate]);

  // 🔒 Per-customer duplicate check
  const isDuplicate = (customerId) =>
    allEntries?.some(
      (e) => e.customerId === customerId && e.date === selectedDate
    );

  // Handlers
  const handleToggle = (id) => {
    if (isDateLocked) return;
    setEntries((prev) =>
      prev.map((e) =>
        e.customerId === id ? { ...e, present: !e.present } : e
      )
    );
  };

  const handleQtyChange = (id, qty) => {
    setEntries((prev) =>
      prev.map((e) =>
        e.customerId === id ? { ...e, quantity: parseFloat(qty) || 0 } : e
      )
    );
  };

  const handleRateChange = (id, rate) => {
    setEntries((prev) =>
      prev.map((e) =>
        e.customerId === id ? { ...e, rate: parseFloat(rate) || 0 } : e
      )
    );
  };

  const markAllPresent = () => {
    if (isDateLocked) return;
    setEntries((prev) => prev.map((e) => ({ ...e, present: true })));
    speakInHindi("सभी ग्राहक उपस्थित कर दिए गए हैं।");
  };

  // 💾 Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (isDateLocked) {
      alert("इस तारीख की एंट्री पहले से मौजूद है, बदली नहीं जा सकती!");
      speakInHindi("इस तारीख की एंट्री पहले से मौजूद है।");
      return;
    }

    const presentEntries = entries.filter((e) => e.present);

    if (presentEntries.length === 0) {
      alert("कोई ग्राहक उपस्थित नहीं है!");
      speakInHindi("कोई ग्राहक उपस्थित नहीं है।");
      return;
    }

    presentEntries.forEach((e) => {
      if (isDuplicate(e.customerId)) return;

      addEntry({
        date: selectedDate,
        customerId: e.customerId,
        customerName: e.customerName,
        quantity: e.quantity,
        rate: e.rate,
        total: e.quantity * e.rate,
      });
    });

    const totalMilk = presentEntries.reduce((s, e) => s + e.quantity, 0);

    const msg = `एंट्री सफल रही।
कुल ग्राहक: ${presentEntries.length}
कुल दूध: ${totalMilk.toFixed(2)} लीटर`;

    alert(msg);
    speakInHindi(msg);
  };

  // 🔴 Missing attendance?
  const hasMissing = customers.some((c) => !attendanceMap[c.id]);

  return (
    <div style={{ padding: "15px" }}>
      <h2>🧾 Daily Attendance ({selectedDate})</h2>

      {/* 📅 Date Picker */}
      <div style={{ marginBottom: "10px" }}>
        <input
          type="date"
          value={selectedDate}
          max={today}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{
            padding: "6px",
            border:
              hasMissing && hasAnyEntryForDate
                ? "2px solid red"
                : "2px solid green",
          }}
        />
      </div>

      <button onClick={markAllPresent} disabled={isDateLocked}>
        ✅ सभी उपस्थित
      </button>

      <form onSubmit={handleSubmit}>
        <table
          border="1"
          width="100%"
          cellPadding="6"
          style={{ marginTop: 10 }}
        >
          <thead>
            <tr>
              <th>उपस्थित</th>
              <th>ग्राहक</th>
              <th>दूध (L)</th>
              <th>रेट ₹</th>
              <th>कुल ₹</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr
                key={e.customerId}
                style={{
                  background: attendanceMap[e.customerId]
                    ? "#e8f5e9"
                    : hasAnyEntryForDate
                    ? "#ffebee"
                    : e.present
                    ? "#e8f5e9"
                    : "#ffebee",
                  opacity: isDateLocked ? 0.75 : 1,
                }}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={e.present}
                    disabled={isDateLocked}
                    onChange={() => handleToggle(e.customerId)}
                  />
                </td>
                <td>{e.customerName}</td>
                <td>
                  <input
                    type="number"
                    value={e.quantity}
                    disabled={!e.present || isDateLocked}
                    onChange={(ev) =>
                      handleQtyChange(e.customerId, ev.target.value)
                    }
                    step="0.1"
                    style={{ width: 60 }}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={e.rate}
                    disabled={isDateLocked}
                    onChange={(ev) =>
                      handleRateChange(e.customerId, ev.target.value)
                    }
                    style={{ width: 70 }}
                  />
                </td>
                <td>₹{(e.quantity * e.rate).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <button type="submit" disabled={isDateLocked} style={{ marginTop: 10 }}>
          💾 सेव करें
        </button>
      </form>
    </div>
  );
}
