import { positionModel } from "../../models/PositionSchema.js";

export const addPosition = async (data, res) => {
    const findPosition = await positionModel.findOne({ ...data })
    if (!findPosition) {
        const PositionCreated = await positionModel.create({ ...data })
        return res.status(200).json({ success: true, msg: "Position added !!", PositionCreated })
    }
    else
        return res.status(200).json({ success: false, msg: "Position Already Exits", findPosition })
}

export const getPosition = async (res) => {
    const findPosition = await positionModel.find({})
    if (!findPosition)
        return res.status(200).json({ success: false, msg: "No findPosition Found !!" })
    else
        return res.status(200).json({ success: true, msg: "Position", findPosition })
}

export const deletePosition = async (id, res) => {
    const findPosition = await positionModel.findOne({ _id: id })
    if (!findPosition)
        return res.status(200).json({ success: false, msg: "No Position Found !!" })

    else {
        const deletedObj = await positionModel.deleteOne({ _id: id })
        return res.status(200).json({ success: true, msg: "Position removed !!", ...deletedObj })
    }
}