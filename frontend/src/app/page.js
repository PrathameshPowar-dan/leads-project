"use client";
import { useState, useEffect } from 'react';
import { leadService } from '../services/api';
import LeadModal from '../components/LeadModal';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';

export default function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);

  const fetchLeads = async () => {
    try {
      const data = await leadService.getAllLeads();
      setLeads(data.data.leads || []);
    } catch (error) {
      console.error("Failed to fetch leads", error);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      const delayDebounceFn = setTimeout(async () => {
        const data = await leadService.searchLeads(searchQuery);
        setLeads(data.data || []);
      }, 500);
      return () => clearTimeout(delayDebounceFn);
    } else {
      fetchLeads();
    }
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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">

        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">CRM Dashboard</h1>
          <button onClick={() => handleOpenModal()} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700">
            <Plus size={20} /> Add Lead
          </button>
        </header>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-gray-500 text-sm font-medium">Total Leads</h3>
            <p className="text-3xl font-bold text-gray-800">{totalLeads}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-gray-500 text-sm font-medium">Converted Deals</h3>
            <p className="text-3xl font-bold text-green-600">{convertedLeads}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="p-4 border-b flex items-center gap-2 bg-gray-50">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or company..."
              className="w-full bg-transparent outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm border-b">
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Company</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead._id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <p className="font-medium text-gray-800">{lead.name}</p>
                      <p className="text-sm text-gray-500">{lead.email}</p>
                    </td>
                    <td className="p-4 text-gray-600">{lead.companyName}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${lead.status === 'Converted' ? 'bg-green-100 text-green-800' : lead.status === 'Lost' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600 text-sm">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleOpenModal(lead)} className="text-gray-400 hover:text-blue-600 mr-3">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(lead._id)} className="text-gray-400 hover:text-red-600">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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