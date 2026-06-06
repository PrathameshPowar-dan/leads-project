"use client";
import { useState, useEffect } from 'react';
import { leadService } from '../services/api';
import LeadModal from '../components/LeadModal';
import { Search, Plus, Edit2, Trash2, Filter, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');

  const fetchLeads = async () => {
    try {
      const data = await leadService.getAllLeads({
        page,
        limit: 10,
        status: statusFilter,
        order: sortOrder,
        search: searchQuery
      });
      setLeads(data.data.leads || []);
      setTotalPages(data.data.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch leads", error);
    }
  };

  // Watch for changes in page, status, or sort
  useEffect(() => {
    fetchLeads();
  }, [page, statusFilter, sortOrder]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setPage(1);
      fetchLeads();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleOpenModal = (lead = null) => {
    setEditingLead(lead);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingLead(null);
    setIsModalOpen(false);
  };

  const handleSaveLead = async (leadData) => {
    try {
      if (editingLead) {
        await leadService.updateLead(editingLead._id, leadData);
      } else {
        await leadService.createLead(leadData);
      }
      fetchLeads();
      handleCloseModal();
    } catch (error) {
      alert("Error saving lead");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      await leadService.deleteLead(id);
      fetchLeads();
    }
  };

  const totalLeads = leads.length;
  const convertedLeads = leads.filter(l => l.status === 'Converted').length;

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-black">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">CRM Dashboard</h1>
          <button onClick={() => handleOpenModal()} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm">
            <Plus size={20} /> Add Lead
          </button>
        </header>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-gray-500 text-sm font-medium">Leads in View</h3>
            <p className="text-3xl font-bold text-gray-800">{totalLeads}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-gray-500 text-sm font-medium">Converted Deals</h3>
            <p className="text-3xl font-bold text-green-600">{convertedLeads}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex flex-wrap gap-4 items-center justify-between bg-gray-50">
            <div className="flex items-center gap-2 flex-1 min-w-75 bg-white border border-gray-300 rounded px-3 py-2">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or company..."
                className="w-full bg-transparent outline-none text-sm text-gray-800"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white border border-gray-300 rounded px-2 py-1.5">
                <Filter size={16} className="text-gray-500" />
                <select
                  className="bg-transparent outline-none text-sm text-gray-700"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="">All Statuses</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Converted">Converted</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>

              <div className="flex items-center gap-2 bg-white border border-gray-300 rounded px-2 py-1.5">
                <ArrowUpDown size={16} className="text-gray-500" />
                <select
                  className="bg-transparent outline-none text-sm text-gray-700"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white text-gray-600 text-sm border-b">
                  <th className="p-4 font-semibold">Name</th>
                  <th className="p-4 font-semibold">Company</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Created Date</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.length > 0 ? leads.map((lead) => (
                  <tr key={lead._id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <p className="font-medium text-gray-800">{lead.name}</p>
                      <p className="text-sm text-gray-500">{lead.email}</p>
                    </td>
                    <td className="p-4 text-gray-700">{lead.companyName}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${lead.status === 'Converted' ? 'bg-green-50 text-green-700 border-green-200' :
                          lead.status === 'Lost' ? 'bg-red-50 text-red-700 border-red-200' :
                            'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600 text-sm">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleOpenModal(lead)} className="text-gray-400 hover:text-blue-600 mr-3 transition-colors">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(lead._id)} className="text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500">
                      No leads found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
              <span className="text-sm text-gray-600">
                Page <span className="font-semibold text-gray-800">{page}</span> of <span className="font-semibold text-gray-800">{totalPages}</span>
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-sm"
                >
                  <ChevronLeft size={16} /> Prev
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-sm"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        <LeadModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSaveLead}
          initialData={editingLead}
        />
      </div>
    </div>
  );
}