const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const DailyStatus = require('../models/dailyStatus');


exports.getDashboardSummary = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(23, 59, 59, 999);

        const sixDaysAgo = new Date();
        sixDaysAgo.setDate(today.getDate() - 6);
        sixDaysAgo.setHours(0, 0, 0, 0);

        const records = await DailyStatus.find({
            userId: req.user._id,
            date: { $gte: sixDaysAgo, $lte: today }
        });

        let weekData = [];

        for (let i = 0; i < 7; i++) {

            const day = new Date(sixDaysAgo);
            day.setDate(sixDaysAgo.getDate() + i);

            const record = records.find(r =>
                r.date.toDateString() === day.toDateString()
            );

            weekData.push({
                studyHours: record ? record.studyHours : 0,
                sleepHours: record ? record.sleepHours : 0,
                energy: record ? record.energy : 0,
                mood: record ? record.mood : 0,
                score: record ? record.score : 0,
                logged: record ? true : false
            });
        }




        let prompt = `
                        You are an academic productivity and well-being analyst.

                        You will receive the student's last 7 calendar days of data.

                        Important rules:
                        - Some days may have no entry.
                        - If "logged" is false or values are 0, it means the student did NOT log data that day.
                        - Do NOT assume the student actually slept or studied 0 hours.
                        - Analyze only the available logged days.

                        Focus on patterns such as:
                        - repeated low sleep
                        - declining mood or energy
                        - studying heavily while fatigued

                        Avoid judging based on a single bad day.
                        If there is very little data, make a cautious judgment.

                        `;

        weekData.forEach((d, index) => {
            prompt += `
                        Day ${index + 1}:
                        Logged: ${d.logged}
                        Study Hours: ${d.studyHours}
                        Sleep Hours: ${d.sleepHours}
                        Energy: ${d.energy}
                        Mood: ${d.mood}
                        Score: ${d.score}
                        `;
        });

        prompt += `

                    Instructions:
                    1. Determine overall status: Healthy, At Risk, or Burnout.
                    2. Reason: one short sentence (max 20 words).
                    3. Suggestion: one short paragraph (max 20 words).

                    Return ONLY valid JSON:

                    {
                    "status": "",
                    "reason": "",
                    "suggestion": ""
                    }

                    No markdown.
                    No backticks.
                    `;


        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        const text = JSON.parse(response.text);
        // console.log(text);   

        res.status(200).json({ status: text.status, reason: text.reason, suggestion: text.suggestion });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
}