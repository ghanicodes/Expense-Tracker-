import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import ExpenseEditModal from "./ExpenseEditModal";
import { 
  LayoutDashboard, Wallet, CreditCard, LogOut, ArrowUpRight, 
  ArrowDownLeft, Menu, X, TrendingUp, History, User, ChevronRight
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

import Expense from "./Expense"; 
import AddIncome from "./AddIncome";
import ExpenseTable from './ExpenseTable';
import IncomeTable from './IncomeTable';

const ResponsiveDashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [incomes, setIncomes] = useState([]);
  const [stats, setStats] = useState({});
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkAuth();
    fetchExpenses();
    fetchIncome();
    fetchStats();
  }, []);

 const refreshData = () => {
  fetchExpenses();
  fetchIncome();
  fetchStats();
};


  const checkAuth = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/v1/auth/me", { method: "GET", credentials: "include" });
      if (!response.ok) throw new Error("Not authenticated");
      const data = await response.json(); 
      setUser(data); 
      setLoading(false);
    } catch (error) {
      navigate("/login");
    }
  };

  const fetchExpenses = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/expenses/get", { credentials: "include" });
      const data = await res.json();
      setExpenses(data);
    } catch (err) { console.log(err); }
  };

  const deleteExpense = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/expenses/delete/${id}`, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error("Delete failed");
      setExpenses((prev) => prev.filter((item) => item._id !== id));
      alert("Expense Deleted");
    } catch (error) { console.log(error); }
  };

  const updateExpense = async (updatedData) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/expenses/update/${updatedData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) throw new Error("Update failed");
      const data = await res.json();
      setExpenses((prev) => prev.map((item) => item._id === data._id ? data : item));
      setEditingExpense(null);
      alert("Updated Successfully");
    } catch (error) { console.log(error); }
  };

  const handleLogout = async () => {
     try {
      await fetch("http://localhost:8000/api/v1/auth/logout", { method: "POST", credentials: "include" });
      navigate('/login');
     } catch (error) { console.log("Logout Error:", error); }
  }

  const fetchIncome = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/income/getIncome", { credentials: "include" });
      const data = await res.json();
      setIncomes(data);
    } catch (err) { console.log(err); }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/dashboard/stats", { credentials: "include" });
      const data = await res.json();
      setStats(data);
    } catch (err) { console.log(err); }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-500 tracking-widest uppercase">Initializing</p>
        </div>
      </div>
    );
  }

  const DashboardHome = () => {
    const chartData = [
      { name: 'Expenses', value: stats.totalExpense || 0, color: '#f43f5e' },
      { name: 'Income', value: stats.totalIncome || 0, color: '#10b981' },
      { name: 'Balance', value: stats.totalBalance || 0, color: '#6366f1' },
    ];

    return (
      <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-700">
        {/* Welcome Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Financial Overview</h2>
            <p className="text-slate-500 font-medium">Welcome back, {user?.fullName?.split(' ')[0] || 'User'}! Here's your summary.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setActiveTab('expense')}
              className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-800 transition-all flex items-center gap-2"
            >
              <ArrowDownLeft size={18} /> Add Expense
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Total Balance"
            amount={stats.totalBalance || 0}
            icon={<Wallet className="text-indigo-600" />}
            trend="+2.5%"
            color="indigo"
          />
          <StatCard 
            title="Total Income"
            amount={stats.totalIncome || 0}
            icon={<TrendingUp className="text-emerald-600" />}
            trend="+12%"
            color="emerald"
          />
          <StatCard 
            title="Total Expenses"
            amount={stats.totalExpense || 0}
            icon={<ArrowUpRight className="text-rose-600" />}
            trend="-4.3%"
            color="rose"
          />
        </div>

        {/* Visual Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col justify-center items-center relative overflow-hidden">
            <div className="absolute top-6 left-8">
              <h3 className="text-lg font-bold text-slate-800">Wealth Distribution</h3>
              <p className="text-xs text-slate-400">Current allocation</p>
            </div>
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Pie 
                    data={chartData} 
                    dataKey="value" 
                    innerRadius="65%" 
                    outerRadius="85%" 
                    paddingAngle={10} 
                    cornerRadius={8}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              {/* Center Text for Donut */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none mt-4">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Net Worth</span>
                <p className="text-2xl font-black text-slate-800">Rs {stats.totalBalance || 0}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
             <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-100">
                <div className="relative z-10">
                  <h4 className="text-indigo-100 font-medium mb-1">Weekly Savings Goal</h4>
                  <p className="text-3xl font-bold mb-4">75% Achieved</p>
                  <div className="w-full bg-indigo-500/50 h-3 rounded-full mb-2">
                    <div className="bg-white h-full rounded-full" style={{width: '75%'}}></div>
                  </div>
                  <p className="text-xs text-indigo-100">You're Rs 5,000 away from your target!</p>
                </div>
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
             </div>
             
             <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <History size={18} className="text-indigo-600" /> Recent Activity
                </h4>
                <div className="space-y-4">
                  {[...expenses].slice(0, 3).map((exp, i) => (
                    <div key={i} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-2xl transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 font-bold">
                          {exp.category?.[0] || 'E'}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-700">{exp.title}</p>
                          <p className="text-xs text-slate-400">{exp.date}</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-rose-500">-Rs {exp.amount}</span>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-sans text-slate-900">
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-40 lg:hidden transition-all"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 w-72 bg-white border-r border-slate-100 p-8 transition-all duration-300 
        lg:translate-x-0 lg:static z-50 flex flex-col shadow-2xl lg:shadow-none
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="mb-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <LayoutDashboard size={18} className="text-white" />
            </div>
            <h1 className="font-black text-2xl tracking-tighter text-slate-900">EXPENSIFY</h1>
          </div>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}><X size={20}/></button>
        </div>

{user && (
  <div className="mb-10 bg-slate-50 p-4 rounded-3xl flex items-center gap-4 border border-slate-100">
    <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-sm bg-indigo-100 flex-shrink-0">
      {user?.profileImageUrl ? (
        <img 
          src={user.profileImageUrl} 
          alt="User Profile" 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=6366f1&color=fff`;
          }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-indigo-600 text-white font-bold text-lg">
          {user.fullName?.charAt(0)}
        </div>
      )}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-bold truncate text-slate-800">{user.fullName}</p>
      <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">Premium Plan</p>
    </div>
  </div>
)}

        <nav className="space-y-1.5 flex-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-4">Menu</p>
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={activeTab === "dashboard"} onClick={() => { setActiveTab("dashboard"); setSidebarOpen(false); }} />
          <NavItem icon={<Wallet size={20} />} label="Add Income" active={activeTab === "addIncome"} onClick={() => { setActiveTab("addIncome"); setSidebarOpen(false); }} />
          <NavItem icon={<CreditCard size={20} />} label="Add Expense" active={activeTab === "expense"} onClick={() => { setActiveTab("expense"); setSidebarOpen(false); }} />
          <NavItem icon={<History size={20} />} label="All Expense" active={activeTab === "allExpense"} onClick={() => { setActiveTab("allExpense"); setSidebarOpen(false); }} />
          <NavItem icon={<TrendingUp size={20} />} label="Income Record" active={activeTab === "incomeRecord"} onClick={() => { setActiveTab("incomeRecord"); setSidebarOpen(false); }} />
        </nav>

        <button onClick={handleLogout} className="mt-auto flex items-center gap-3 px-4 py-4 text-slate-400 hover:text-rose-500 transition-colors font-bold text-sm">
          <LogOut size={20} /> Logout Account
        </button>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="lg:hidden flex justify-between items-center p-6 bg-white/80 backdrop-blur-md border-b sticky top-0 z-30">
          <span className="font-black text-slate-900 uppercase tracking-widest text-xs">{activeTab}</span>
          <button onClick={() => setSidebarOpen(true)} className="p-2 bg-slate-100 rounded-xl"><Menu size={20} /></button>
        </header>

        <div className="flex-1 overflow-y-auto">
          {activeTab === "dashboard" && <DashboardHome />}
          {/* {activeTab === "expense" && <div className="p-6 lg:p-10 max-w-5xl mx-auto"><Expense /></div>} */}
          {activeTab === "expense" && (<div className="p-6 lg:p-10 max-w-5xl mx-auto"> <Expense onSuccess={refreshData} /></div>)}
          {activeTab === "addIncome" && <div className="p-6 lg:p-10 max-w-5xl mx-auto"><AddIncome onSuccess={refreshData} /></div>}
          {activeTab === "allExpense" && <div className="p-6 lg:p-10 max-w-6xl mx-auto"><ExpenseTable expenses={expenses} onEdit={(e) => setEditingExpense(e)} onDelete={deleteExpense} /></div>}
          {activeTab === "incomeRecord" && <div className="p-6 lg:p-10 max-w-6xl mx-auto"><IncomeTable incomes={incomes} /></div>}
        </div>
      </main>

      {editingExpense && (
        <ExpenseEditModal expense={editingExpense} onClose={() => setEditingExpense(null)} onSave={updateExpense} />
      )}
    </div>
  );
};


const NavItem = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
      active ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "text-slate-500 hover:bg-slate-50"
    }`}
  >
    <div className="flex items-center gap-3">
      {icon}
      <span className="font-bold text-sm">{label}</span>
    </div>
    {active && <ChevronRight size={14} className="text-indigo-200" />}
  </button>
);

const StatCard = ({ title, amount, icon, color, trend }) => {
  const colorMap = {
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    rose: "bg-rose-50 text-rose-600"
  };

  return (
    <div className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-4 rounded-2xl transition-transform group-hover:scale-110 duration-300 ${colorMap[color]}`}>
          {React.cloneElement(icon, { size: 24 })}
        </div>
        <span className={`text-xs font-black px-3 py-1 rounded-full ${trend.includes('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {trend}
        </span>
      </div>
      <div>
        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.15em] mb-1">{title}</p>
        <p className="text-3xl font-black text-slate-900 tracking-tight">
          <span className="text-lg font-bold text-slate-400 mr-1">Rs</span>
          {amount.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default ResponsiveDashboard;