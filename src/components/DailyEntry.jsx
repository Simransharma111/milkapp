import React, { useState } from "react";

export default function DailyEntry({ customers, addEntry, allEntries }) {
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);

  const [entries, setEntries] = useState(
    customers.map((c) => ({
      customerId: c.id,
      customerName: c.name,
      quantity: c.defaultQty || 1,
      rate: c.rate || 45,
      present: true,
    }))
  );

  // ✅ Hindi Voice System
  const speakInHindi = (text) => {
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = "hi-IN";
    msg.pitch = 1;
    msg.rate = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(msg);
  };

  const handleToggle = (id) => {
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
    setEntries((prev) => prev.map((e) => ({ ...e, present: true })));
    speakInHindi("सभी ग्राहक उपस्थित कर दिए गए हैं।");
  };

  // 🔒 Duplicate check
  const isDuplicate = (customerId) => {
    return allEntries?.some(
      (entry) =>
        entry.customerId === customerId &&
        entry.date === selectedDate
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const presentEntries = entries.filter((e) => e.present);

    if (presentEntries.length === 0) {
      alert("कोई ग्राहक उपस्थित नहीं है!");
      speakInHindi("कोई ग्राहक उपस्थित नहीं है।");
      return;
    }

    speakInHindi(`${selectedDate} की एंट्री दर्ज की जा रही है।`);

    presentEntries.forEach((e) => {
      if (isDuplicate(e.customerId)) {
        alert(
          `${e.customerName} की ${selectedDate} की एंट्री पहले से मौजूद है!`
        );
        speakInHindi(
          `${e.customerName} की इस तारीख की एंट्री पहले से मौजूद है।`
        );
        return;
      }

      addEntry({
        date: selectedDate,
        customerId: e.customerId,
        customerName: e.customerName,
        quantity: e.quantity,
        rate: e.rate,
        total: e.quantity * e.rate,
      });

      speakInHindi(
        `${e.customerName} के लिए ${e.quantity} लीटर दूध दर्ज किया गया है।`
      );
    });

    const totalMilk = presentEntries.reduce((sum, e) => sum + e.quantity, 0);

    const summary = `एंट्री सफल रही।
कुल ${presentEntries.length} ग्राहक उपस्थित।
कुल दूध ${totalMilk.toFixed(2)} लीटर।`;

    alert(summary);
    speakInHindi(summary);
  };

  return (
    <div style={{ padding: "15px" }}>
      <h2>🧾 Daily Entry & Attendance ({selectedDate})</h2>

      {/* 📅 Date Picker */}
      <div style={{ marginBottom: "10px" }}>
        <label>
          📅 तारीख चुनें:{" "}
          <input
            type="date"
            value={selectedDate}
            max={today}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </label>
      </div>

      <button onClick={markAllPresent}>✅ सभी उपस्थित</button>

      <form onSubmit={handleSubmit}>
        <table border="1" width="100%" cellPadding="6" style={{ marginTop: "10px" }}>
          <thead>
            <tr>
              <th>उपस्थित</th>
              <th>ग्राहक</th>
              <th>दूध (L)</th>
              <th>रेट (₹)</th>
              <th>कुल (₹)</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr
                key={e.customerId}
                style={{ background: e.present ? "#e8f5e9" : "#ffebee" }}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={e.present}
                    onChange={() => handleToggle(e.customerId)}
                  />
                </td>
                <td>{e.customerName}</td>
                <td>
                  <input
                    type="number"
                    value={e.quantity}
                    disabled={!e.present}
                    onChange={(ev) =>
                      handleQtyChange(e.customerId, ev.target.value)
                    }
                    step="0.1"
                    style={{ width: "60px" }}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={e.rate}
                    onChange={(ev) =>
                      handleRateChange(e.customerId, ev.target.value)
                    }
                    step="0.5"
                    style={{ width: "70px" }}
                  />
                </td>
                <td>₹{(e.quantity * e.rate).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <button type="submit" style={{ marginTop: "10px" }}>
          💾 एंट्री सेव करें
        </button>
      </form>
    </div>
  );
}
