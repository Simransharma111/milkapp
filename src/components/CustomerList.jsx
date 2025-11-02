import React, { useState } from "react";

export default function CustomerList({ customers, addCustomer, updateCustomer, deleteCustomer }) {
  const [newCustomer, setNewCustomer] = useState({ name: "", rate: 45, mobile: "" });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newCustomer.name) return alert("Please enter customer name");
    addCustomer(newCustomer);
    setNewCustomer({ name: "", rate: 45, mobile: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer({ ...newCustomer, [name]: value });
  };

  const handleRateChange = (id, rate) => {
    updateCustomer(id, { rate: Number(rate) });
  };

  const handleMobileChange = (id, mobile) => {
    updateCustomer(id, { mobile });
  };

  return (
    <div style={{ padding: "15px" }}>
      <h2>👥 Customer List</h2>

      <form onSubmit={handleAdd} style={{ display: "grid", gap: "10px", maxWidth: "400px" }}>
        <input
          type="text"
          name="name"
          placeholder="Customer Name"
          value={newCustomer.name}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="rate"
          placeholder="Rate ₹/litre"
          value={newCustomer.rate}
          onChange={handleChange}
          step="0.5"
        />
        <input
          type="text"
          name="mobile"
          placeholder="Mobile (optional)"
          value={newCustomer.mobile}
          onChange={handleChange}
        />
        <button type="submit">Add Customer</button>
      </form>

      <hr style={{ margin: "20px 0" }} />

      {customers.length === 0 ? (
        <p>No customers yet.</p>
      ) : (
        <table border="1" width="100%" cellPadding="6">
          <thead>
            <tr>
              <th>Name</th>
              <th>Rate (₹)</th>
              <th>Mobile</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>
                  <input
                    type="number"
                    value={c.rate}
                    onChange={(e) => handleRateChange(c.id, e.target.value)}
                    step="0.5"
                    style={{ width: "70px" }}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={c.mobile || ""}
                    onChange={(e) => handleMobileChange(c.id, e.target.value)}
                    style={{ width: "120px" }}
                  />
                </td>
                <td>
                  <button onClick={() => deleteCustomer(c.id)}>🗑 Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
