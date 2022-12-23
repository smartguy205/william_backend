import { excelModal } from "../../models/ExcelSchema.js";
import { testModel } from '../../models/testSchema.js';

const StartTest = async (userID, email, res, size, testObj) => {
  try {
    const records = await excelModal.aggregate([{ $sample: { size: size } }]); //random questions

    if (records.length === size) {
      let testResponse;

      if (testObj.isTestAlreadyAvailable === false) {
        testResponse = await testModel.create({ userID, email, Questions: records, isTestStarted: false });

        return res.status(200).json({ success: true, msg: `${records.length} questions available for test`, testId: testResponse?._id.toString() })
      }

      testResponse = await testModel.findOneAndUpdate({ _id: testObj.testID },
        { Questions: records, isTestStarted: false });

      return res.status(200).json({ success: true, msg: `${records.length} questions available for test`, testId: testResponse?._id.toString() });
    }
    else {
      return res.status(404).json({ success: false, msg: "Cannot not find all the questions" })
    }
  }
  catch (error) {
    return res.status(500).json({ success: false, msg: "Internal server error occurred" })
  }
}

export default StartTest;