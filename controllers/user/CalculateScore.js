import { testModel } from "../../models/testSchema.js";
import { userModal } from "../../models/UserSchema.js";
import { typingTest } from '../../models/TypingTest.js';
import axios from 'axios';

const CalculateScore = async (userID, userQuestions, res) => {
    try {
        const userData = await userModal.findOne({ _id: userID }, 'fullName email file country');

        const test = await testModel.findOne({ userID })//, 'Questions _id');
        if (!test) return res.json({ success: false, msg: "Failed to find the test" });

        // logic to calculate the score of the user
        const QuestionPaper = test.Questions;
        let score = 0;
        let averageTime = 0;
        let questionsAttempted = 0;
        let correctAnswers = 0;
        let accuracy = 0

        const userQuestionsAndAnswers = userQuestions.map((userQuestion, i) => {
            const userAns = userQuestion.answer;

            const mainQuestion = QuestionPaper.find(paper => {
                //console.log(paper._id, mongoose.Types.ObjectId(userQuestion.questionID), userQuestion.questionID, paper._id === mongoose.Types.ObjectId(userQuestion.questionID), "\n\n"); 
                return paper._id.toString() === userQuestion.questionID
            });
            const mainAnswer = mainQuestion?.Answer;

            if (userAns === mainAnswer) {
                score += 1;
                correctAnswers += 1;
            };

            return { question: mainQuestion?.Question, answer: mainAnswer, userAnswer: userAns, answerValue: mainQuestion.Options[parseInt(mainAnswer) - 1], userAnswerValue: mainQuestion.Options[parseInt(userAns) - 1] }
        });

        // calculate other stats
        questionsAttempted = userQuestions.length;
        averageTime = (15 / questionsAttempted).toFixed(2);
        accuracy = ((correctAnswers / questionsAttempted) * 100).toFixed(2);

        // save stats in document
        test.score = score;
        test.questionsAttempted = questionsAttempted;
        test.correctAnswers = correctAnswers;
        test.accuracy = Number(accuracy);
        test.averageTime = Number(averageTime);

        // update only if country is other than india
        test.isTestCompleted = (test.testType === 1 || test.testType === 4) ? true : false;

        test.userQuestionsAndAnswers = userQuestionsAndAnswers;

        const t = await test.save(async function (err) {
            if (err) return res.status(400).send({ success: false, msg: 'Failed to save test' });

            else {
                const isMsgSentToSlack = await sendUserDetailsToSlack(userID, userData);
                if (isMsgSentToSlack) return res.status(200).send({ success: true, msg: `Test submitted successfully`, testType: test.testType });
                else return res.status(200).send({ success: true, msg: `Test submitted successfully but server failed to send your test results to the admin`, testType: test.testType });
            }
        });
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, msg: "Unexpected error occurred" })
    }
}


// send the qualified users list to slack
export const sendUserDetailsToSlack = async (userID, userData) => {
    try {
        const testData = await testModel.findOne({ userID }).select({ score: 1, isTestCompleted: 1, testType: 1 })

        const typingTestData = await typingTest.findOne({ userID })

        if (!testData || !userData || !testData.isTestCompleted) return false
        let msgData = {
            text: `Name: ${userData.fullName}.
\nEmail: ${userData.email}.
\nMCQS Score: ${testData.score ?? '-'}.\n
Words/min : ${userData?.wpm ?? typingTestData?.wpm ?? '-'}\n 
Accuracy : ${userData?.accuracy ?? typingTestData?.accuracy ?? '-'}\n
\nCV: ${userData.file || "Not Found"}\n\n`
        };

        const res = await axios.post(process.env.REACT_APP_SLACK, JSON.stringify(msgData), {
            withCredentials: false,
            headers: {}
        });

        if (res.status === 200) {
            console.log("slack message send !!")
            return true
        }
        else {
            console.error("slack not send")
            return false
        }
    }
    catch (error) {
        console.log(error)
        return false;
    }
}

export default CalculateScore;