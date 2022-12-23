import { excelModal } from "../../models/ExcelSchema.js"

const uploadExcelToDB = async (res, fileObj) => {
  if (!fileObj) return res.json({ success: false, msg: "File not found" })

  const obj = {
    fileObj
  }

  try {
    excelModal.insertMany(fileObj)
      .then(() => {
        return res.status(200).json({ success: true, msg: "File uploaded." })
      })
      .catch(err => {
        return res.status(400).json({ success: false, msg: "File not uploaded", error: err.message })
      })
  }
  catch (error) {
    return res.status(400).json({ success: false, msg: "File not uploaded" })
  }
}

export default uploadExcelToDB