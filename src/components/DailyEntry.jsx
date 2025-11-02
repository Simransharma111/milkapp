import React, { useState } from "react";

export default function DailyEntry({ customers, addEntry }) {
  const today = new Date().toISOString().split("T")[0];
  const [entries, setEntries] = useState(
    customers.map((c) => ({
      customerId: c.id,
      customerName: c.name,
      quantity: c.defaultQty || 1,
      rate: c.rate || 45,
      present: true,
    }))
  );

  const handleToggle = (id) => {
    setEntries((prev) =>
      prev.map((e) => (e.customerId === id ? { ...e, present: !e.present } : e))
    );
  };

  const handleQtyChange = (id, qty) => {
    setEntries((prev) =>
      prev.map((e) => (e.customerId === id ? { ...e, quantity: qty } : e))
    );
  };

  const speakInHindi = (text) => {
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = "hi-IN"; // Hindi
    msg.rate = 1;
    msg.pitch = 1;
    window.speechSynthesis.speak(msg);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const presentEntries = entries.filter((e) => e.present);
    const absentEntries = entries.filter((e) => !e.present);

    if (presentEntries.length === 0) {
      alert("कोई ग्राहक उपस्थित नहीं है!");
      speakInHindi("कोई ग्राहक उपस्थित नहीं है।");
      return;
    }

    // Save entries
    presentEntries.forEach((e) => {
      addEntry({
        date: today,
        customerId: e.customerId,
        customerName: e.customerName,
        quantity: e.quantity,
        rate: e.rate,
        total: e.quantity * e.rate,
      });
    });

    const message = `आज की एंट्री सफल रही। ${presentEntries.length} ग्राहक उपस्थित हैं और ${absentEntries.length} अनुपस्थित हैं।`;
    alert(message);
    speakInHindi(message);
  };

  const markAllPresent = () => {
    setEntries((prev) => prev.map((e) => ({ ...e, present: true })));
    speakInHindi("सभी ग्राहक उपस्थित कर दिए गए हैं।");
  };

  return (
    <div style={{ padding: "15px" }}>
      <h2>🧾 Daily Entry & Attendance ({today})</h2>

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
              <tr key={e.customerId} style={{ background: e.present ? "#e8f5e9" : "#ffebee" }}>
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
                    onChange={(ev) => handleQtyChange(e.customerId, parseFloat(ev.target.value))}
                    step="0.1"
                    style={{ width: "60px" }}
                  />
                </td>
                <td>{e.rate}</td>
                <td>₹{(e.quantity * e.rate).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <button type="submit" style={{ marginTop: "10px" }}>
          💾 आज की एंट्री सेव करें
        </button>
      </form>
    </div>
  );
}
