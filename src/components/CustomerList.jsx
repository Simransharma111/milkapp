import React, { useState } from "react";

export default function CustomerList({ customers, addCustomer, updateCustomer, deleteCustomer }) {
  const [newCust, setNewCust] = useState({ name: "", mobile: "", rate: 45, defaultQty: 1 });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newCust.name) return alert("Enter name");
    const mobile = newCust.mobile.startsWith("+91") ? newCust.mobile : `+91${newCust.mobile}`;
    addCustomer({ ...newCust, mobile });
    setNewCust({ name: "", mobile: "", rate: 45, defaultQty: 1 });
  };

  return (
    <div style={{ padding: "15px" }}>
      <h2>👥 Customers</h2>

      <form onSubmit={handleAdd} style={{ display: "grid", gap: "8px", maxWidth: "400px" }}>
        <input placeholder="Name" value={newCust.name} onChange={e => setNewCust({ ...newCust, name: e.target.value })} required />
        <input placeholder="Mobile (10 digits)" value={newCust.mobile} onChange={e => setNewCust({ ...newCust, mobile: e.target.value })} required />
        <input placeholder="Rate ₹/L" type="number" value={newCust.rate} onChange={e => setNewCust({ ...newCust, rate: e.target.value })} />
        <input placeholder="Default Qty (L)" type="number" value={newCust.defaultQty} onChange={e => setNewCust({ ...newCust, defaultQty: e.target.value })} />
        <button type="submit">Add Customer</button>
      </form>

      <table border="1" width="100%" cellPadding="6" style={{ marginTop: "15px" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Mobile</th>
            <th>Rate</th>
            <th>Default Qty</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.mobile}</td>
              <td>{c.rate}</td>
              <td>{c.defaultQty}</td>
              <td>
                <button onClick={() => deleteCustomer(c.id)}>🗑️ Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
