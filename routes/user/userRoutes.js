import express from 'express';
import StartTest from '../../controllers/user/StartTest.js';
import * as userCvController from '../../controllers/user/userCV.js';
import { userDetails } from '../../controllers/user/userDetails.js';
import { userModal } from '../../models/UserSchema.js';
import { createdTestModel } from '../../models/CreatedTestSchema.js';
import { testModel } from '../../models/testSchema.js';
import CalculateScore from '../../controllers/user/CalculateScore.js';
import { userDetailsFormSchemaWithoutCV, userTestSchema } from '../../utils/YupSchemas.js';
import { FeedBack } from '../../controllers/user/feedbackOfUser.js';
import { createS3PreSignedUrl } from '../../controllers/user/PreSignedUrl.js';
import { getCountry } from '../../controllers/user/userDetails.js';
import SubmitTypingTest from '../../controllers/user/TypingTest.js';
const userRouter = express.Router();
import { excelModal } from '../../models/ExcelSchema.js';
//import { QuestionsandAnswers } from "./UpdatedUSQuestions.js"
// const maxmind = require('maxmind');
// const mmdb_file = '/../public/GeoLite2-Country.mmdb';


// const maxmind = require('geoip2').openSync('../../public/GeoLite2-Country.mmdb');
// const metadata = maxmind.metadata;

userRouter.post("/db", async (req, res) => {
    let records = await excelModal.find().lean();

    /*   records = records.map(async (r, i) => {
           if (r.Images) {
               const obj = QuestionsandAnswers.find(ele => JSON.stringify(ele.Images) === JSON.stringify(r.Images))
               //console.log(r.Images, obj.Images, JSON.stringify(obj.Images) === JSON.stringify(r.Images));
               if (obj?.Images && obj.Images.length > 0) {
                  const QuestionsArr = { us: QuestionsandAnswers[i].Question }
           const OptionsArr = { us: QuestionsandAnswers[i].Options }
           return await excelModal.updateOne({ _id: r._id }, { QuestionsArr, OptionsArr })
                   return { img: obj.Images, img1: r.Images }
               }
               else console.log(obj)
           }
           
       }) 
    let recordsArr = QuestionsandAnswers.map(async (question) => {
        const obj = records.find(ele => JSON.stringify(ele.Images) ===
            JSON.stringify(question.Images))
        if (obj?.Images && obj.Images.length > 0) {
            const QuestionsArr = { us: question.Question }
            const OptionsArr = { us: question.Options }
            console.log(obj.Images)
            return await excelModal.updateOne({ _id: obj._id }, { QuestionsArr, OptionsArr })

            return { img: obj.Images, img1: question.Images, id: obj._id }
        }
         else return await excelModal.updateOne({ _id: obj._id }, { "$unset": { QuestionsArr: 1, OptionsArr: 1 } })
    })*
    let recordsArr = QuestionsandAnswers.map(async (question) => {

        const obj = records.find(ele => ele.Question === question.Question)
        const QuestionsArr = { us: question.Question }
        const OptionsArr = { us: question.Options }

        if (obj)
            //await excelModal.updateOne({ _id: obj._id }, { QuestionsArr, OptionsArr })
            return { img: obj?.Question, img1: question?.Question, id: obj._id }
        else return { question }
    })
    let recordsArr = await excelModal.aggregate([
        { "$match": { "Question": { "$exists": true }, "QuestionsArr": { "$exists": true } } },
        {
            "$project": {
                "Question": 1,
                "QuestionsArr": 1,
                "aCmp": { "$cmp": ["$Question", "$QuestionsArr.us"] }
            }
        },
        { "$match": { "aCmp": 1 } }
    ]);*/
    let recordsArr = await excelModal.find({ "Images.0": { $exists: true } }).lean();
    recordsArr = recordsArr.map(data => ({ _id: data._id, Question: data.Question, images: data.Images[0] }))
    // recordsArr = await Promise.all([...recordsArr]);
    //console.log(recordsArr.length)
    return res.status(200).json(recordsArr)
})
userRouter.post("/userCV", (req, res) => {
    try {
        let data = req.body;
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

        /*   const createdTest1 = await createdTestModel.find({
               "$or": [{
                   "country": user.country,
                   "position": user.position
               }, {
                   "country": "All",
                   "position": user.position
               }]
           })
           return res.status(403).json({
               success: true, createdTest1
           });*/

        //const createdTest = await createdTestModel.findOne({ country: user.country, position: user.position })
        const createdTest = await createdTestModel.findOne({
            "$or": [{
                "country": user.country,
                "position": user.position
            }, {
                "country": "All",
                "position": user.position
            }]
        });
        console.log(createdTest, user)
        if (!createdTest) return res.status(404).json({ success: false, msg: "No Test found for your location/position" });

        const test = await testModel.findOne({ email: email, userID: userID });


        if (!user) return res.status(401).json({ success: false, msg: "User not found!!" });
        else if (test?.isTestCompleted)
            return res.status(403).json({
                success: false, msg: "Test already given!!",
                testCompleted: true
            });

        else if (test?.retest >= 3) {//change once done to 3
            return res.status(403).json({
                success: false,
                msg: 'You have exhausted your retest limit, please contact the admin',
                retestExhausted: true
            })
        }

        else if (test?.isTestStarted) {
            isTestAlreadyAvailable = true;
        };


        const size = 50; //change once done to 50
        StartTest(userID, createdTest?.language, email, res, size, {
            isTestAlreadyAvailable,
            testID: test?._id, testType: createdTest?.test_type
        });
        // StartTest(userID, user.country, email, res, size, {
        //     isTestAlreadyAvailable,
        //     testID: test?._id, testType: createdTest.test_type
        // });
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, msg: "Unexpected error occurred, or user not found" })
    }
});

