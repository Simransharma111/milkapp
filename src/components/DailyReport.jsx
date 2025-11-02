import React, { useEffect, useMemo } from "react";
import { speakHindi } from "../utils/speakHindi";

export default function DailyReport({ customers, entries }) {
  const today = new Date().toISOString().split("T")[0];

  const todayEntries = useMemo(() => {
    return entries.filter((e) => e.date === today);
  }, [entries]);

  // Group by customer
  const grouped = useMemo(() => {
    const result = {};
    todayEntries.forEach((e) => {
      if (!result[e.customerId]) {
        result[e.customerId] = { qty: 0, total: 0 };
      }
      result[e.customerId].qty += Number(e.quantity);
      result[e.customerId].total += Number(e.total);
    });
    return result;
  }, [todayEntries]);

  const totalQty = Object.values(grouped).reduce((a, b) => a + b.qty, 0);
  const totalAmount = Object.values(grouped).reduce((a, b) => a + b.total, 0);

  useEffect(() => {
    if (todayEntries.length > 0) {
      speakHindi(
        `आज कुल ${totalQty} लीटर दूध बेचा गया, कुल ₹${totalAmount.toFixed(
          0
        )} रुपये।`
      );
    } else {
      speakHindi("आज की कोई एंट्री नहीं है।");
    }
  }, [todayEntries]);

  return (
    <div style={{ padding: "15px" }}>
      <h2>📊 आज की रिपोर्ट ({today})</h2>

      {todayEntries.length === 0 ? (
        <p>आज की कोई एंट्री नहीं है।</p>
      ) : (
        <table border="1" width="100%" cellPadding="6">
          <thead>
            <tr>
              <th>ग्राहक</th>
              <th>मात्रा (लीटर)</th>
              <th>कुल ₹</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(grouped).map(([id, val]) => {
              const customer = customers.find((c) => c.id === id);
              return (
                <tr key={id}>
                  <td>{customer?.name || "Unknown"}</td>
                  <td>{val.qty}</td>
                  <td>₹{val.total.toFixed(2)}</td>
                </tr>
              );
            })}
            <tr>
              <td><strong>कुल</strong></td>
              <td><strong>{totalQty}</strong></td>
              <td><strong>₹{totalAmount.toFixed(2)}</strong></td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}
