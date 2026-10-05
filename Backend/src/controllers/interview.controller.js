const {PDFParse} = require('pdf-parse')
const generateInterviewReport = require('../services/ai.service')
const intervieweReportModel = require('../models/interviewReport.model')
const UserModel = require('../models/user.models');

module.exports.generateReportController = async (req,res) => {
    try {
        const resumeFile = req.file;

        const extractContent =  async (buffer) =>{
            const parse = new PDFParse({
                data : buffer,
            })
            try{
                const content = await parse.getText();
                return content.text
            }finally{
                await parse.destroy();
            }
        }

        const resumeContent = await extractContent(req.file.buffer);

        const {selfDescription , jobDescription } = req.body;

        const existingReport = await intervieweReportModel.findOne({
            user: req.user._id
        });

        if (existingReport) {
            return res.status(200).json({
                interviewReport: existingReport,
                existing: true
            });
        }

        const interviewReportbyAI = await generateInterviewReport({
            resume : resumeContent, 
            selfDescription, 
            jobDescription
        })
        const interviewReport = await intervieweReportModel.create({
            user : req.user._id,
            resume : resumeContent,
            selfDescription,
            jobDescription,
            matchScore : interviewReportbyAI.matchScore,
            technicalQuestions : interviewReportbyAI.technical_questions,
            behavioralQuestions : interviewReportbyAI.behavioral_questions,
            SkillGaps : interviewReportbyAI.skill_gap_analysis,
            preparationPlan : interviewReportbyAI.preparation_plan
        })
        console.log("Backend -> Report Generated");
        console.log(interviewReport);
        return res.status(201).json({
            interviewReport
        });
    }catch(err){
        console.error("Report generation error:", err);

        return res.status(500).json({
            message: "Failed to generate interview report"
        });
    }

}
module.exports.userReportController = async (req,res) => {
    const id = req.user._id;
    const report = await intervieweReportModel.findOne({user : id});
    return res.status(200).json({
        report
    })
}
