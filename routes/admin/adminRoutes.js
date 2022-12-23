import express from 'express';
import login from '../../controllers/admin/login.js';
import uploadExcelToDB from '../../controllers/admin/uploadExcelToDB.js';
import { testModel } from '../../models/testSchema.js';
import { userModal } from '../../models/UserSchema.js';
import { feedbackModal } from '../../models/FeedbackSchema.js';
const adminRouter = express.Router();


import { test1 } from '../../utils/json/test1.js';


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



adminRouter.post("/getTestDetails", async (req, res) => {
    try {
        const user = await userModal.find().lean().select({ __v: 0 });
        const test = await testModel.find({ isTestCompleted: true }).lean().select({ Questions: 0, email: 0, __v: 0 }).sort({ "updatedAt": -1 })

        if (!user || !test) return res.status(404).json({ success: false, msg: "Cannot find user and his test details" });

        // let userDataArr = user.map(userDetails => {
        //     const testDetails = test.find(t => t.userID === userDetails._id.toString());
        //     return testDetails !== undefined ? { ...userDetails, ...testDetails } : null
        // }).filter(details => details);

        let UserTests = test.map(testDetails => {
            const userDetails = user.find(u => testDetails.userID === u._id.toString());
            return userDetails !== undefined ? { ...userDetails, ...testDetails } : null
        }).filter(details => details);


        if (!UserTests.length > 0) return res.status(404).json({ success: false, msg: "Failed to find any test details" });

        return res.json({ success: true, user: UserTests })
    }
    catch (error) {
        return res.status(500).json({ success: false, msg: "Internal server error occurred" })
    }
});



adminRouter.post("/getUserPaper", async (req, res) => {
    try {
        const { id, name } = req.body;

        const test = await testModel.findOne({ userID: id }, { _id: 0, userID: 0, __v: 0, Questions: 0, email: 0, retest: 0, isTestCompleted: 0, isTestStarted: 0, createdAt: 0 });
        const user = await userModal.findOne({ _id: id }, { _id: 0, __v: 0, });
        const userFeedback = await feedbackModal.findOne({ userID: id }, { text: 1 });

        if (!test || !user) return res.status(404).json({ success: false, msg: "Failed to find the user or his test" });

        const { fullName, email, phone, country, language, position, experience, file, ip } = user;
        const { score, questionsAttempted, correctAnswers, averageTime, accuracy, updatedAt: date } = test;

        let feedback = "";
        if (userFeedback?.text) {
            feedback = userFeedback.text;
        }

        const User = {
            fullName, email, phone, country, language, position, experience, file,
            score, questionsAttempted, correctAnswers, averageTime, accuracy, date,
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