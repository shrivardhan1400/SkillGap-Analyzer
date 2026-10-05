const {GoogleGenAI} = require('@google/genai');
const {z} = require('zod');
const {zodToJsonSchema} = require('zod-to-json-schema');

const {resume , selfDescription , jobDescription} = require('../services/text')

const ai = new GoogleGenAI({
    apiKey : process.env.GOOGLE_GENAI_APIKEY

})

const interviewReportSchema = z.object({
  matchScore: z.number().min(0).max(100),

  technical_questions: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string(),
    })
  ),

  behavioral_questions: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string(),
    })
  ),

  skill_gap_analysis: z.array(
    z.object({
      skill: z.string(),
      severity: z.enum(["low", "medium", "high"]),
    })
  ),

  preparation_plan: z.array(
    z.object({
      day: z.number(),
      focus: z.string(),
      tasks: z.array(z.string()),
    })
  ),
});

async function generateInterviewReport ({
    resume, jobDescription, selfDescription

}){
    const prompt = `
You are an expert Technical Interview Coach and Career Mentor.

Analyze the candidate's Resume, Job Description, and Self Description.

Resume:
${resume}

Job Description:
${jobDescription}

Self Description:
${selfDescription}

Generate a complete interview preparation report.

Return ONLY valid JSON.

Do not include markdown.
Do not include explanations.
Do not include extra text.
Do not include code fences.

The JSON MUST exactly match the provided response schema.

Requirements:

1. matchScore
- Integer between 0 and 100.

2. technical_questions
Generate 5 technical interview questions.

Each question must contain:

- question
- intention
- answer

Answers should be interview-ready, simple, and technically correct.

3. behavioral_questions

Generate 5 behavioral interview questions.

Each object must contain:

- question
- intention
- answer

Answers should use the STAR method whenever appropriate.

4. skill_gap_analysis

Compare the resume with the job description.

Return only genuine missing skills.

Severity:

- high
- medium
- low

5. preparation_plan

Generate a day-wise roadmap.

Every day must contain:

- day
- focus
- tasks

Each day should contain 3-5 practical task.

The roadmap should directly address the identified skill gaps.

CRITICAL RULES

Return ONLY JSON.

Every array must contain OBJECTS.

Never return primitive strings.

Never flatten objects.

Every object must contain all required fields.

Do not invent additional fields.

The JSON must be directly parsable using JSON.parse().
`;
    
//    const jsonSchema = zodToJsonSchema(interviewReportSchema);
    const response = await ai.models.generateContent({
        model : process.env.GEMINI_MODEL,
        contents : prompt,
        config : {
            responseMimeType : "application/json",
        }
    })
    const report = JSON.parse(response.text);

    return report;
}



module.exports = generateInterviewReport;