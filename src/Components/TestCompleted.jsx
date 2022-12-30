import { Button, TextField } from '@mui/material'
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as Sentry from '@sentry/react';

const TestCompleted = () => {

  const navigate = useNavigate();

  const [feedback, setFeedback] = useState({
    text: '',
  });

  const changeHandler = (e) => {
    const { name, value } = e.target
    setFeedback((prev) => {
      return {
        ...prev,
        [name]: value
      }
    })
  }

  const { state } = useLocation();

  const submitHandler = async (e) => {
    const apibody = {
      text: feedback?.text,
      userID: state?.userID,
    }
    try {
      const res = await axios.post(`${process.env.REACT_APP_SERVER}/user/createfeedback`,
        apibody
      );
      if (res.data.success) {
        // navigate('/testCompleted', { replace: true })
        toast.success(res.data.msg, {
          position: 'top-center'
        })
      } else {
        toast.error(res.data.msg, {
          position: 'top-center'
        })
      }
    }
    catch (err) {
      toast.error(err.response.data.msg, {
        position: 'top-center'
      })
    }
    setFeedback({ text: '' })
  }




  return <div className="container-fluid d-flex justify-content-center align-items-center flex-column" style={{ height: "100vh", backgroundColor: "#DCDCDC", }}>
    <div className="shadow p-5 bg-light" style={{ maxWidth: '800px', marginBottom: '15px', borderRadius: '5px' }}>
      <div className="card-body d-flex justify-content-center align-items-center">
        <div>
          <h3>Successfully Submitted Test...</h3>
          <p className='mb-0'>
            Thank you for completing the Aptitude Assessment! We will contact you regarding your application if we are interested in speaking with you. Performance on this assessment is only a component of our application review process.
          </p>
        </div>
      </div>
    </div>

    <div className="shadow p-3 bg-light" style={{ maxWidth: '800px', borderRadius: '5px' }}>
      <div className="card-body flex-column d-flex justify-content-start m-4">
        <h3>Your Feedback is valuable...</h3>
        <p className='mb-0'>
          If you have any comments or questions about the assessment you completed please leave them in the comments section below. If for some reason you had any technical issues while taking the assessment we apologize. Please let us know with as much detail as possible what happened so we can investigate/resolve any potential issues. We may contact you to retake the assessment after completing our investigation.
        </p>
        <TextField variant='outlined' name='text' required value={feedback.text} onChange={changeHandler} className='mt-3' fullWidth multiline small='true' />
      </div>
      <div className='d-flex justify-content-around'>
        <Button type='submit' onClick={(e) => submitHandler(e)} variant='contained'>Submit Feedback</Button>
      </div>
    </div>
    <ToastContainer />
  </div>

}

export default Sentry.withProfiler(TestCompleted);