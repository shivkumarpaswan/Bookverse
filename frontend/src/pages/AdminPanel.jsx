import React from 'react';
import { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminPanel() {
  const [stats, setStats] = useState({});
  const [tab, setTab] = useState('dashboard');
  const [pending, setPending] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [newCoupon, setNewCoupon] = useState({ code: '', discountValue: '', discountType: 'percent', minOrder: 0 });

  useEffect(() => {
    api.get('/admin/stats').then(res => setStats(res.data));
    api.get('/admin/books/pending').then(res => setPending(res.data));
    api.get('/admin/users').then(res => setUsers(res.data));
    api.get('/orders').then(res => setOrders(res.data));
    api.get('/coupons').then(res => setCoupons(res.data));
  }, []);

  const approveBook = async (id) => {
    await api.put(`/admin/books/${id}/approve`);
    setPending(pending.filter(b => b._id !== id));
    toast.success('Approved!');
  };

  const changeRole = async (id, role) => {
    await api.put(`/admin/users/${id}/role`, { role });
    setUsers(users.map(u => u._id === id ? { ...u, role } : u));
    toast.success('Role updated');
  };

  const updateStatus = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    setOrders(orders.map(o => o._id === id ? { ...o, status } : o));
    toast.success('Status updated');
  };

  const addCoupon = async () => {
    if (!newCoupon.code || !newCoupon.discountValue) return toast.error('Fill fields');
    const { data } = await api.post('/coupons', newCoupon);
    setCoupons([data, ...coupons]);
    setNewCoupon({ code: '', discountValue: '', discountType: 'percent', minOrder: 0 });
    toast.success('Coupon created');
  };

  const deleteCoupon = async (id) => {
    await api.delete(`/coupons/${id}`);
    setCoupons(coupons.filter(c => c._id !== id));
  };

  const chartData = [
    { name: 'Users', value: stats.users || 0 },
    { name: 'Books', value: stats.books || 0 },
    { name: 'Orders', value: stats.orders || 0 },
    { name: 'Reviews', value: stats.reviews || 0 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-serif font-bold mb-6">Admin Panel 🛠️</h1>

      <div className="flex gap-3 mb-6 flex-wrap">
        {['dashboard', 'books', 'orders', 'users', 'coupons'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded capitalize ${tab === t ? 'bg-vintage-900 text-white' : 'bg-vintage-100'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'dashboard' && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <Stat label="Users" value={stats.users} />
            <Stat label="Books" value={stats.books} />
            <Stat label="Orders" value={stats.orders} />
            <Stat label="Reviews" value={stats.reviews} />
            <Stat label="Revenue" value={`₹${stats.revenue?.toFixed(0) || 0}`} />
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
            <h3 className="font-bold mb-4">Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#6b4423" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {tab === 'books' && (
        <div className="space-y-3">
          <h2 className="font-bold text-xl mb-2">Pending Approvals ({pending.length})</h2>
          {pending.length === 0 ? <p className="text-gray-500">No pending books</p> :
            pending.map(b => (
              <div key={b._id} className="bg-white dark:bg-gray-800 p-4 rounded shadow flex justify-between items-center">
                <div>
                  <p className="font-semibold">{b.title}</p>
                  <p className="text-sm text-gray-500">{b.author} · ₹{b.price} · {b.condition}</p>
                  <p className="text-xs text-gray-400">Seller: {b.sellerId?.name}</p>
                </div>
                <button onClick={() => approveBook(b._id)} className="bg-green-600 text-white px-4 py-2 rounded">
                  Approve
                </button>
              </div>
            ))
          }
        </div>
      )}

      {tab === 'orders' && (
        <div className="bg-white dark:bg-gray-800 rounded shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-vintage-100 dark:bg-gray-700">
              <tr><th className="p-3">Order</th><th>User</th><th>Amount</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o._id} className="border-b">
                  <td className="p-3 font-mono text-sm">#{o._id.slice(-6)}</td>
                  <td className="p-3">{o.userId?.name}</td>
                  <td className="p-3">₹{o.totalAmount}</td>
                  <td className="p-3">
                    <span className="text-sm">{o.status}</span>
                  </td>
                  <td className="p-3">
                    <select value={o.status} onChange={e => updateStatus(o._id, e.target.value)}
                      className="border p-1 rounded text-sm">
                      {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'users' && (
        <div className="bg-white dark:bg-gray-800 rounded shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-vintage-100 dark:bg-gray-700">
              <tr><th className="p-3">Name</th><th>Email</th><th>Role</th></tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} className="border-b">
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">
                    <select value={u.role} onChange={e => changeRole(u._id, e.target.value)}
                      className="border p-1 rounded text-sm">
                      <option>user</option><option>seller</option><option>admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'coupons' && (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4 bg-white dark:bg-gray-800 p-4 rounded">
            <input placeholder="Code" value={newCoupon.code}
              onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
              className="border p-2 rounded" />
            <input type="number" placeholder="Value" value={newCoupon.discountValue}
              onChange={e => setNewCoupon({ ...newCoupon, discountValue: +e.target.value })}
              className="border p-2 rounded" />
            <select value={newCoupon.discountType}
              onChange={e => setNewCoupon({ ...newCoupon, discountType: e.target.value })}
              className="border p-2 rounded">
              <option value="percent">%</option><option value="flat">Flat ₹</option>
            </select>
            <input type="number" placeholder="Min Order" value={newCoupon.minOrder}
              onChange={e => setNewCoupon({ ...newCoupon, minOrder: +e.target.value })}
              className="border p-2 rounded" />
            <button onClick={addCoupon} className="bg-vintage-900 text-white rounded">Add</button>
          </div>

          <div className="space-y-2">
            {coupons.map(c => (
              <div key={c._id} className="bg-white dark:bg-gray-800 p-3 rounded flex justify-between">
                <span className="font-mono">{c.code} - {c.discountValue}{c.discountType === 'percent' ? '%' : '₹'} off</span>
                <button onClick={() => deleteCoupon(c._id)} className="text-red-500 text-sm">Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const Stat = ({ label, value }) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-2xl font-bold text-vintage-900 dark:text-vintage-100">{value}</p>
  </div>
);