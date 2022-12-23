import { adminModal } from "../../models/AdminSchema.js";
import bcrypt from "bcrypt";

const login = async (email, password, res) => {
  try {
    const admin = await adminModal.findOne({ email }, { password: 1 });

    const isPasswordCorrect = await bcrypt.compare(password, admin.password);

    if (!admin || isPasswordCorrect === false) {
      return res.status(404).json({ success: false, msg: "No user found" })
    }

    return res.status(200).json({ success: true })
  }
  catch (error) {
    return res.status(500).json({ success: false, msg: "Internal server error occurred" })
  }
}

export default login