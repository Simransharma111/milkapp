import React, { useMemo } from "react";

export default function MonthlyReport({ customers, entries }) {
  const month = new Date().toISOString().slice(0, 7); // YYYY-MM
  const monthEntries = useMemo(
    () => entries.filter((e) => e.date.startsWith(month)),
    [entries, month]
  );

  // Group entries per customer
  const grouped = useMemo(() => {
    const result = {};
    monthEntries.forEach((e) => {
      const id = Number(e.customerId);
      if (!result[id]) result[id] = { qty: 0, total: 0 };
      result[id].qty += Number(e.quantity);
      // use the entry's rate * qty (each entry already stores correct rate)
      result[id].total += Number(e.quantity) * Number(e.rate);
    });
    return result;
  }, [monthEntries]);

  const overallQty = Object.values(grouped).reduce((a, b) => a + b.qty, 0);
  const overallTotal = Object.values(grouped).reduce((a, b) => a + b.total, 0);

  const sendWhatsAppReport = (customer, data) => {
    if (!customer.mobile) {
      alert(`Mobile number not set for ${customer.name}`);
      return;
    }
    const msg = `नमस्ते ${customer.name},\n\n${month} महीने का दूध हिसाब:\nकुल दूध: ${data.qty.toFixed(
      1
    )} लीटर\nदर: ₹${customer.rate}/लीटर\nकुल राशि: ₹${data.total.toFixed(
      2
    )}\n\nधन्यवाद!\nवाद!\n- राधे-राधे :/hhhhhhttps:/wacuob$encodeURIComponent(msg)}}sg)}`;window.open(url, "_blank");
  };

  return (
    <div style={{ padding: "15px" }}>
      <h2>📅 Monthly Report ({month})</h2>

      {monthEntries.length === 0 ? (
        <p>No entries found for this month.</p>
      ) : (
        <table border="1" width="100%" cellPadding="6">
          <thead>
            <tr>
              <th>ग्राहक</th>
              <th>कुल दूध (लीटर)</th>
              <th>दर (₹/लीटर)</th>
              <th>कुल ₹</th>
              <th>Send</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => {
              const data = grouped[c.id];
              if (!data) return null;
              return (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{data.qty.toFixed(1)}</td>
                  <td>{c.rate}</td>
                  <td>₹{data.total.toFixed(2)}</td>
                  <td>
                    <button onClick={() => sendWhatsAppReport(c, data)}>
                      📲 Send
                    </button>
                  </td>
                </tr>
              );
            })}
            <tr>
              <td><strong>कुल</strong></td>
              <td><strong>{overallQty.toFixed(1)}</strong></td>
              <td>—</td>
              <td><strong>₹{overallTotal.toFixed(2)}</strong></td>
              <td>—</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}
