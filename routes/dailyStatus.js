const express=require('express');

const router=express.Router();

const dailyStatusController=require('../controller/dailyStatus');

const userAuthentication=require('../middleware/userAuthentication');



router.post('/addDailyStatus',userAuthentication.authentication,dailyStatusController.addDailyStatus);

router.get('/getDailyStatus',userAuthentication.authentication,dailyStatusController.getDailyStatus);

module.exports=router;