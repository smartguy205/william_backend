import React, { useEffect, useState } from "react";
import { Card, Button, CardContent } from "@mui/material";
import "./QuetionChipStyles.css";
import { Stack } from "@mui/system";

const ClickableChips = ({ sendIndex, mcqs, idx }) => {

    const [question, setQuestion] = useState(mcqs);
    useEffect(() => {
        setQuestion(mcqs)
    }, [mcqs])


    const handleClick = (index) => {
        sendIndex(index)
    };

    return (
            <Stack sx={{flex:{xs:0.7, md:0.6}, maxHeight:{xs:"30vh", sm:"50vh", md:"100vh"}, mt:{xs:5, md:0}}}>
                <Card className="Que-table overflow-auto">
                    <CardContent>
                        {question.map((que, index) => {
                            return (
                                <Button
                                    className="chip"
                                    key={index}
                                    variant="contained"
                                    size="small"
                                    color={index === idx ? "success" : (que.choice !== 0 ? "info" : "warning")}
                                    onClick={() => { handleClick(index) }}

                                >
                                    {index + 1}
                                </Button>
                            );
                        })}
                    </CardContent>
                </Card>
            </Stack>
    );
};

export default ClickableChips;