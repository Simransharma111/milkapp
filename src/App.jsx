import React, { useState, useEffect } from 'react'
import CustomerList from './components/CustomerList'
import DailyEntry from './components/DailyEntry'
import MonthlyReport from './components/MonthlyReport'
import { speakHindi } from './utils/speakHindi'

const STORAGE_KEY = 'menka_milk_app_v2'

const initialData = {
  momName: 'Menka',
  customers: [
    { id: 1, name: 'ps chahuan', rate: 60 } // ₹60/L default
  ],
  entries: [] // {date: 'YYYY-MM-DD', customerId, qty}
}

export default function App() {
  const [data, setData] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : initialData
    } catch (e) {
      return initialData
    }
  })
  const [view, setView] = useState('daily') // 'daily' | 'customers' | 'monthly'

  // Save data persistently
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [data])

  // Welcome message
  useEffect(() => {
    speakHindi(`नमस्ते ${data.momName} जी, मेंनका मिल्क ऐप में आपका स्वागत है।`)
  }, [])

  // Add new customer
  const addCustomer = (cust) => {
    const id = Date.now()
    setData(d => ({ ...d, customers: [...d.customers, { ...cust, id }] }))
    speakHindi(`${cust.name} ग्राहक जोड़ा गया।`)
  }

  // Update customer (for rate or name)
  const updateCustomer = (id, updated) => {
    setData(d => ({
      ...d,
      customers: d.customers.map(c => c.id === id ? { ...c, ...updated } : c)
    }))
    if (updated.rate) {
      speakHindi(`दर बदली गई है — अब ₹${updated.rate} प्रति लीटर।`)
    }
  }

  // Delete customer
  const deleteCustomer = (id) => {
    const cust = data.customers.find(c => c.id === id)
    setData(d => ({
      ...d,
      customers: d.customers.filter(c => c.id !== id),
      entries: d.entries.filter(e => e.customerId !== id)
    }))
    speakHindi(`${cust?.name || "ग्राहक"} हटाया गया।`)
  }

  // Add daily entry
  const addEntry = (entry) => {
    setData(d => ({ ...d, entries: [...d.entries, entry] }))
    const cust = data.customers.find(c => c.id === entry.customerId)
    speakHindi(`${cust?.name || "ग्राहक"} के लिए ${entry.qty} लीटर दूध दर्ज हुआ।`)
  }

  // Calculate monthly totals (to pass into MonthlyReport)
  const calculateMonthlyTotals = () => {
    const totals = {}
    data.entries.forEach(e => {
      const c = data.customers.find(c => c.id === e.customerId)
      if (!c) return
      const monthKey = e.date.slice(0, 7) // YYYY-MM
      if (!totals[monthKey]) totals[monthKey] = {}
      if (!totals[monthKey][c.name]) totals[monthKey][c.name] = { qty: 0, amount: 0 }
      totals[monthKey][c.name].qty += Number(e.qty)
      totals[monthKey][c.name].amount += Number(e.qty) * c.rate
    })
    return totals
  }

  const monthlyTotals = calculateMonthlyTotals()

  return (
    <div className="container">
      <header>
        <h1>Menka's Milk App 🥛</h1>
        <p className="subtitle">
          नमस्ते {data.momName} जी — दूध हिसाब अब और आसान!
        </p>

      <nav>
  <button className={view==='daily'? 'active':''} onClick={()=>setView('daily')}>Daily Entry</button>
  <button className={view==='customers'? 'active':''} onClick={()=>setView('customers')}>Customers</button>
  <button className={view==='monthly'? 'active':''} onClick={()=>setView('monthly')}>Monthly Report</button>
  <button className={view==='report'? 'active':''} onClick={()=>setView('report')}>Daily Report</button>
</nav>
</header>
<main>
  {view === 'daily' && <DailyEntry customers={data.customers} addEntry={addEntry} />}
  {view === 'customers' && <CustomerList customers={data.customers} addCustomer={addCustomer} updateCustomer={updateCustomer} deleteCustomer={deleteCustomer} />}
  {view === 'monthly' && <MonthlyReport customers={data.customers} entries={data.entries} />}
  {view === 'report' && <DailyReport customers={data.customers} entries={data.entries} />}
</main>


      <footer>
        <small>Data stored locally — कोई इंटरनेट ज़रूरत नहीं।</small>
      </footer>
    </div>
  )
}
