import { userDetailsFormSchema } from '../../utils/YupSchemas.js';
import { userModal } from '../../models/UserSchema.js';
import { testModel } from '../../models/testSchema.js';
import UploadToS3 from './UploadToS3.js';
import { getCountry } from './userDetails.js';

export const userCV = async (data, req, res) => {
    let country;
    try {
        const ip = req.ip
        country = await getCountry(ip);
    }
    catch (error) {
        country = "";
    }


    userDetailsFormSchema.validate(data)
        .then(async (response) => {
            try {
                let filename = `${Date.now()}_${response.file.name}`;
                filename = filename.replace(/\s/g, "_");

                // checking if user already submitted the CV 
                const { email, phone } = response;
                const user = await userModal.findOne({ $or: [{ email: email }, { phone: phone }] });
                const test = await testModel.findOne({ email: email })

                if (test?.isTestCompleted === true) {
                    return res.status(409).json({ success: true, error: "Test Already Submitted!" })
                }

                else if (user) {
                    return res.status(200).json({ success: true, msg: "Welcome Back!", user: { email: email, userID: user?._id } })
                }

                // save details to db and file to s3
                else if (response.file?.data) {
                    const isFileUploaded = await UploadToS3(filename, response);

                    if (isFileUploaded?.success !== true) {
                        return res.json({ success: false, msg: isFileUploaded.msg || "File not saved" })
                    }

                    // save to database
                    let s3File = 'https://luke-pdf.s3.ap-south-1.amazonaws.com/' + filename
                    const dataToSave = { ...data, country: country, file: s3File, ip: req.ip };
                    const newCV = new userModal(dataToSave);
                    await newCV.save();

                    return res.status(200).json({ success: true, msg: "File uploaded and data successfully submitted", user: { email: email, userID: newCV?._id } })
                }
                else {
                    return res(400).json({ success: false, msg: "Something went wrong, Possibly file not found" })
                }
            }
            catch (error) {
                console.log(error)
                return res.status(500).json({ success: false, msg: "Internal Server Error Occurred!!" })
            }
        })
        .catch(err => {
            return res.status(401).json({ success: false, msg: "Validation error occurred, Please re-check you details", error: err.message?.replace(".mimetype", " type") })
        })
}