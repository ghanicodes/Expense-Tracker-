import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import ExpenseEditModal from "./ExpenseEditModal";
import { 
  LayoutDashboard, Wallet, CreditCard, LogOut, ArrowUpRight, 
  ArrowDownLeft, Menu, X 
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

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
  const [stats, setStats] = useState({})

  // AUTH CHECK
  useEffect(() => {
    checkAuth();
    fetchExpenses();
    fetchIncome();
    fetchStats();

  }, []);
      

  const checkAuth = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/auth/me",
        { method: "GET", credentials: "include" }
      );
      if (!response.ok) throw new Error("Not authenticated");
      setLoading(false);
    } catch (error) {
      navigate("/login");
      console.log("Error ");
      
    }
  };


  // Get All Expenses 
  const fetchExpenses = async () => {
  try {
    const res = await fetch("http://localhost:8000/api/v1/expenses/get", {
      credentials: "include",
    });

    const data = await res.json();
    setExpenses(data);
  } catch (err) {
    console.log(err);
  }
};


// Delete Expense 
const deleteExpense = async (id) => {
  try {
    const res = await fetch(`http://localhost:8000/api/v1/expenses/delete/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Delete failed");
    }

    setExpenses((prev) => prev.filter((item) => item._id !== id));

    alert("Expense Deleted ");

  } catch (error) {
    console.log(error);
  }
};

// Edit Expenses 
const editExpense = (item) => {
  console.log("Editing:", item);
  setEditingExpense(item); 
};

const updateExpense = async (updatedData) => {
  try {
    const res = await fetch(
      `http://localhost:8000/api/v1/expenses/update/${updatedData._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updatedData),
      }
    );

    if (!res.ok) throw new Error("Update failed");

    const data = await res.json();

    setExpenses((prev) =>
      prev.map((item) =>
        item._id === data._id ? data : item
      )
    );

    setEditingExpense(null); // Close modal
    alert("Updated Successfully ");

  } catch (error) {
    console.log(error);
  }
};


// Logout User 
const handleLogout = async () => {
   try {
    await fetch("http://localhost:8000/api/v1/auth/logout", {
    method: "POST",
    credentials: "include"
    });
    
    navigate('/login')

   } catch (error) {
      console.log("Logout Error:", error);
   }
}


  // Get All Income 
  const fetchIncome = async () => {
  try {
    const res = await fetch("http://localhost:8000/api/v1/income/getIncome", {
      credentials: "include",
    });

    const data = await res.json();
    setIncomes(data);
  } catch (err) {
    console.log(err);
  }
};


