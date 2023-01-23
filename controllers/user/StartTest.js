import { excelModal } from "../../models/ExcelSchema.js";
import { testModel } from '../../models/testSchema.js';


const countryCode = {
    'india': "IN",
    'usa': "US",
    'uk': "UK"
}

const StartTest = async (userID, language, email, res, size, testObj) => {
    try {

        let records = await excelModal.aggregate([{ $sample: { size: size } }]); //random questions
        //let records = await excelModal.find().limit(size).lean(); //delete it once done

        if (records.length === size) {
            let testResponse;

            records = records.map(re => {
                //let newObj = { ...re._doc, Question: re._doc?.QuestionsArr?.[countryCode[country.toLowerCase()]] ?? re._doc.Question }
                let newObj = { ...re, Question: re?.QuestionsArr?.[language.toLowerCase()] ?? re.Question }
                delete newObj['QuestionsArr'];
                return newObj;
            });

            if (testObj.isTestAlreadyAvailable === false) {
                testResponse = await testModel.create({ userID, email, Questions: records, isTestStarted: false, testType: testObj?.testType });
                return res.status(200).json({ success: true, msg: `${records.length} questions available for test`, testId: testResponse?._id.toString(), testType: testObj.testType })
            }

            testResponse = await testModel.findOneAndUpdate({ _id: testObj.testID },
                { Questions: records, isTestStarted: false, testType: testObj.testType });

            return res.status(200).json({ success: true, msg: `${records.length} questions available for test`, testId: testResponse?._id.toString(), testType: testObj.testType });
        }
        else {
            return res.status(404).json({ success: false, msg: "Cannot not find all the questions" })
        }
    }
    catch (error) {
        console.log(error.toString())
        return res.status(500).json({ success: false, msg: "Internal server error occurred" })
    }
}

export default StartTest;