userRouter.post("/typing-start", async (req, res) => {
    try {
        const { testID, userID } = req.body;
        const userTestDoc = await testModel.find({ _id: testID, userID: userID }).select({ isTestStarted: 1, testType: 1 });
        const { isTestStarted, testType } = userTestDoc[0];

        if (!isTestStarted) {
            userTestDoc[0].isTestStarted = true;
            await userTestDoc[0].save();
        }
        return res.status(200).json({ success: true })
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, msg: "Unexpected error occurred" })
    }
});

userRouter.post("/getQuestionFromId", async (req, res) => {

    try {
        const { testID, userID, isTypingTest } = req.body;

        if (!testID || !userID) return res.status(404).json({ success: false, msg: 'Cannot find the user or his test' });

        const userTestDoc = await testModel.find({ _id: testID, userID: userID }).select({ Questions: 1, retest: 1, isTestStarted: 1, testType: 1 });
        const { Questions, retest, isTestStarted, testType } = userTestDoc[0];

        if (retest >= 3) {
            return res.status(429).json({ success: false, msg: 'You have exhausted your retest limit, please contact the admin', retestExhausted: true })
        }
        if (isTestStarted && testType !== 4) {
            return res.status(406).json({ success: false, msg: 'You already started the test', isTestStarted: isTestStarted })
        }

        else {
            //if (testType !== 4)
            userTestDoc[0].retest += 1;
            userTestDoc[0].isTestStarted = true;
            await userTestDoc[0].save();

            if (isTypingTest) return res.status(200).json({ success: true })

            const questionsWithOptions = Questions.map(q => {
                const { _id, Question, Options, Images, testType } = q;
                return { _id, Question, Options, Images, testType }
            })

            return res.status(200).json({ success: true, data: questionsWithOptions })
        }
    }
    catch (error) {
        console.error(error)
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
            console.log("err", err);
            return res.status(401).json({ success: false, msg: "Validation error occurred, Please re-check you details", error: err.message?.replace(".mimetype", " type") })
        })
})

// get All records of specific country

userRouter.route("/getposition").post(async (req, res) => {
    let country;

    /**
     * Not need this dummy data
     */
    //let positionIndia = ['IT Recrutier', 'Company Secretary', 'Web Developer', 'Assistant'];
    // let positionIndia = ['IT Recrutier', 'Company Secretary', 'Web Developer',];//'Mcq', 'Typing'
    // let positionOtherCountries = ['Virtual Assistant', 'Senior Virtual Assistant', 'IT Recrutier', 'Company Secretary', 'Web Developer', 'Assistant']

    try {

        // const countries = [];
        // for (const locale of metadata.locales) {
        //     for (const country of metadata.countryDatabase.countries) {
        //         countries.push(country.names[locale]);
        //     }
        // }

        // console.log(countries);
        var ip = req.headers["x-forwarded-for"];
        if (ip) {
            var list = ip.split(",");
            ip = list[list.length - 1];
        } else {
            ip = req.ip;
        }        // const ip = req.ip

        // // // REMOVE
        // ip = "37.47.123.211";

        country = await getCountry(ip);
        //let createdTest = await createdTestModel.find({ country }).select({ position: 1 })'

        let createdTest = await createdTestModel.find({});
        if(ip) {
          createdTest = await createdTestModel.find({ country }) 
        }
        console.log(createdTest)
        console.log("country ==", country, ip);
        return res.json({ data: createdTest, success: true });
        // if (country.toLowerCase() === 'india') {
        // } else {
        //     return res.json({ data: createdTest, success: true })
        // }
    }
    catch (error) {
        console.log("error", error.toString());
        return res.status(400).json({ data: [], success: false, msg: 'Failed to find your country' })
    }
});

userRouter.route('/getposition').post(userCvController.getPositionByIPAddress)

userRouter.route("/getTestType").post(async (req, res) => {
    const { userID } = req.body;
    try {
        const user = await userModal.findOne({ _id: userID });
        let createdTest = await createdTestModel.
            //findOne({ country: user.country, position: user.position })
            findOne({
                "$or": [{
                    country: user.country, position: user.position
                }, {
                    "country": "All", position: user.position
                }]
            })
            .select({ test_type: 1 })
        console.log(createdTest)
        if (createdTest) {
            return res.json({ data: createdTest.test_type, success: true });
        }
        else res.status(400).json({ success: false, msg: 'No test type exits' })
    } catch (error) {
        console.log(error)
    }
});
userRouter.post("/submitTypingTest", (req, res) => {
    const { userID, wpm, accuracy, testID } = req.body;

    if (!userID || !wpm) return res.status(400).json({ error: "Invalid user details", success: false })

    SubmitTypingTest(userID, testID, wpm, accuracy, res);
})


export default userRouter;