import { testModel } from "../../models/testSchema.js"
import { typingTest } from "../../models/TypingTest.js"

const SubmitTypingTest = async (userID, score, res) => {
  try {
    // make test completed true for 50 mcq's
    const updateRes = await testModel.findOneAndUpdate({ userID }, { isTestCompleted: true });

    if (!updateRes) return res.status(400).json({ error: "Test not found", success: false })

    else {
      // save the user id and score in the typing test collection
      let TypingTestDoc = new typingTest({
        userID,
        score
      })

      await TypingTestDoc.save((err) => {
        if (err) {
          return res.status(500).json({ error: "Unexpected Internal Server Error Occurred", success: false })
        }
        else {
          return res.json({ error: "Your typing test has been submitted", success: true })
        }
      })
    }
  }
  catch (error) {
    return res.status(400).json({ error: "Unexpected Internal Server Error Occurred", success: false })
  }
}

export default SubmitTypingTest;