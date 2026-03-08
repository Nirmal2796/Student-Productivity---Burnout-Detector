const DailyStatus = require('../models/dailyStatus');

exports.addDailyStatus = async (req, res) => {
    try {

        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        if (await DailyStatus.findOne({ date: today, userId: req.user })) {
            // Using return ensures function stops here and we don't send multiple responses
            return res.status(400).json({ error: 'Status for this date already exists' });
        }

        const { studyHours, sleepHours, energy, mood } = req.body;

        let score = 0;
        let status = 'Healthy';
        let reasons = [];

        if (studyHours > 8 && (sleepHours < 6 || energy <= 2)) {
            score += 1;
            reasons.push('Over Studying while fatigued');
        }

        if (sleepHours < 6) {
            score += 2;
            reasons.push('Low sleep');
        }

        if (energy <= 2) {
            score += 2;
            reasons.push('Low energy');
        }

        if (mood <= 2) {
            score += 1;
            reasons.push('Low mood');
        }



        // taskCompletion is optional
        // if (taskCompletion !== null && taskCompletion < 50) {
        //     score += 1;
        //     reasons.push('Poor task completion');
        // }

        if (score >= 4) {
            status = 'Burnout';
        } else if (score >= 2) {
            status = 'At Risk';
        } else {
            status = 'Healthy';
        }


        // save daily log.
        const dailyStatus = await DailyStatus.create({
            date: today,
            studyHours: studyHours,
            sleepHours: sleepHours,
            energy: energy,
            mood: mood,
            score: score,
            status: status,
            userId: req.user
        });

        res.status(200).json({ dailyStatus: dailyStatus });


    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
}

exports.getDailyStatus = async (req, res) => {
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
                date: day,
                studyHours: record ? record.studyHours : 0,
                sleepHours: record ? record.sleepHours : 0,
                mood: record ? record.mood : 0,
                energy: record ? record.energy : 0,
                status: record ? record.status : "No Entry"
            });
        }

        // const status = await DailyStatus.find({ userId: req.user }).sort({ date: -1 }).limit(7);

        // status.reverse();

        res.status(200).json({ status: weekData });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error });
    }
}