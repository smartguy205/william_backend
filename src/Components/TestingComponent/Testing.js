import React, { useState, useEffect } from "react";
import { Box, Stack, Card, Button } from '@mui/material';
import * as Sentry from '@sentry/react';
import Logo from "../Logo/Logo";
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
// import QuestionChips from '../QuestionChips/QuestionChips';
import QuestionTable from '../QuestionTable/QuestionTable';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
import { useNavigate } from "react-router";


const FinalScreen = () => {
    const [data, setData] = useState([]);
    const [mount, setMount] = useState(false);
    const navigate = useNavigate();


    // const [count, setCount] = useState(0);

    // const focusFUnction = () => {

    //     // console.log(document.visibilityState);

    //     if (document.visibilityState === 'visible') {
    //         toast.warning('WARNING!!! PLEASE DONT TRY TO SWTICH OR ELSE YOUR TEST WILL BE SUBMITTED AUTOMATICALLY.', {
    //             position: toast.POSITION.TOP_CENTER, style: { width: '400px' }
    //         });
    //     }
    //     else {
    //         console.log('I am navigate1', count);
    //         // if (prevCount + 1 >= 5) {
    //         //     //navigate
    //         //     console.log('I am navigate');
    //         //     navigate('/TestCompleted')
    //         // }
    //         // else {
    //         //     // setCount((prevCount) => {
    //         //     //     return prevCount++
    //         //     // });
    //         setCount((prevCount) => {
    //             console.log(document.visibilityState, prevCount);
    //             if (prevCount + 1 >= 5) {
    //                 //navigate
    //                 navigate('/TestCompleted')
    //             }
    //             return prevCount + 1;
    //         })
    //     }

    // }

    // useEffect(() => {
    //     if (typeof (window) !== 'undefined')
    //         document.addEventListener('visibilitychange', focusFUnction)
    //     return () => {
    //         document.removeEventListener('visibilitychange', focusFUnction);
    //     }
    // }, []);




    const getQuestions = async () => {
        try {
            const testID = localStorage.getItem("testID");
            const userID = localStorage.getItem("userID");
            const data = {
                testID,
                userID
            }

            const res = await axios.post(`${process.env.REACT_APP_SERVER}/user/getQuestionFromId`, data);

            if (res.data.success) {
                let questionsArr = res.data.data;
                questionsArr = questionsArr.map(q => ({ ...q, choice: 0 }))
                setData(questionsArr);
            }
            else {
                if (res.data.isTestStarted) navigate("/startTest", { replace: true });
                else if (res.data.retestExhausted) navigate("/retestExhasuted", { replace: true });
                else {
                    alert(res.data.msg);
                    navigate("/startTest", { replace: true });
                }
            }
        }
        catch (error) {
            toast.error("Unexpected error occurred", {
                position: toast.POSITION.TOP_CENTER
            });
            navigate("/startTest", { replace: true });
        }
    }


    useEffect(() => {
        if (mount) {
            getQuestions();
        }

        setMount(true);

        window.onbeforeunload = function () {
            return "Data will be lost if you leave the page, are you sure?";
        };

        return () => {
            window.onbeforeunload = null;
        };
    }, [mount]);


    const [index, setIndex] = useState(0);
    const setAns = (choice) => {
        data[index].choice = choice
    }

    async function Submit() {
        let finalAnswers = data?.map(d => ({ questionID: d._id, answer: d.choice }));

        let userID = localStorage.getItem("userID");
        const data1 = {
            userID,
            questions: finalAnswers,
        }

        const res = await axios.post(`${process.env.REACT_APP_SERVER}/user/submitTest`, { data: data1 });
        if (res.data?.success) {
            // if (res.data.navigateToTypingTest)
            //     navigate("/typing-test", { replace: true, state: { userID } });
            // else
            navigate("/testCompleted", { replace: true, state: { userID } });
        }
        else {
            alert(res.data.msg);
            navigate("/startTest", { replace: true });
        }
    }

    return (
        <>
            <div className="container">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', }} padding={"1rem"} id='timer'>
                    <Logo />

                </Box>

                {data[index]?.Images.length > 0 ? (
                    <Stack flexDirection='column' >
                        <Stack className="testing" sx={{ display: "flex", flexDirection: "row", justifyContent: 'space-between' }}>


                            <Card sx={{ flex: 1, boxShadow: 'none' }}>

                                <QuestionTable data={data[index]} index={index} sendAns={setAns} Submit={Submit} />
                            </Card>

                            <Card sx={{ flex: 0.8, boxShadow: 'none' }}>
                                {data[index].Images.map((img, key) => <img
                                    src={"https://luke-pdf-image.s3.ap-south-1.amazonaws.com/" + img} key={key} className="img-fluid" />)}
                            </Card>
                        </Stack>

                        <Stack sx={{ justifyContent: 'center', alignItems: 'center', m: 2, mt: 5 }}>

                            {index < data.length - 1 && <Button sx={{
                                "&:hover": { 'background': 'lightblue' }, color: 'white', backgroundColor: 'green', padding: '0.5rem 1rem',
                                mt: '5%',
                            }} onClick={() => setIndex(i => i + 1)} > Submit Answer <ChevronRightOutlinedIcon /> </Button>}
                            {index === data.length - 1 && <Button variant='outlined' size='medium' sx={{
                                mt: '5%',
                                color: 'white', backgroundColor: 'green'
                            }} onClick={Submit}> Submit Answer </Button>}
                        </Stack>
                    </Stack>
                )

                    :

                    (
                        <Stack flexDirection='column'>

                            <Stack className="" sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" } }}>

                                <Card sx={{ flex: 1, boxShadow: 'none' }}>
                                    <QuestionTable data={data[index]} index={index} sendAns={setAns}
                                        Submit={Submit} />
                                </Card>

                            </Stack>

                            <Stack sx={{ justifyContent: 'center', alignItems: 'center', m: 2, mt: 5, }}>
                                {index < data.length - 1 && <Button sx={{
                                    "&:hover": {
                                        'background': 'lightblue'
                                    }, color: 'white', backgroundColor: 'green', padding: '0.5rem 1rem',

                                }} onClick={() => setIndex(i => i + 1)}> Submit Answer <ChevronRightOutlinedIcon /> </Button>}
                                {index === data.length - 1 && <Button variant='outlined' size='medium' sx={{
                                    mt: '5%',
                                    color: 'white', backgroundColor: 'green'
                                }} onClick={Submit}> Submit Answer </Button>}
                            </Stack>

                        </Stack>)
                }
                <ToastContainer />
            </div>
        </>
    )
}
export default Sentry.withProfiler(FinalScreen);


