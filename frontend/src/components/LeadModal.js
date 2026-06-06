import { useState, useEffect } from 'react';

export default function LeadModal({ isOpen, onClose, onSubmit, initialData }) {
    const [formData, setFormData] = useState({
        name: '', email: '', phoneNumber: '', companyName: '', status: 'New', notes: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({ name: '', email: '', phoneNumber: '', companyName: '', status: 'New', notes: '' });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md text-black">
                <h2 className="text-xl font-bold mb-4 text-gray-800">{initialData ? 'Edit Lead' : 'Add New Lead'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Name" required className="w-full border border-gray-300 p-2 rounded text-gray-800 placeholder-gray-400 bg-white" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />

                    <input type="email" placeholder="Email" required className="w-full border border-gray-300 p-2 rounded text-gray-800 placeholder-gray-400 bg-white" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />

                    <input type="text" placeholder="Phone Number" required className="w-full border border-gray-300 p-2 rounded text-gray-800 placeholder-gray-400 bg-white" value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} />

                    <input type="text" placeholder="Company Name" required className="w-full border border-gray-300 p-2 rounded text-gray-800 placeholder-gray-400 bg-white" value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} />

                    <select className="w-full border border-gray-300 p-2 rounded text-gray-800 bg-white" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Qualified">Qualified</option>
                        <option value="Converted">Converted</option>
                        <option value="Lost">Lost</option>
                    </select>

                    <textarea placeholder="Notes" className="w-full border border-gray-300 p-2 rounded text-gray-800 placeholder-gray-400 bg-white" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })}></textarea>

                    <div className="flex justify-end gap-2 mt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">{initialData ? 'Update' : 'Save'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}