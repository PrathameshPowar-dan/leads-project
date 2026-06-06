import { Router } from "express";
import {
    createLead,
    getAllLeads,
    searchLeads,
    updateLead,
    deleteLead
} from "../controllers/lead.controller.js";

const router = Router();

router.route("/").post(createLead).get(getAllLeads);
router.route("/search").get(searchLeads);
router.route("/:id").put(updateLead).delete(deleteLead);

export default router;