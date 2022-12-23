import { feedbackModal } from "../../models/FeedbackSchema.js";
import { userModal } from "../../models/UserSchema.js";

export const FeedBack = {

    createfeedback: async (req, res) => {
        const { text, userID } = req.body;

        // console.log(req.body);

        if (!text || !userID) {
            return res.status(403).json({ success: false, msg: 'Feedback cannot be empty' })
        }

        await userModal.findOne({ userID }).then(
            async (user) => {
                // console.log(user);
                if (!user) {
                    return res.status(404).json({ success: false, msg: 'User not found' })
                }
                else {
                    await feedbackModal.create(
                        {
                            text: text,
                            userID: userID,
                            name: user.fullName,
                        }
                    )
                    res.status(200).json({ success: true, msg: 'Feedback Given Successfully' });
                }
            }
        ).catch(err => {
            res.status(500).json({ success: false, msg: 'Unexpected Error Occured' })
        })

    },

    getAll: async (req, res) => {
        const data = await feedbackModal.find()
        return res.send(data)
    },

}






