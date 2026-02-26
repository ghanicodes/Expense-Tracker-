import React, { useState } from 'react';
import { PlusCircle, DollarSign, Tag, Calendar, PenTool, Loader2 } from 'lucide-react';

const AddExpenseForm = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
  });

  const categories = [
    'Shopping', 'Travel', 'Food', 'Salary', 'Bills', 'Entertainment', 'Others'
  ];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  const payload = {
    ...formData,
    amount: Number(formData.amount),
    date: new Date(formData.date),
  };

  try {
    const response = await fetch("http://localhost:8000/api/v1/expenses/add", {
      method: "POST",
      credentials: "include", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to add expense");
    }

    console.log("Success:", data);
    alert("Expense Added Successfully ");
    
          if (onSuccess) {
        onSuccess();
          }

    // Reset form
    setFormData({
      title: "",
      amount: "",
      category: "",
      date: new Date().toISOString().split("T")[0],
    });

  } catch (error) {
    console.error("Error:", error.message);
    alert("Something went wrong ");
  }

  setLoading(false);
};

  return (
    <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="bg-violet-600 p-6 text-white">
        <div className="flex items-center gap-3">
          <PlusCircle size={28} />
          <h2 className="text-xl font-bold">Add New Expense</h2>
        </div>
        <p className="text-violet-100 text-sm mt-1">Fill in the details to track your spending.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        {/* Title Input */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
            <PenTool size={16} className="text-slate-400" /> Expense Title
          </label>
          <input
            required
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Weekly Groceries"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all placeholder:text-slate-300"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Amount Input */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <DollarSign size={16} className="text-slate-400" /> Amount
            </label>
            <input
              required
              type="number"
              min="0"
              step="0.01"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all placeholder:text-slate-300"
            />
          </div>

          {/* Date Input */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <Calendar size={16} className="text-slate-400" /> Date
            </label>
            <input
              required
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all text-slate-600"
            />
          </div>
        </div>

        {/* Category Select */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
            <Tag size={16} className="text-slate-400" /> Category
          </label>
          <select
            required
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all bg-white text-slate-600"
          >
            <option value="" disabled>Select a category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-violet-200 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Processing...
            </>
          ) : (
            'Save Expense'
          )}
        </button>
      </form>
    </div>
  );
};

export default AddExpenseForm;