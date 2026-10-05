const mongoose = require('mongoose');


/**
 * -Resume text : String
 * -Self Description : String
 * -Job Description : String
 * 
 * -matchScore : Number
 * 
 * 
 * -Technical Questions : [{
 *          question : String,
 *          intention : String -> Stroes the intention of the question by interviewer
 *          answer : String
 *      }]
 * 
 * -Behavioral Questions : [{
 *      question : String,
 *          intention : String -> Stroes the intention of the question by interviewer
 *          answer : String
 * }]
 * 
 * -Skill Gap : [{ 
 *      skills : String,
 *      severity : {
 *          type : String,
 *          enum = ['low' , 'medium' , 'High']
 *       }
 *  }]
 * 
 * -Preparation Plan : [ {
 *      day : Number,
 *      Topic : String,
 *       tasks : [String],
 * } ]
 */

const technicalQuestionSchema = new mongoose.Schema({
    question :{
        type : String,
        required : true,
    },
    intention : {
        type : String,
        required : true
    },
    answer : {
        type : String,
        required : true
    }
},{
    _id : false
})

const behavioralQuestionSchema = new mongoose.Schema({
    question :{
        type : String,
        required : true,
    },
    intention : {
        type : String,
        required : true
    },
    answer : {
        type : String,
        required : true
    }
},{
    _id : false
})

const preparationPlanSchema = new mongoose.Schema({
    day :{
        type : String,
        required : true,
    },
    focus : {
        type : String,
        required : true
    },
    tasks: [{
    type: String,
    required: true
}]
},{
    _id : false
})

const SkillGapSchema = new mongoose.Schema({
    skill :{
        type : String,
        required : true,
    },
    severity : {
    type : String,
    enum : ['low' , 'medium' , 'high'],
    required : true
    },
},{
    _id : false
})

const intervieweReportSchema = new mongoose.Schema({

    resume : {
        type : String,
    },

    jobDescription : {
        type : String,
        required : true
    },

    selfDescripton : {
        type : String
    },

    matchScore : {
        type : Number,
        max : 100,
        min : 0,
    },
    technicalQuestions : [technicalQuestionSchema],
    behavioralQuestions : [behavioralQuestionSchema],
    SkillGaps : [ SkillGapSchema ],
    preparationPlan : [preparationPlanSchema],
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "users"
    }
}, {
    timestamps : true,
})


const intervieweReportModel = new mongoose.model('interviewReport' , intervieweReportSchema);

module.exports = intervieweReportModel;