const mongoose=require('mongoose');

const Schema=mongoose.Schema;

// Creating schema (structure/fields of documents in collection)
const taskSchema=new Schema({ 
    date:{
        type:Date,
        required:true
    },
    taskName:{
        type:String,
        required:true
    },
    completed:{
        type:Boolean,
        required:true
    },
    userId: {
        type: Schema.Types.ObjectId, // Stores a MongoDB ObjectId
        ref: 'User',  // References the User model (for relationships)
        required: true
    }
    
});


module.exports=mongoose.model('Task',taskSchema); //Create model 

