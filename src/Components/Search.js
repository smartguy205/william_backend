import React, { useState } from "react";
import UserTable from "./UserTables";
import "./Search.css";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";
import * as Sentry from '@sentry/react';

const Search = () => {
  const navigate = useNavigate();
  const [, , removeCookie] = useCookies(["email", "password"]);
  const [filterData, setFilterData] = useState("");

  const Logout = () => {
    removeCookie("email", { path: "/" });
    removeCookie("password", { path: "/" });
    navigate("/adminLogin", { replace: true });
  }

  return (
    <>
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center">
          <img src="/logo.png" alt="Logo" width={180} />
          <button className="btn btn-danger" onClick={Logout}>Logout</button>
        </div>

        <div className="searchBox mt-5 container-fluid">
          <input
            className="form-control w-50 mx-auto"
            type="text"
            placeholder="Search..."
            onChange={(e) => setFilterData(e.target.value)}
          />
          <UserTable filterData={filterData} />
        </div>
      </div>
    </>
  );
};

export default Sentry.withProfiler(Search);
