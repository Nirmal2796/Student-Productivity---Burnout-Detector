const express=require('express');

const router=express.Router();

const dashboardSummaryController=require('../controller/dashboard');

const userAuthentication=require('../middleware/userAuthentication');


router.get('/getDashboardSummary',userAuthentication.authentication,dashboardSummaryController.getDashboardSummary);

module.exports=router;