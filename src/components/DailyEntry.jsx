import React, { useState } from "react";

export default function DailyEntry({ customers, addEntry }) {
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    customerId: "",
    quantity: "",
    rate: 45, // default rate
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.customerId || !form.quantity) {
      alert("Please select customer and enter quantity.");
      return;
    }

    const qty = parseFloat(form.quantity);
    const rate = parseFloat(form.rate);
    const total = qty * rate;

    addEntry({
      date: today,
      customerId: form.customerId,
      quantity: qty,
      rate,
      total,
    });

    setForm({ customerId: "", quantity: "", rate: 45 });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  return (
    <div style={{ padding: "15px" }}>
      <h2>📝 Daily Entry ({today})</h2>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "10px", maxWidth: "400px" }}>
        <label>
          Customer:
          <select
            name="customerId"
            value={form.customerId}
            onChange={handleChange}
            required
          >
            <option value="">Select Customer</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Quantity (in litres):
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            step="0.1"
            required
          />
        </label>

        <label>
          Rate (₹ per litre):
          <input
            type="number"
            name="rate"
            value={form.rate}
            onChange={handleChange}
            step="0.5"
            required
          />
        </label>

        <button type="submit">Add Entry</button>
      </form>
    </div>
  );
}
