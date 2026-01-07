const mongoose=require('mongoose');

const Schema=mongoose.Schema;

// Creating schema (structure/fields of documents in collection)
const dailyStatusSchema=new Schema({ 
    date:{
        type:Date,
        required:true
    },
    studyHours:{
        type:Number,
        required:true
    },
    sleepHours:{
        type:Number,
        required:true
    },
    energy:{
        type:Number,
        required:true
    },
    mood:{
        type:Number,
        required:true
    },
    userId: {
        type: Schema.Types.ObjectId, // Stores a MongoDB ObjectId
        ref: 'User',  // References the User model (for relationships)
        required: true
    }
    
});


module.exports=mongoose.model('DailyStatus',dailyStatusSchema); //Create model 

