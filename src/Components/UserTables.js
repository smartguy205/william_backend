import axios from "axios";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { CSVLink } from 'react-csv';
import React, { useContext, useEffect, useState } from "react";
import moment from 'moment';
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/auth";
import "./UserTable.css";
import * as Sentry from '@sentry/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserTable = ({ filterData }) => {
  const { logged } = useContext(AuthContext);

  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [order, setOrder] = useState("ASC");
  const [duplicateData, setduplicateData] = useState([]);
  const [errMsg, setErrMsg] = useState("Loading Tests");

  // const [feedback, setFeedback] = useState(null);


  const [filter, setFilter] = useState({
    country: '',
    position: '',
  });
  const [countries, setCountries] = useState([]);
  const [positions, setPositions] = useState([]);

  const [arrowState, setArrowState] = useState({
    updatedAt: 'asc',
    fullName: 'asc',
    position: 'asc',
    country: 'asc',
    score: 'asc',
    averageTime: 'asc',
    accuracy: 'asc',
    questionsAttempted: 'asc',
    correctAnswers: 'asc',
  });

  const CSVData = data;


  //get details of all tests
  const getTestDetails = async () => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_SERVER}/admin/getTestDetails`);
      if (res.data.success) {
        setData(res.data.user)
        setduplicateData(res.data.user)

        console.log(res.data.user);

        if (res.data.user.length > 0) {
          const allCountries = res.data.user.map(user => {
            return user.country
          });

          const allPositions = res.data.user.map(user => {
            return user.position
          });

          let allC = [...new Set(allCountries)]
          let allP = [...new Set(allPositions)]

          setCountries(allC);
          setPositions(allP);
        }
      }
      else {
        setErrMsg(res.data.msg)
      }
    }
    catch (error) {
      toast.error(error.response?.data.msg, {
        position: "top-center",
        style: { width: "28rem" }
      })
    }
  }

  useEffect(() => {
    if (!logged) navigate("/adminLogin", { replace: true })
    else getTestDetails();
  }, []);



  // Sorting
  const sorting = (col) => {
    if (order === "ASC") {
      const sorted = [...data].sort((a, b) =>
        //   a[col]?.toString().toLowerCase() > b[col]?.toString().toLowerCase() ? 1 : -1
        // );

        typeof a[col] === 'number' ? a[col] - b[col] :
          a[col].toString().toLowerCase() > b[col].toString().toLowerCase() ? 1 : -1
      );

      setData(sorted);
      setOrder("DSC");
      setArrowState({ ...arrowState, [col]: "dsc" });
      setArrowState({ ...arrowState, [col]: "dsc" });
    } else {
      const sorted = [...data].sort((a, b) => {
        //   a[col]?.toString().toLowerCase() < b[col]?.toString().toLowerCase() ? 1 : -1
        // );
        console.log(typeof a[col]);
        return typeof a[col] === 'number' ? b[col] - a[col] : a[col].toString().toLowerCase() < b[col].toString().toLowerCase() ? 1 : -1
      });

      setData(sorted);
      setOrder("ASC");
      setArrowState({ ...arrowState, [col]: "asc" });
      setArrowState({ ...arrowState, [col]: "asc" });
    }
  };


  // filtering
  const Filter = (e) => {
    const { value, name } = e.target;
    setFilter(prev => {
      return {
        ...prev,
        [name]: value
      }
    })
  }

  // // Filter
  // useEffect(() => {
  //   let filteredCountryData = [];

  //   if (filter.position !== "") {
  //     let filteredPositionData = duplicateData.filter((item) => {
  //       return item.position === filter.position;
  //     });
  //     setData(filteredPositionData);
  //   }
  //   // else {
  //   //   setData(duplicateData)
  //   // }

  //   if (filter.country !== "") {
  //     filteredCountryData = duplicateData.filter((item) => item.country === filter.country);
  //     setData(filteredCountryData);
  //     console.log(filteredCountryData)
  //   }
  // }, [filter]);


  useEffect(() => {
    let filteredCountryData = duplicateData;
    if (filter.position !== "") {
      filteredCountryData = filteredCountryData.filter((item) => {
        return item.position === filter.position;
      });
    }
    if (filter.country !== "") {
      filteredCountryData = filteredCountryData.filter((item) => item.country === filter.country);
      console.log(filteredCountryData)
    }
    setData(filteredCountryData);
  }, [filter]);


  // Search
  useEffect(() => {
    if (filterData !== "") {
      let searchedData = duplicateData.filter((item) => {
        return item.fullName.toLowerCase().trim().includes(filterData.toLowerCase().trim());
      });
      setData(searchedData);

      searchedData.length <= 0 && setErrMsg("No tests found");
    }
    else {
      setData(duplicateData);
    }
  }, [filterData]);

  // const handleFeedback = () => {
  //   axios.get('http://localhost:5000/user/getfeedback').then((response) => {
  //     setFeedback(response.data);
  //   });
  // }



  return (
    <div className="userTable mt-5">
      <div className="row">
        <div className="mb-4">
          <select name="country" onChange={Filter}>
            <option value="">Select Country</option>
            {countries.map((item, index) =>
              <option value={item} key={index} >{item}</option>
            )}
          </select>
        </div>

        <div>
          <select name="position" onChange={Filter}>
            <option value="">Select Position</option>
            {positions.map((item, index) =>
              <option value={item} key={index} >{item}</option>
            )}
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        {
          data.length > 0 &&
          <div className="my-3">
            <CSVLink data={CSVData}> <button className="btn btn-dark">Download CSV File </button></CSVLink>
          </div>
        }

        {/* {
          <div className="my-3">
            <button className="btn btn-dark" onClick={handleFeedback}>View All Feedback</button>
          </div>
        } */}

      </div>


      {
        data?.length > 0 ?
          <table className="table table-striped">

            <thead className="bg-dark text-light border-dark border">
              <tr>
                <th>Serial Number</th>
                <th onClick={(e) => sorting("fullName")}>Name {arrowState.fullName === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />} </th>
                <th onClick={(e) => sorting("position")}>Position {arrowState.position === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />} </th>
                <th onClick={(e) => sorting("country")}>Country {arrowState.country === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}   </th>
                <th onClick={(e) => sorting("score")}>Total Score {arrowState.score === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}   </th>
                <th onClick={(e) => sorting("questionsAttempted")}>Questions Attempted {arrowState.questionsAttempted === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}   </th>
                <th onClick={(e) => sorting("correctAnswers")}>Questions Answered Correctly {arrowState.correctAnswers === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}   </th>
                <th onClick={(e) => sorting("averageTime")}>
                  Average time taken per Question(in minutes)
                  {arrowState.averageTime === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                </th>
                <th onClick={() => sorting("accuracy")}>
                  Accuracy (percent correct of questions answered)
                  {arrowState.accuracy === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}

                </th>
                <th onClick={() => sorting("cv")}>
                  CV
                </th>
                <th onClick={() => sorting("updatedAt")}>Date {arrowState.updatedAt === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}</th>
              </tr>
            </thead>

            <tbody>
              {data?.map((val, key) => {
                return (
                  <tr key={key}>
                    <td>{(key + 1)}</td>
                    <td>
                      <NavLink to={`/questionPaper/${val.fullName}/${val.userID}`} target="_blank" rel="noopener noreferrer" className="fw-semibold text-decoration-none">
                        {val.fullName}
                      </NavLink>
                    </td>
                    <td>{val.position}</td>
                    <td>{val?.country || ""}</td>
                    <td>{val.score}</td>
                    <td>{val.questionsAttempted}</td>
                    <td>{val.correctAnswers}</td>
                    <td>{val.averageTime}</td>
                    <td>{val.accuracy}</td>
                    <td>
                      {
                        val?.file ?
                          <a href={val.file} target="_blank" rel="noopener noreferrer" className="fw-semibold text-decoration-none">
                            Click to view
                          </a>
                          :
                          <p>Not Found</p>
                      }
                    </td>
                    <td>{moment(val.updatedAt).format('MMMM Do YYYY, h:mm:ss a')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          :
          <h1>{errMsg}</h1>
      }
      <ToastContainer />
    </div>
  );
};

export default Sentry.withProfiler(UserTable);
