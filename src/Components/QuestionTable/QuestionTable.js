import { Stack, Card, CardContent, FormControl, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import './QuestionTable.css';
import Timer from '../Timer/Timer';
import * as Sentry from '@sentry/react';


const Quiz = (props) => {

    const [isPlaying, setIsPlaying] = useState(true);


    const { data, index } = props;
    const [choice, setChoice] = useState(props.data?.choice ?? 0);
    useEffect(() => {
        setChoice(props.data?.choice ?? 0)
    }, [props.data])

    if (!data)
        return (<></>)
    const question = {
        question: data.Question,
        options: data.Options,
    }

    const onChangeHandler = (e) => {
        let value = e.target.value
        setChoice(value)
        props.sendAns(value)
    }

    const TimeOut = () => {
        setIsPlaying(false);
        props.Submit();
    }



    return (
        <>
            <Card elevation={0}
                sx={[{
                    // border: "none",
                    // shadow: 'none',
                }, props?.sx]}
            >
                <CardContent sx={{ padding: '2rem' }}>
                    <Typography
                        variant="h6"
                        fontFamily={"Roboto"}
                        fontWeight={600}
                        lineHeight="33px"
                        sx={{ mt: '12px', fontSize: '18px' }}
                        color={"#444"}
                    >
                        Question : {index + 1} of  50
                    </Typography>

                    <Stack className='timer_stack' sx={{ flexDirection: 'row', fontWeight: "600" }}>
                        <Typography className='fw-bold' sx={{ color: "#444", fontSize: '16px' }}>Time Remaining:&nbsp;</Typography>
                        <Timer OutOfTime={TimeOut} isPlaying={isPlaying} />
                    </Stack>

                    <Typography
                        variant="h6"
                        fontFamily={"Roboto"}
                        fontWeight={600}
                        lineHeight="33px"
                        color={"#444"}
                        sx={{ mt: 2, fontSize: '18px' }}
                    >
                        {question.question}
                    </Typography>

                    <FormControl style={{
                        marginLeft: "1rem",
                        margin: "12px",
                        fontWeight: 'bold',

                    }}>
                        <RadioGroup name="radio-options"
                            value={choice}
                            onChange={onChangeHandler}
                            sx={{ color: "#444" }}
                        >
                            {question.options.map((opt, i) =>
                                <FormControlLabel
                                    key={opt}
                                    label={opt}
                                    value={i + 1}
                                    className='inputGroup'
                                    control={<Radio sx={{
                                        "&.Mui-checked": {
                                            "&, & + .MuiFormControlLabel-label": {
                                                fontSize: "1.2rem",
                                                fontWeight: "600",
                                                color: '#ffcc00'
                                            }
                                        }
                                    }} />} />)}
                        </RadioGroup>
                    </FormControl>
                </CardContent>
            </Card>
        </>)

}

export default Sentry.withProfiler(Quiz);

