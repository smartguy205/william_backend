import React from "react";
// import Logo from "/logo.png"
import * as Sentry from '@sentry/react';

const Logo = () => {
    return (
        <img src="/logo.png" alt="Logo" width={180} />
    )
}
export default Sentry.withProfiler(Logo);