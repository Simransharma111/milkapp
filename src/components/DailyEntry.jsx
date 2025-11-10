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

  // ✅ Hindi Voice System — Fully Fixed
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

  const handleSubmit = (e) => {
    e.preventDefault();

    const presentEntries = entries.filter((e) => e.present);

    if (presentEntries.length === 0) {
      alert("कोई ग्राहक उपस्थित नहीं है!");
      speakInHindi("कोई ग्राहक उपस्थित नहीं है।");
      return;
    }

    presentEntries.forEach((e) => {
      addEntry({
        date: today,
        customerId: e.customerId,
        customerName: e.customerName, // ✅ Important: name included
        quantity: e.quantity,
        rate: e.rate,
        total: e.quantity * e.rate,
      });

      // ✅ Correct speaking line per entry
      speakInHindi(`${e.customerName} के लिए ${e.quantity} लीटर दूध दर्ज किया गया है।`);
    });

    const totalMilk = presentEntries.reduce((sum, e) => sum + e.quantity, 0);

    const summary = `आज की एंट्री सफल रही।
कुल ${presentEntries.length} ग्राहक उपस्थित।
कुल दूध ${totalMilk.toFixed(2)} लीटर।`;

    alert(summary);
    speakInHindi(summary);
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
                    onChange={(ev) => handleQtyChange(e.customerId, ev.target.value)}
                    step="0.1"
                    style={{ width: "60px" }}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={e.rate}
                    onChange={(ev) => handleRateChange(e.customerId, ev.target.value)}
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
          💾 आज की एंट्री सेव करें
        </button>
      </form>
    </div>
  );
}
