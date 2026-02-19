const express=require('express');

const router=express.Router();

const taskController=require('../controller/task');

const userAuthentication=require('../middleware/userAuthentication');



router.post('/addTask',userAuthentication.authentication,taskController.addTask);

router.get('/getTask',userAuthentication.authentication,taskController.getTask);

router.delete('/deleteTask/:id',userAuthentication.authentication,taskController.deleteTask);

router.put('/updateTask/:id',userAuthentication.authentication,taskController.updateStatus);

router.get('/getTaskSummary',userAuthentication.authentication,taskController.getTaskSummary);

module.exports=router;