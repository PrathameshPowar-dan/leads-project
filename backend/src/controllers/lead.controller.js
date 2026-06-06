import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Lead } from "../models/leads.models.js";

// Create a new lead
export const createLead = asyncHandler(async (req, res) => {
    const { name, email, phoneNumber, companyName, status, notes } = req.body;

    if (!name || !email || !phoneNumber || !companyName) {
        throw new ApiError(400, "Name, email, phone number, and company name are required");
    }

    const existingLead = await Lead.findOne({ email });
    if (existingLead) {
        throw new ApiError(409, "A lead with this email already exists");
    }

    const lead = await Lead.create({
        name, email, phoneNumber, companyName, status, notes
    });

    return res.status(201).json(new ApiResponse(201, lead, "Lead created successfully"));
});

// Get all leads with pagination and sorting
export const getAllLeads = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;

    const leads = await Lead.find()
        .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
        .limit(Number(limit))
        .skip((Number(page) - 1) * Number(limit));

    const total = await Lead.countDocuments();

    return res.status(200).json(new ApiResponse(200, {
        leads,
        totalPages: Math.ceil(total / Number(limit)),
        currentPage: Number(page),
        totalLeads: total
    }, "Leads fetched successfully"));
});

// Get a single lead by ID
export const getLeadById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const lead = await Lead.findById(id);

    if (!lead) {
        throw new ApiError(404, "Lead not found");
    }

    return res.status(200).json(new ApiResponse(200, lead, "Lead fetched successfully"));
});

// Search leads by name, email, or company name
export const searchLeads = asyncHandler(async (req, res) => {
    const { query } = req.query;

    if (!query) {
        throw new ApiError(400, "Search query is required");
    }

    const leads = await Lead.find({
        $or: [
            { name: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } },
            { companyName: { $regex: query, $options: 'i' } }
        ]
    });

    return res.status(200).json(new ApiResponse(200, leads, "Search results fetched successfully"));
});

// Update a lead by ID
export const updateLead = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    const lead = await Lead.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

    if (!lead) {
        throw new ApiError(404, "Lead not found");
    }

    return res.status(200).json(new ApiResponse(200, lead, "Lead updated successfully"));
});

// Delete a lead by ID
export const deleteLead = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const lead = await Lead.findByIdAndDelete(id);

    if (!lead) {
        throw new ApiError(404, "Lead not found");
    }

    return res.status(200).json(new ApiResponse(200, null, "Lead deleted successfully"));
});