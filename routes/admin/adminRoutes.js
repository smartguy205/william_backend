import express from 'express';
import login from '../../controllers/admin/login.js';
import uploadExcelToDB from '../../controllers/admin/uploadExcelToDB.js';
import { testModel } from '../../models/testSchema.js';
import { userModal } from '../../models/UserSchema.js';
import { feedbackModal } from '../../models/FeedbackSchema.js';
import { addJobs, getJobs, deleteJob, getJobsForAUser } from '../../controllers/admin/jobs.js';
import { test1 } from '../../utils/json/test1.js';
import { getCountry } from '../../controllers/user/userDetails.js';
import { getPosition, addPosition, deletePosition } from '../../controllers/admin/position.js';
const adminRouter = express.Router();
// import { addCountry, getCountries, deleteCountry } from '../../controllers/admin/country.js';


/**Jobs */
adminRouter.post("/jobs", async (req, res) => {
    const { data } = req.body;
    // const response = data.map(async d => await addJobs(d, res))
    const response = data.map(async d => await addJobs(d))
    const promises = await Promise.all(response)
    res.status(200).json({ success: true, msg: promises })

});
adminRouter.get("/jobs", (req, res) => {
    getJobs(res);
});

adminRouter.delete("/job/:id", (req, res) => {
    const { id } = req.params;
    deleteJob(id, res)
});

adminRouter.get("/jobs/:position", async (req, res) => {
    const { position } = req.params;
    // const ip = req.ip
    try {
        var ip = req.headers["x-forwarded-for"];

        if (ip) {
            var list = ip.split(",");
            ip = list[list.length - 1];

        } else {
            ip = req.ip;
        }
        let country = await getCountry(ip);
        getJobsForAUser({ country, position }, res)
    } catch (e) { console.error("err", e.toString()) }
});
///////////////////////////////////////////////
/**Positon */
adminRouter.post("/position", (req, res) => {
    const { position, position_code } = req.body;
    addPosition({ position, position_code }, res);
});

adminRouter.get("/position", (req, res) => {
    getPosition(res);
});

adminRouter.delete("/position/:id", (req, res) => {
    const { id } = req.params;
    deletePosition(id, res)
});
///////////////////////////////////////////////

adminRouter.post("/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(401).json({ success: false, msg: "Invalid email and password" });
    }

    login(email, password, res);
});

adminRouter.post("/excelUpload", (req, res) => {
    const file = req.files?.file;
    const filePath = "public/excels";
    const fileName = file?.name;
    const fullPath = `${filePath}/${fileName}`

    if (!file && fileName) {
        return res.status(404).json({ success: false, msg: "File not found" })
    }

    uploadExcelToDB(res, test1);
});

// get score details on table 
adminRouter.post("/getTestDetails", async (req, res) => {
    try {
        const user = await userModal.find().lean().select({ __v: 0 });
        const test = await testModel.find({ isTestCompleted: true }).lean().select({ Questions: 0, email: 0, __v: 0 }).sort({ "updatedAt": -1 })

        if (!user || !test) return res.status(404).json({ success: false, msg: "Cannot find user and his test details" });

        let UserTests = test.map(testDetails => {

            const userDetails = user.find(u => testDetails.userID === u._id.toString());
            return userDetails !== undefined ? { ...userDetails, ...testDetails, wpm: testDetails?.typingTest?.wpm, taccuracy: testDetails?.typingTest?.typingAccuracy } : null
        }).filter(details => details);


        if (!UserTests.length > 0) return res.status(404).json({ success: false, msg: "Failed to find any test details" });

        return res.json({ success: true, user: UserTests })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, msg: "Internal server error occurred" })
    }
});



// get full detials about user on name click
adminRouter.post("/getUserPaper", async (req, res) => {
    try {
        const { id } = req.body;

        const test = await testModel.findOne({ userID: id }, { _id: 0, userID: 0, __v: 0, Questions: 0, email: 0, retest: 0, isTestCompleted: 0, isTestStarted: 0, createdAt: 0 });
        const user = await userModal.findOne({ _id: id }, { _id: 0, __v: 0, });
        const userFeedback = await feedbackModal.findOne({ userID: id }, { text: 1 });

        if (!test || !user) return res.status(404).json({ success: false, msg: "Failed to find the user or his test" });

        const { fullName, email, phone, country, language, position, experience, file, ip } = user;
        const { score, testType, questionsAttempted, correctAnswers, averageTime, accuracy, updatedAt: date } = test;

        let feedback = "";
        if (userFeedback?.text) {
            feedback = userFeedback.text;
        }

        const User = {
            fullName, email, phone, country, language, position, experience, file,
            score, testType, wpm: test?.typingTest?.wpm, taccuracy: test?.typingTest?.typingAccuracy, questionsAttempted, correctAnswers, averageTime, accuracy, date,
            feedback, ip
        };

        return res.status(200).json({ success: true, UserPaper: test.userQuestionsAndAnswers, user: User })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, msg: "Internal server error occurred" })
    }
})

export default adminRouter;