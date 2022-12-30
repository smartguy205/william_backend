import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import { useNavigate } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { Buffer } from 'buffer'; 
import CircularProgress from '@mui/material/CircularProgress';

function App() {
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState();
    const [selectedFileData, setSelectedFileData] = useState(null);
    const [mount, setMount] = useState(false);
    const [loading, setLoading] = useState(false);

    const [positions, setPositons] = useState([]);

    const [data, setData] = useState({
        fullName: "",
        email: "",
        phone: "",
        position: "Virtual Assistant",
        language: "English",
        experience: "1",
    });

    const getPositions = async () => {

        try {
            const positionRes = await axios.post(`${process.env.REACT_APP_SERVER}/user/getposition`)
            if (positionRes.data?.success) {
                setPositons(positionRes.data?.data);
                setData((prev) => {
                    return {
                        ...prev,
                        position: positionRes.data.data[0]
                    }
                })
            }
            else {
                setPositons([])
            }

        } catch (error) {
            setPositons(error.response?.data?.data)
            toast.error(error.response?.data?.msg, {
                position: 'top-center', style: { width: '28rem' }
            });
        }
    }

    // using only to get Positions
    useEffect(() => {
        if (mount) {
            getPositions();
        }
        else {
            setMount(true)
        }
    }, [mount]);


    // file
    const changeHandler = async (event) => {
        if (event.target?.files[0]?.type !== 'application/pdf') {
            toast.warning("Please upload a file with .pdf extension", {
                position: 'top-center', style: { width: '28rem' }
            });
            return;
        }
        const fileSize = parseInt(event.target.files?.[0].size / 1000000);
        if (fileSize > 25) {
            toast.warning("Please upload a file smaller than 25 MB", {
                position: 'top-center', style: { width: '28rem' }
            });
            return;
        }

        try {
            const formData = new FormData();
            formData.append("body", event.target.files[0])

            setSelectedFile(event.target.files[0]);
            setSelectedFileData(event.target.files[0])

            // const reader = new FileReader()
            // reader.onload = async (e) => {
            //     let text = (e.target.result)
            //     text = Buffer.from(text).toString('base64')
            // };
            // reader.readAsDataURL(event.target.files[0]);
        }
        catch (error) {
            console.log(error);
        }
    };

    // save the user data to database
    const SaveDataToDataBase = async (isFile, fileLink = "") => {
        try {
            let allData = { ...data }

            if (isFile.file) {
                console.log('data set');
                allData = { ...allData, file: fileLink }
            }

            let UserDataRes = await axios.post(`${process.env.REACT_APP_SERVER}/user/userCV`, { data: allData });
            if (UserDataRes.data.success) {
                console.log('data success ');
                const { userID, email } = UserDataRes.data.user;
                localStorage.setItem("userID", userID);
                localStorage.setItem("email", email);
                navigate(`/startTest`, { replace: true })
            }
            else {
                toast.error(UserDataRes.data.error, {
                    position: 'top-center', style: { width: '28rem' }
                });
            }
            setLoading(false);
        }
        catch (error) {
            toast.error(error.response.data.error, {
                position: 'top-center', style: { width: '28rem' }
            });
            setLoading(false);
        }
    }


    // form details
    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => {
            return {
                ...prev,
                [name]: value,
            };
        });
    };

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault()
        try {
            if (selectedFile?.name) {
                let fileName = selectedFile.name.trim().replace(/\s/g, "_")
                if (!fileName || !selectedFileData) {
                    return false;
                }

                if (selectedFile && selectedFileData) {

                    // creates a preSigned url
                    await axios.post(`${process.env.REACT_APP_SERVER}/user/url`, { fileName, data: data })
                        .then((res) => {
                            if (res.data.success) {
                                axios.put(res.data.url, {
                                    body: selectedFileData,
                                }, {
                                    headers: {
                                        'Content-Type': 'multipart/form-data'
                                    }
                                }).then((result) => {
                                    if (result?.status) {

                                        SaveDataToDataBase({ file: true }, res.data.file);
                                    }
                                }).catch(error => {

                                    toast.error("File upload failed", {
                                        position: 'top-center', style: { width: '28rem' }
                                    })
                                    setLoading(false);
                                });
                            }

                        }
                        ).catch((error) => {
                            console.log(error)
                            toast.error("Unexpected error occurred, Failed to upload file!", {
                                position: 'top-center', style: { width: '28rem' }
                            });
                            setLoading(false);
                        })
                }
            }
            else {
                SaveDataToDataBase({ file: false })
            }
        }
        catch (err) {
            toast.error(err.response.data.error, {
                position: 'top-center', style: { width: '28rem' }
            });
            setLoading(false);
        }
    }


    return (
        <div className="App  container-fluid">
            <h2>Marketing Management</h2>
            <div className="box row col-sm-12 col-md-8 col-lg-6">
                <form
                    onSubmit={(e) => {
                        handleSubmit(e);
                    }}>
                    <p className="info text-center fs-5">
                        Please verify or enter your personal information
                    </p>
                    <label className="fw-normal">Full Name:</label>
                    <br />
                    <input
                        type="text"
                        className="text"
                        name="fullName"
                        placeholder="Please Enter your full name"
                        value={data.fullName}
                        required
                        onChange={handleChange}
                    />
                    <br />
                    <label className="fw-normal">Email:</label>
                    <br />
                    <input
                        type="email"
                        className="text"
                        name="email"
                        placeholder="Please Enter your Email"
                        value={data.email}
                        required
                        onChange={handleChange}
                    />
                    <br />
                    <label className="fw-normal">Phone Number:</label>
                    <br />
                    <input
                        type="number"
                        className="text"
                        name="phone"
                        placeholder="Please Enter your phone number"
                        value={data.phone}
                        required
                        onChange={handleChange}
                    />
                    <br />
                    <label className="fw-normal">Choose Your Position: *</label>
                    <br />
                    <select
                        value={data.position}
                        name="position"
                        className="text"
                        required
                        onChange={handleChange}
                    >
                        {positions?.map((p, index) => <option key={index} value={p}>{p}</option>)}
                    </select>
                    <br />
                    <label className="fw-normal">Select Language: *</label>
                    <br />
                    <select
                        value={data.language}
                        name="language"
                        className="text"
                        required
                        onChange={handleChange}
                    >
                        <option value="English">English</option>
                    </select>
                    <br />
                    <label className="fw-normal">Your Work Experience: *</label>
                    <br />
                    <select
                        value={data.experience}
                        name="experience"
                        className="text"
                        required
                        onChange={handleChange}
                    >
                        <option value="1">0-1 year</option>
                        <option value="2">1-3 years</option>
                        <option value="3">3-5 years</option>
                        <option value="4">5+ years</option>
                    </select>
                    <br />

                    <div className="row d-flex justify-content-center mt-3">
                        <p className="row d-flex justify-content-center mt-3">Upload Only .pdf extension file *</p>
                        <label htmlFor="fileIp" className="fileIp w-auto text-center mb-2 border p-2 rounded">Upload CV</label>
                        {
                            selectedFile?.name &&
                            <p className="fs-6 text-center">File: {selectedFile?.name}</p>
                        }
                        <input
                            id="fileIp"
                            type="file"
                            accept="application/pdf"
                            name="file"
                            style={{ display: "none" }}
                            onChange={changeHandler} />
                    </div>
                    {loading && selectedFile ?
                        (
                            <>
                                <div className="d-flex justify-content-center">
                                    <CircularProgress color="success" />
                                </div>
                                <div className="d-flex justify-content-center">
                                    <p>Uploading file.. Please Wait for a while..</p>
                                </div>
                            </>

                        ) :
                        (
                            <input className="submit" type="submit" value="Submit" />
                        )
                    }
                </form>

            </div>
            <ToastContainer />

        </div>
    );
}

export default Sentry.withProfiler(App);
