import React, { useState } from 'react';
import { User } from '../../types';
import { Users, Search, ShoppingBag, MapPin, Eye, ShieldCheck, Mail, Phone } from 'lucide-react';
import { Modal } from '../ui/Modal';

interface CustomersManagerProps {
  customers: User[];
  onRefresh: () => void;
}

export const CustomersManager: React.FC<CustomersManagerProps> = ({ customers, onRefresh }) => {
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.phone && c.phone.includes(search))
  );

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900">Customer Accounts & Profiles</h2>
            <p className="text-xs text-slate-500">Manage registered shopper accounts, orders, and addresses.</p>
          </div>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 text-slate-400 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="p-3">Customer</th>
              <th className="p-3">Contact</th>
              <th className="p-3">Total Orders</th>
              <th className="p-3">Total Spent</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((c: any) => (
              <tr key={c._id || c.id} className="hover:bg-slate-50/50">
                <td className="p-3 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center shrink-0">
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{c.name}</p>
                    <span className="text-[10px] text-slate-400 font-mono">ID: {String(c._id || c.id).slice(-6)}</span>
                  </div>
                </td>
                <td className="p-3">
                  <p className="text-slate-800 font-medium">{c.email}</p>
                  <p className="text-slate-400 text-[10px]">{c.phone || 'No phone set'}</p>
                </td>
                <td className="p-3 font-bold text-slate-900">{c.orderCount || 0} orders</td>
                <td className="p-3 font-bold text-blue-700 tabular-nums">৳ {(c.totalSpent || 0).toLocaleString()}</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Active
                  </span>
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => setSelectedCustomer(c)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="View customer profile"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Customer Profile Modal */}
      {selectedCustomer && (
        <Modal
          isOpen={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          title={`Customer Profile: ${selectedCustomer.name}`}
          subtitle="Detailed order history and saved delivery destinations."
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Email Address</span>
                <p className="font-bold text-slate-900">{selectedCustomer.email}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Phone Number</span>
                <p className="font-bold text-slate-900">{selectedCustomer.phone || 'Not provided'}</p>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                Saved Delivery Addresses ({selectedCustomer.addresses?.length || 0})
              </h4>
              <div className="space-y-2">
                {(selectedCustomer.addresses || []).map((addr: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-xl border border-slate-200 bg-white space-y-1">
                    <p className="font-bold text-slate-900">{addr.recipientName} ({addr.phone})</p>
                    <p className="text-slate-600">
                      {addr.streetAddress}, {addr.upazila}, {addr.district}, {addr.division}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
