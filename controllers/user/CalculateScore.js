import { testModel } from "../../models/testSchema.js";
import { userModal } from "../../models/UserSchema.js";
import axios from 'axios';

const CalculateScore = async (userID, userQuestions, res) => {
  try {
    const userData = await userModal.findOne({ _id: userID }, 'fullName email file country');
    // let navigateToTypingTest = userData?.country?.toLowerCase() == "india" ? true : false;

    const test = await testModel.findOne({ userID }, 'Questions _id');
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
      const mainQuestion = QuestionPaper.find(paper => paper._id.toString() === userQuestion.questionID);
      const mainAnswer = mainQuestion.Answer;

      if (userAns === mainAnswer) {
        score += 1;
        correctAnswers += 1;
      };

      return { question: mainQuestion.Question, answer: mainAnswer, userAnswer: userAns, answerValue: mainQuestion.Options[parseInt(mainAnswer) - 1], userAnswerValue: mainQuestion.Options[parseInt(userAns) - 1] }
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
    // test.isTestCompleted = test.testType === 3 || 4 ? false : true;
    test.isTestCompleted = true; //for all users when submitTest
    test.userQuestionsAndAnswers = userQuestionsAndAnswers;

    console.log(test);

    await test.save(async function (err) {
      if (err) return res.status(400).send({ success: false, msg: 'Failed to save test' });

      else {
        const isMsgSentToSlack = await sendUserDetailsToSlack(userID, userData);

        // if (isMsgSentToSlack) return res.status(200).send({ success: true, msg: `Test submitted successfully`, navigateToTypingTest: false });
        if (isMsgSentToSlack) return res.status(200).send({ success: true, msg: `Test submitted successfully` });
        // else return res.status(200).send({ success: true, msg: `Test submitted successfully but server failed to send your test results to the admin`, navigateToTypingTest: false });
        else return res.status(200).send({ success: true, msg: `Test submitted successfully but server failed to send your test results to the admin` });
      }
    });
  }
  catch (error) {
    return res.status(500).json({ success: false, msg: "Unexpected error occurred" })
  }
}


// send the qualified users list to slack
const sendUserDetailsToSlack = async (userID, userData) => {
  try {
    const testData = await testModel.findOne({ userID }, 'score')

    if (!testData || !userData) return false

    let msgData = { text: `Name: ${userData.fullName}.\nEmail: ${userData.email}.\nScore: ${testData.score}\nCV: ${userData.file || "Not Found"}\n\n` };

    const res = await axios.post(process.env.REACT_APP_SLACK, JSON.stringify(msgData), {
      withCredentials: false,
      headers: {}
    });

    if (res.status === 200) {
      return true
    }
    else {
      return false
    }
  }
  catch (error) {
    return false;
  }
}

export default CalculateScore;