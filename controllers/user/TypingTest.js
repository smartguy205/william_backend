import { testModel } from "../../models/testSchema.js"
import { typingTest } from "../../models/TypingTest.js"
import { userModal } from "../../models/UserSchema.js"
import { sendUserDetailsToSlack } from '../user/CalculateScore.js';


const SubmitTypingTest = async (userID, testID, wpm, accuracy, res) => {
    try {
        // make test completed true for 50 mcq's
        // const updateRes = await testModel.findOneAndUpdate({ userID,testType:2 }, { isTestCompleted: true });
        //const updateRes = await testModel.findOneAndUpdate({ $or: [{ userID, testType: 2 }, { userID, testType: 3 }] }, { isTestCompleted: true });
        const updateRes = await testModel.findOne({ userID, testID })
        const user = await userModal.findOne({ _id: userID })
        if (!updateRes || !user) return res.status(400).json({ error: "Test not found", success: false })

        else {
            const testType = updateRes?.testType ?? 2;
            // save the user id and score in the typing test collection
            let TypingTestDoc = new typingTest({
                userID,
                testID,
                wpm,
                accuracy,
                testType
            })
            if (testType === 2 || testType === 3) {

                const t = await testModel.findOneAndUpdate({ userID, testID }, { isTestCompleted: true })

                sendUserDetailsToSlack(userID, { fullName: user.fullName, email: user.email, file: user.file, wpm, accuracy });

            }
            await TypingTestDoc.save((err) => {
                if (err) {
                    console.log(err.toString())
                    return res.status(500).json({ error: "Unexpected Internal Server Error Occurred", success: false })
                }
                else {
                    return res.json({ error: "Your typing test has been submitted", testType, success: true })
                }
            })
        }
    }
    catch (error) {
        console.error({ error })
        return res.status(400).json({ error: "Unexpected Internal Server Error Occurred", success: false })
    }
}

export default SubmitTypingTest