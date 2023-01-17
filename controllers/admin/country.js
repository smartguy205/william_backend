// import { createdCountryModel } from "../../models/CountrySchema.js";

// export const addCountry = async (data, res) => {
//     const findCountry = await createdCountryModel.findOne({ ...data })
//     if (!findCountry) {
//         const countryCreated = await createdCountryModel.create({ ...data })
//         return res.status(200).json({ success: true, msg: "Country added !!", countryCreated })
//     }
//     else
//         return res.status(200).json({ success: false, msg: "Country Already Exits", findCountry })
// }

// export const getCountries = async (res) => {
//     const findCountry = await createdCountryModel.find({})
//     if (!findCountry)
//         return res.status(200).json({ success: false, msg: "No findCountry Found !!" })

//     else
//         return res.status(200).json({ success: true, msg: "Country", findCountry })
// }

// export const deleteCountry = async (id, res) => {
//     const findCountry = await createdCountryModel.findOne({ _id: id })
//     if (!findCountry)
//         return res.status(200).json({ success: false, msg: "No Country Found !!" })

//     else {
//         const deletedObj = await createdCountryModel.deleteOne({ _id: id })
//         return res.status(200).json({ success: true, msg: "Country removed !!", ...deletedObj })
//     }
// }