// Fetch Incomes & Expenses 
const fetchStats = async () => {
  const res = await fetch("http://localhost:8000/api/v1/dashboard/stats", {
    credentials: "include"
  });

  const data = await res.json();
  setStats(data);
};



  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="font-bold text-slate-600">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  // ================= DASHBOARD HOME VIEW =================
  const DashboardHome = () => {
    const data = [
  { name: 'Total Balance', value: stats.totalBalance || 0, color: '#8b5cf6' },
  { name: 'Total Expenses', value: stats.totalExpense || 0, color: '#ef4444' },
  { name: 'Total Income', value: stats.totalIncome || 0, color: '#f97316' },
];

    return (
      <div className="p-4 md:p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
        {/* Stats Grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

  <StatCard 
    title="Total Balance "
    amount={`Rs ${stats.totalBalance || 0}`}
    color="bg-violet-600"
    icon={<CreditCard className="text-white" />}
  />

  <StatCard 
    title="Total Income"
    amount={`Rs ${stats.totalIncome || 0}`}
    color="bg-orange-500"
    icon={<Wallet className="text-white" />}
  />

  <StatCard 
    title="Total Expenses"
    amount={`Rs ${stats.totalExpense || 0}`}
    color="bg-red-500"
    icon={<ArrowDownLeft className="text-white" />}
  />

</div>
       

        {/* Chart Section */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold mb-6 text-slate-800">Financial Overview</h3>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} dataKey="value" innerRadius="70%" outerRadius="90%" paddingAngle={8}>
                  {data.map((entry, index) => (
                    <Cell key={index} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="flex justify-center gap-6 mt-6">
             {data.map(item => (
               <div key={item.name} className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}} />
                 <span className="text-xs font-medium text-slate-500">{item.name}</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    );
  };

  // ================= MAIN RENDER =================
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">

      {/* ===== MOBILE OVERLAY ===== */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ===== SIDEBAR ===== */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 p-6 transition-transform duration-300 
        lg:translate-x-0 lg:static z-50 flex flex-col
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex justify-between items-center mb-10">
          <h1 className="font-black text-xl text-violet-600 tracking-tight">EXPENSIFY</h1>
          <button className="lg:hidden p-1 hover:bg-slate-100 rounded-md" onClick={() => setSidebarOpen(false)}>
            <X size={22} className="text-slate-500" />
          </button>
        </div>

        <nav className="space-y-2 flex-1">
          <NavItem
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            active={activeTab === "dashboard"}
            onClick={() => { setActiveTab("dashboard"); setSidebarOpen(false); }}
          />

          <NavItem
            icon={<Wallet size={20} />}
            label="Add Income"
            active={activeTab === "addIncome"}
            onClick={() => { setActiveTab("addIncome"); setSidebarOpen(false); }}
          />

          <NavItem
            icon={<CreditCard size={20} />}
            label="Add Expense"
            active={activeTab === "expense"}
            onClick={() => { setActiveTab("expense"); setSidebarOpen(false); }}
          />

            <NavItem
            icon={<CreditCard size={20} />}
            label="All Expense"
            active={activeTab === "allExpense"}
            onClick={() => { setActiveTab("allExpense"); setSidebarOpen(false); }}
          />

          <NavItem
            icon={<CreditCard size={20} />}
            label="Income Record"
            active={activeTab === "incomeRecord"}
            onClick={() => { setActiveTab("incomeRecord"); setSidebarOpen(false); }}
          />
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
        >
          <LogOut size={20} />
          <span className="font-semibold">Logout</span>
        </button>
      </aside>
       
      {/* Edit  */}
      {editingExpense && (
        <ExpenseEditModal
          expense={editingExpense}
          onClose={() => setEditingExpense(null)}
          onSave={updateExpense}
        />
      )}

      {/* ===== CONTENT AREA ===== */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Mobile Navbar */}
        <header className="lg:hidden flex justify-between items-center p-4 bg-white border-b sticky top-0 z-30">
          <span className="font-bold text-slate-800 capitalize">{activeTab}</span>
          <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-slate-100 rounded-lg">
            <Menu size={20} />
          </button>
        </header>

        {/* ===== TAB CONTENT RENDERING ===== */}
       <div className="flex-1 overflow-y-auto">

  {activeTab === "dashboard" && <DashboardHome />}

  {activeTab === "expense" && (
    <div className="p-4 md:p-8 animate-in slide-in-from-bottom-4 duration-500">
      <Expense />
    </div>
  )}

  {activeTab === "addIncome" && (
    <div className="p-4 md:p-8 animate-in slide-in-from-bottom-4 duration-500">
      <AddIncome />
    </div>
  )}

  {activeTab === "allExpense" && (
    <div className="p-4 md:p-8 animate-in slide-in-from-bottom-4 duration-500">
      <ExpenseTable
        expenses={expenses}
        onEdit={editExpense}
        onDelete={deleteExpense}
      />
    </div>
  )}

  {activeTab === "incomeRecord" && (
    <div className="p-4 md:p-8 animate-in slide-in-from-bottom-4 duration-500">
      <IncomeTable incomes={incomes} />
    </div>
  )}

</div>
      </main>
    </div>
  );
};

/* ================= Helper Components ================= */

const NavItem = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      active
        ? "bg-violet-600 text-white shadow-lg shadow-violet-200"
        : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
    }`}
  >
    {icon}
    <span className="font-bold">{label}</span>
  </button>
);

const StatCard = ({ title, amount, icon, color }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
    <div className={`p-4 rounded-2xl ${color} shadow-inner`}>
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <div>
      <p className="text-sm font-medium text-slate-400 mb-0.5">{title}</p>
      <p className="text-2xl font-black text-slate-800 tracking-tight">{amount}</p>
    </div>
  </div>
);

export default ResponsiveDashboard;