import React, { useEffect, useState } from "react";
import "./InstructionPageStyles.css";
import axios from "axios";
import Logo from "../Components/Logo/Logo";
import { Stack, Typography, Box, Container } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Instruction_Page = () => {
    const navigate = useNavigate();

    const getQuestions = async () => {
        const userID = localStorage.getItem("userID");
        const email = localStorage.getItem("email");

        if (!userID || !email) {
            toast.error("Cannot find the user");
            return navigate("/");
        }

        try {
            const data = {
                email,
                userID
            }

            const res = await axios.post(`${process.env.REACT_APP_SERVER}/user/StartTest`, data);
            if (res.data.success) {
                const { testId } = res.data;
                if (testId) {
                    localStorage.setItem("testID", testId);
                    // window.history.pushState(null, null,window.location.href);
                    navigate("/test");
                }
            }
            else {
                alert(res.data.msg);
                if (res.data?.testCompleted) {
                    return navigate("/TestCompleted")
                }
                else if (res.data?.retestExhausted) {
                    throw res.data.msg;
                }
                else return navigate("/");
            }
        }
        catch (error) {
            console.log(error)

            toast.error(error.response.data.msg, {
                position: toast.POSITION.TOP_CENTER
            })
            setTimeout(() => {
                if (error.response.status === 403) {
                    return navigate("/retestExhasuted")
                }
            }, 6500)

        }
    }

    const data = [
        {
            heading: 'Aptitude Assessment',
            paragraph: "This Aptitude Style reasoning test comprises 50 questions, and you will have 15 minutes in which to correctly answer as many as you can."
        },
        {
            paragraph: "Calculators are NOT permitted for this test, therefore it is recommended you have some rough paper to work on."
        },
        {
            paragraph: "You will have to work quickly and accurately to perform well in this test. If you don't know the answer to a question, move on to the next question.Each question will have multiple answer options, one of which is correct. If the exact correct answer is not provided, select the closest possible answer."
        },
        {
            paragraph: "Given the nature of the test, it is highly unlikely that you will answer all the questions before the time limit is up. The test will automatically be end with the answers you have selected. It is recommended to keep working until the time limit is up."
        },
        {
            paragraph: "Try to find a time and place where you will not be interrupted during the test. The test will start on the next screen."
        }
    ]

    useEffect(() => {
        const checkIfUser = () => {
            const user = localStorage.getItem("userID");
            const email = localStorage.getItem("email");

            if (!user || !email) {
                navigate("/", { replace: true });
            }
        }
        checkIfUser();
    }, []);

    const width = window.screen.width;

    return (

        (width >= 800 ?
            <>
                <div className="container">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', }} padding={"1rem"} id='timer'>
                        <Logo />

                    </Box>
                    <Container sx={{ justifyContent: 'center', mt: { xs: 7, md: 15 }, color: "#444" }} className="instruction_wrapper">
                        <h1 className="mb-3 fw-bold">
                            {data[0].heading}
                        </h1>
                        {data.map((item, index) => (
                            <Typography key={index} sx={{ marginBottom: '10px' }} fontWeight={600}>
                                {item.paragraph}
                            </Typography>
                        ))}

                        <Stack sx={{ mt: 5, justifyContent: 'center', alignItems: 'center' }} >
                            <button className="btn rounded-0 px-4 fw-bold" style={{ color: 'white', backgroundColor: '#35aa57' }} onClick={getQuestions}>Start Test</button>
                        </Stack>

                    </Container>
                    <ToastContainer />
                </div>
            </>

            :

            <>

                <div className="container">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', }} padding={"1rem"} id='timer'>
                        <Logo />

                    </Box>
                    <Container sx={{ justifyContent: 'center', mt: { xs: 7, md: 15 }, color: "#444" }} className="instruction_wrapper">
                        <h1 className="mb-3 fw-bold">
                            {data[0].heading}
                        </h1>
                        {data.map((item, index) => (
                            <Typography key={index} sx={{ marginBottom: '10px' }} fontWeight={600}>
                                {item.paragraph}
                            </Typography>
                        ))}

                        <Stack sx={{ mt: 5, justifyContent: 'center', alignItems: 'center' }} >
                            <p className="fw-bold fst-italic fs-6 badge bg-danger text-wrap m-5">Please Complete the assessment using a deskstop device.</p>
                            <button className="btn rounded-0 px-4 fw-bold" disabled style={{ color: 'white', backgroundColor: '#35aa57' }} onClick={getQuestions}>Start Test</button>
                        </Stack>

                    </Container>
                </div>
                <ToastContainer />

            </>)
    );
}
export default Sentry.withProfiler(Instruction_Page);



