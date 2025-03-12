import express from 'express';
import {
  getSummaryCards,
  getIndustrypartnercard,
  getNatureOfBusinesses,
  getMoaStatus,
  getTableData,
} from '../controllers/overviewController.js';

const router = express.Router();

// OVERVIEW DATA ROUTES
router.get('/moaSummary', getSummaryCards);
router.get('/mainSummary', getSummaryCards);
router.get('/industryPartnerCard', getIndustrypartnercard); // Fix route name
router.get('/natureOfBusinesses', getNatureOfBusinesses);
router.get('/moaStatus', getMoaStatus);
router.get('/tableData', getTableData);

export default router;

