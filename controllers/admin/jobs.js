import { createdTestModel } from "../../models/CreatedTestSchema.js";

export const addJobs = async (job, res) => {

    //return res.status(200).json(data.length)
    let findJobs;
    if (job.country === "All")
        findJobs = await createdTestModel.findOne({ position: job.position })
    else findJobs = await createdTestModel.findOne({ position: job.position, country: job.country })
    // findJobs = await createdTestModel.find({
    //     "$or": [{
    //         "country": job.country,
    //         "position": job.position
    //     }, {
    //         "country": "All",
    //         "position": job.position
    //     }]
    // })

    if (!findJobs) {
        const jobCreated = await createdTestModel.create(job)
        // console.log(jobCreated);
        // return res.status(200).json({ success: true, msg: 'Job Created !!' });
        return { exits: false, msg: `Job created for ${job.country} with ${job.position}` };
    }
    //else return res.status(200).json({ success: false, msg: "Job Already Exits", findJobs })
    else return {
        exits: true, msg: `Job already exists for ${job.country} with ${job.position}`
    }
}

export const getJobs = async (res) => {
    const findJobs = await createdTestModel.find({})
    if (!findJobs)
        return res.status(200).json({ success: false, msg: "No Jobs Found !!" })

    else return res.status(200).json({ success: true, msg: "Jobs", findJobs })
}

export const getJobsForAUser = async ({ country, position }, res) => {

    try {
        const findJobs = await createdTestModel.//findOne({ country, position })
            findOne({
                "$or": [
                    { "country": country, },
                    { "country": "All", }
                ]
            })
        if (!findJobs)
            return res.status(404).json({ success: false, error: "No Test found for your location/position" });
        else return res.status(200).json({ success: true, msg: "Jobs", findJobs })
    } catch (e) { return res.status(404).json({ success: false, msg: e.toString() }) }
}

export const deleteJob = async (id, res) => {
    const findJobs = await createdTestModel.findOne({ _id: id })
    if (!findJobs)
        return res.status(200).json({ success: false, msg: "No Job Found !!" })

    else {
        const deletedObj = await createdTestModel.deleteOne({ _id: id })

        // if (deletedObj > 0)
        return res.status(200).json({ success: true, msg: "Job removed !!", ...deletedObj })
        // else res.status(400).json({ success: false, msg: "Job Not removed !!", })
    }
}