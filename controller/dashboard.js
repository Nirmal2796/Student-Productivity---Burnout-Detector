const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const DailyStatus = require('../models/dailyStatus');


exports.getDashboardSummary = async (req, res) => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const status = await DailyStatus.find({
            userId: req.user._id,
            date: { $lte: sevenDaysAgo }
        }).sort({ date: 1 });

        // console.log(status);

        if (!status || status.length === 0) {
            return res.json({
                status: "No Data",
                reason: "Not enough data to analyze yet.",
                suggestion: "Log your daily study, sleep, and mood for a few days."
            });
        }


        let prompt = `
                    You are an academic productivity and mental well-being analyst.

                    Below is the student's recent productivity and wellness data.
                    The dataset may contain fewer than 7 days.

                    Analyze overall patterns and trends across the available days.
                    Do not base conclusions on a single isolated bad day.
                    Look for repeated low sleep, consistently low energy, declining mood, or frequent overstudying while fatigued.

                    If the data is limited, make a cautious and balanced judgment.

                    `;

        status.forEach((s, index) => {
            prompt += `
                        Day ${index + 1}:
                        Study Hours: ${s.studyHours}
                        Sleep Hours: ${s.sleepHours}
                        Energy: ${s.energy}
                        Mood: ${s.mood}
                        Score: ${s.score}
                        `;
        });

        prompt += `

                    Instructions:
                    1. Determine the overall status (Healthy, At Risk, or Burnout) based on trends across the available days.
                    2. Provide a short reason (maximum 20 words).
                    3. Provide exactly 2 concise and practical suggestions (maximum 12 words each) and Suggestion must be a single short paragraph.
                        Do NOT use arrays..
                    4. Keep the response brief and direct.

                    Respond ONLY in the following JSON format:
                    {
                    "status": "",
                    "reason": "",
                    "suggestion": ""
                    } Return ONLY valid raw JSON.
                    Do not include markdown.
                    Do not include backticks.
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