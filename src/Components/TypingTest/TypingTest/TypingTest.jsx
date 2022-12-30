import React, { useRef, useState } from "react";
import { TextField } from '@mui/material';
import './TypingTest.css';
import { Stack, Container } from "@mui/system";
import Timer from "../Timer/Timer";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";

const TextBox = () => {

    const { state } = useLocation();
    // console.log(state)
    const navigate = useNavigate();

    const getWords = () => `water away good want over going where would took school think home know bear again long things after wanted eat everyone play thought well find more round tree magic shouted other food through been stop must door right these began animals next first work baby fish mouse something`.toLowerCase().split(' ').sort(() => Math.random() > 0.5 ? 1 : -1)

    // --------------------------------------------------------------------------------------------------------------------------------

    let Word = (props) => {

        const { text, active, correct } = props;

        if (correct === true) {
            return <span className="correct">{text} </span>
        }

        if (correct === false) {
            return <span className="incorrect">{text} </span>
        }

        if (active) {
            return <span className="active">{text} </span>
        }
        return <span>{text} </span>
    }

    Word = React.memo(Word)
    // --------------------------------------------------------------------------------------------------------------------------------


    const [userInput, setUserInput] = useState('')
    const cloud = useRef(getWords());

    const [startCounting, setStartCounting] = useState(false);

    const [activeWordIndex, setActiveWordIndex] = useState(0);
    const [correctWordArray, setCorrectWordArray] = useState([]);
    const [timeup, setTimeUp] = useState(false);
    const processInput = (value) => {

        if (!startCounting) {
            setStartCounting(true)
        }

        if (value.endsWith(' ')) {
            setActiveWordIndex(index => index + 1)
            setUserInput('')

            // Correct Word
            setCorrectWordArray(data => {
                const word = value.trim()
                const newResult = [...data]
                newResult[activeWordIndex] = word === cloud.current[activeWordIndex]
                return newResult
            })
        } else {
            setUserInput(value)
        }
    }

    //submit the typing test
    const SubmitTest = async () => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_SERVER}/user/submitTypingTest`,
                { userID: state.userID, score: correctWordArray.filter(Boolean).length });

            if (res.data.success) {
                navigate("/testCompleted", { replace: true, state: { userID: state.userID } });
            }
            else {
                alert(res.data.msg)
            }
        }
        catch (error) {
            alert(error.response.data.error)
        }
    }

    function setTimeUpFun(timeup) {
        setTimeUp(timeup);
        SubmitTest();
    }

    return (
        <Stack sx={{ backgroundColor: '#add5ff', height: "100vh", paddingTop: "5rem", width: "100vw" }}>
            <Container>
                <h2>Speed Typing Test</h2>
                <p className="para">{cloud.current.map((word, index) => {
                    return <Word key={index} text={word} active={index === activeWordIndex} correct={correctWordArray[index]} />
                })}</p>
                <Stack sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                    <Stack Stack width='50%'>
                        <TextField sx={{ backgroundColor: 'white', border: 'none' }} type='text' value={userInput} disabled={timeup} onChange={(e) => processInput(e.target.value)} />
                    </Stack>
                    <Stack width='30%'>
                        <Timer startCounting={startCounting} correctWords={correctWordArray.filter(Boolean).length} setTimeUp={setTimeUpFun} />
                    </Stack>
                </Stack>
            </Container>
        </Stack>
    )
}

export default TextBox;