import React from "react";
import { Trash2, Edit3 } from "lucide-react";

const IncomeTable = ({ incomes = [], onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      
      {/* Header */}
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-xl font-bold text-slate-800">
          All Income
        </h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">

          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">
                Title
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">
                Amount
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">
                Source
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500">
                Date
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 text-right">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {incomes.length > 0 ? (
              incomes.map((item) => (
                <tr key={item._id} className="hover:bg-slate-50 transition">
                  
                  <td className="px-6 py-4 font-semibold text-slate-800">
                    {item.title}
                  </td>

                  <td className="px-6 py-4 text-red-500 font-bold">
                    Rs = {item.amount?.toLocaleString()}
                  </td>

                  <td className="px-6 py-4 capitalize text-slate-600">
                    {item.source}
                  </td>

                  <td className="px-6 py-4 text-slate-500">
                    {new Date(item.date).toLocaleDateString()}
                  </td>

                  {/* ACTION COLUMN */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">

                      {/* Edit Button */}
                      <button
                        onClick={() => onEdit && onEdit(item)}
                        className="p-2 rounded-lg bg-violet-50 text-violet-600 hover:bg-violet-100 transition"
                      >
                        <Edit3 size={18} />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => onDelete && onDelete(item._id)}
                        className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition"
                      >
                        <Trash2 size={18} />
                      </button>

                    </div>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-12 text-slate-400">
                  No income found
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default IncomeTable;