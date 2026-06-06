import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/leads';

export const leadService = {
    // Get all leads
    getAllLeads: async (params = {}) => {
        const { page = 1, limit = 10, status = '', order = 'desc', search = '' } = params;
        let queryString = `?page=${page}&limit=${limit}&sortBy=createdAt&order=${order}`;

        if (status) queryString += `&status=${status}`;
        if (search) queryString += `&search=${search}`;

        const response = await axios.get(`${API_URL}${queryString}`);
        return response.data;
    },

    // Search leads
    searchLeads: async (query) => {
        const response = await axios.get(`${API_URL}/search?query=${query}`);
        return response.data;
    },

    // Create a new lead
    createLead: async (leadData) => {
        const response = await axios.post(API_URL, leadData);
        return response.data;
    },

    // Update lead status or details
    updateLead: async (id, leadData) => {
        const response = await axios.put(`${API_URL}/${id}`, leadData);
        return response.data;
    },

    // Delete a lead
    deleteLead: async (id) => {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    }
};