import React from 'react'
import * as Sentry from '@sentry/react';

const RetestExhausted = () => {
  return (
    <div className="container-fluid d-flex flex-column justify-content-center align-items-center" style={{ marginTop: '10%' }} >
      <h1>Retest Exhausted...</h1>
      <h6>You have exhausted your limit of giving the test. Please contact the admin for further details</h6>
    </div>
  )
}

export default Sentry.withProfiler(RetestExhausted);