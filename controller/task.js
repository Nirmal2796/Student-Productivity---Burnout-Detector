const Task=require('../models/task');

exports.addTask = async (req, res) => {
    try {

        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        // console.log(req.body);

        // const taskName=req.body.task;

        const task=await Task.create({
            date:today,
            taskName:req.body.task,
            completed:false,
            userId:req.user
        });        

        res.status(200).json({task:task});


    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
}

exports.getTask = async (req, res) => {
    try {

        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        const tasks=await Task.find({date:today});

       
        res.status(200).json({tasks:tasks });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
}

exports.deleteTask = async (req, res) => {
    try {

        const id=req.params.id;

        await Task.deleteOne({_id:id});//delete the document and returns operation info not the deleted document
       
        res.status(200).json({message:'Deleted successfully'});

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
}

exports.updateStatus=async(req,res)=>{
    try {
        const { updatedStatus } = req.body;

        // console.log(updatedStatus);

    await Task.findByIdAndUpdate(req.params.id, { completed:updatedStatus });

    res.status(200).json({ message: "Task updated" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
}