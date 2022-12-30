import axios from 'axios';
import React, { useEffect, useState } from 'react'
import moment from 'moment';
import { useNavigate, useParams } from 'react-router'
import { Button } from '@mui/material';
import * as Sentry from '@sentry/react';

const UserQuestionPaper = () => {
    const { id, name } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [user, setUser] = useState({ name: "", email: "" });

    const getUserPaper = async () => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_SERVER}/admin/getUserPaper`, { id, name });
            if (res.data.success) {
                setData(res.data.UserPaper);
                setUser(res.data.user || "");
            }
            else {
                alert(res.data.msg);
                navigate("/table", { replace: true });
            }
        }
        catch (error) {
            console.log(error)
            navigate("/table", { replace: true });
        }
    }

    useEffect(() => {
        getUserPaper();
    }, [])

    const downloadCV = () => {

    }



    return (
        <div className="container">
            <h1 className="text-center">Question Paper</h1>
            <div className='d-flex flex-column justify-content-center bg-light p-4'>
                <div className="row">
                    <h6 className='col-12 col-md-6 col-lg-3'>Name: {user.fullName}</h6>
                    <h6 className='col-12 col-md-6 col-lg-3'>Email: {user.email}</h6>
                    <h6 className='col-12 col-md-6 col-lg-3'>Position: {user?.position}</h6>
                    <h6 className='col-12 col-md-6 col-lg-3'>Phone Number: {user?.phone}</h6>
                    <h6 className='col-12 col-md-6 col-lg-3'>Language: {user?.language}</h6>
                    <h6 className='col-12 col-md-6 col-lg-3'>experience: {user?.experience} Year(s)</h6>
                    <h6 className='col-12 col-md-6 col-lg-3'>Score: {user?.score}</h6>
                    <h6 className='col-12 col-md-6 col-lg-3'>Questions Attempted: {user?.questionsAttempted}</h6>
                    <h6 className='col-12 col-md-6 col-lg-3'>Correct Answers: {user?.correctAnswers}</h6>
                    <h6 className='col-12 col-md-6 col-lg-3'>Average Time: {user?.averageTime} second(s)</h6>
                    <h6 className='col-12 col-md-6 col-lg-3'>Accuracy: {user?.accuracy}%</h6>
                    <h6 className='col-12 col-md-6 col-lg-3'>Date: {moment(user.updatedAt).format('MMMM Do YYYY, h:mm:ss a')}</h6>
                    {user.country ? <h6>Country: {user.country}</h6> : <h6>Country: Not Found</h6>}
                    {user.ip ? <h6>IP: {user.ip}</h6> : <h6>IP: Not Found</h6>}
                    {user?.file && <h6>CV: <a href={user.file} download="MyExampleDoc" target='_blank'>
                        <Button>DOWNLOAD CV</Button>
                    </a></h6>}
                    <h6 className='col-12 col-md-6 col-lg-3'>Feedback: {user?.feedback}</h6>
                </div>
                {
                    data.map((paper, i) => {
                        // 57 == ASCII of 9,
                        // 16 == to get the alphabet.
                        const userOptionNo = String.fromCharCode((57 + (paper.userAnswer - 9)) + 16);
                        const correctOptionNo = String.fromCharCode((57 + (paper.answer - 9)) + 16);

                        return <section className="mt-5 py-2 px-3 shadow-sm" key={i}>
                            <p className='mb-0'>{i + 1}. {paper.question}</p>
                            <p>User's Answer: <span className='fst-italic'>
                                ({userOptionNo}). {paper.userAnswerValue}</span>
                            </p>
                            <p>Correct Answer: <span className='mt-3 fw-bold'>
                                ({correctOptionNo}). {paper.answerValue}</span>
                            </p>
                        </section>
                    })
                }
            </div>
        </div>
    )
}

export default Sentry.withProfiler(UserQuestionPaper);