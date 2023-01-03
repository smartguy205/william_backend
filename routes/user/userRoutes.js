import express from 'express';
import StartTest from '../../controllers/user/StartTest.js';
import { userCV } from '../../controllers/user/userCV.js';
import { userDetails } from '../../controllers/user/userDetails.js';
import { userModal } from '../../models/UserSchema.js';
import { testModel } from '../../models/testSchema.js';
import CalculateScore from '../../controllers/user/CalculateScore.js';
import { userDetailsFormSchemaWithoutCV, userTestSchema } from '../../utils/YupSchemas.js';
import { FeedBack } from '../../controllers/user/feedbackOfUser.js';
import { createS3PreSignedUrl } from '../../controllers/user/PreSignedUrl.js';
import { getCountry } from '../../controllers/user/userDetails.js';
import SubmitTypingTest from '../../controllers/user/TypingTest.js';
const userRouter = express.Router();

userRouter.post("/userCV", (req, res) => {
    try {
        let data = req.body.data;
        if (data) {
            userDetails(data, req, res)
        }
        else {
            return res.status(400).json({ success: false, msg: "Invalid user details" })
        }
    }
    catch (error) {
        return res.status(400).json({ success: false, msg: "Unexpected error occurred!" })
    }
});

userRouter.post("/StartTest", async (req, res) => {
    try {
        const { email, userID } = req.body;
        let isTestAlreadyAvailable = false;

        const user = await userModal.findOne({ email: email, _id: userID });
        const test = await testModel.findOne({ email: email, userID: userID });

        if (!user) return res.status(401).json({ success: false, msg: "User not found!!" });

        else if (test?.isTestCompleted) return res.status(403).json({ success: false, msg: "Test already given!!", testCompleted: true });

        else if (test?.retest >= 3) {
            return res.status(403).json({ success: false, msg: 'You have exhausted your retest limit, please contact the admin', retestExhausted: true })
        }

        else if (test?.isTestStarted) {
            isTestAlreadyAvailable = true;
        };

        const size = 50;
        StartTest(userID, email, res, size, { isTestAlreadyAvailable, testID: test?._id });
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, msg: "Unexpected error occurred, or user not found" })
    }
});


userRouter.post("/getQuestionFromId", async (req, res) => {
    try {
        const { testID, userID } = req.body;
        if (!testID || !userID) return res.status(404).json({ success: false, msg: 'Cannot find the user or his test' });

        const userTestDoc = await testModel.find({ _id: testID, userID: userID }).select({ Questions: 1, retest: 1, isTestStarted: 1 });
        const { Questions, retest, isTestStarted } = userTestDoc[0];

        if (retest >= 3) {

            return res.status(429).json({ success: false, msg: 'You have exhausted your retest limit, please contact the admin', retestExhausted: true })
        }

        if (isTestStarted) {
            return res.status(406).json({ success: false, msg: 'You already started the test', isTestStarted: isTestStarted })
        }

        else {
            const questionsWithOptions = Questions.map(q => {
                const { _id, Question, Options, Images } = q;
                return { _id, Question, Options, Images }
            })

            userTestDoc[0].retest += 1;
            userTestDoc[0].isTestStarted = true;
            await userTestDoc[0].save();
            return res.status(200).json({ success: true, data: questionsWithOptions })
        }
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, msg: "Unexpected error occurred" })
    }
});


userRouter.post("/submitTest", (req, res) => {
    try {
        let { userID, questions } = req.body.data;
        questions = questions.filter(question => question.answer !== 0)

        if (!userID) return res.status(404).json({ success: false, msg: "Test not found" });
        else if (!questions || !questions.length > 0) return res.status(404).json({ success: false, error: "No question was answered" });

        userTestSchema.validate({ questions })
            .then(response => {
                const { questions: userQuestions } = response;
                CalculateScore(userID, userQuestions, res);
            })
            .catch(err => {
                return res.status(404).json({ success: false, msg: "Validation error occurred", error: err.message })
            })
    }
    catch (error) {
        return res.status(500).json({ success: false, msg: "Unexpected error occurred" })
    }
})

// delete api 
// userRouter.delete("/delete/:id", (req, res) => {
//     userModal.deleteOne({ _id: req.params.id })
//         .then((result) => {
//             return res.status(200).json({
//                 message: "DELETED SUCCESSFULLY!!!",
//             });
//         })
//         .catch((err) => {
//             console.log(err);
//             res.status(404).json({
//                 message: "Record Not found!!!",
//             });
//         });
// });



// feedback..
userRouter.post('/createfeedback', FeedBack.createfeedback);
userRouter.get('/getfeedback', FeedBack.getAll);

// preSignedUrl 
userRouter.post('/url', (req, res) => {
    const { fileName, data } = req.body;

    userDetailsFormSchemaWithoutCV.validate(data)
        .then(resp => {
            createS3PreSignedUrl.createUrl(fileName, res)
        })
        .catch(err => {
            return res.status(401).json({ success: false, msg: "Validation error occurred, Please re-check you details", error: err.message?.replace(".mimetype", " type") })
        })
})

// get All records of specific country

userRouter.route("/getposition").post(async (req, res) => {
    let country;
    let positionIndia = ['Company Secretary', 'Chartered Accountant', 'Administrative Assistant', 'Lawyer', 'HR Manager', 'Full Stack Developer', 'Head of Security'];
    let positionOtherCountries = ['Virtual Assistant', 'Senior Virtual Assistant']

    try {
        const ip = req.ip
        country = await getCountry(ip);

        if (country.toLowerCase() === 'india') {
            return res.json({ data: positionIndia, success: true });
        } else {
            return res.json({ data: positionOtherCountries, success: true })
        }
    }
    catch (error) {
        return res.status(400).json({ data: positionOtherCountries, success: false, msg: 'Failed to find your country', ip: req.ip })
    }
});


// userRouter.post("/submitTypingTest", (req, res) => {
//     const { userID, score } = req.body;
//     if (!userID || !score) return res.status(400).json({ error: "Invalid user details", success: false })

//     SubmitTypingTest(userID, score, res);
// })


export default userRouter;