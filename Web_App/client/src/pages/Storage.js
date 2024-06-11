import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import Box from '@mui/material/Box';
import "./style.css";
import axios from "axios";

export default function About() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState(
    new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate()
    )
  );
  const [endDate, setEndDate] = useState(
    new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate()
    )
  );
  const [startHour, setStartHour] = useState(new Date().getHours());
  const [endHour, setEndHour] = useState(new Date().getHours());
  const [startMinute, setStartMinute] = useState(new Date().getMinutes());
  const [endMinute, setEndMinute] = useState(new Date().getMinutes());

  const getData = async () => {
    const { data } = await axios.get("/videos");
    setData(data);
  };
  const onPreviewClickHandler = (videoName, videoSource) => {
    navigate("/video", {
      state: {
        videoName: videoName,
        videoSource: videoSource,
      },
    });
  };
  const handleOnSearch = async () => {
    const fromDate = startDate.toLocaleDateString().split("/");
    const toDate = endDate.toLocaleDateString().split("/");
    const fromTime =
      new Date(
        fromDate[2],
        fromDate[0] - 1,
        fromDate[1],
        startHour,
        startMinute
      ).getTime() / 60000;
    const toTime =
      new Date(
        toDate[2],
        toDate[0] - 1,
        toDate[1],
        endHour,
        endMinute
      ).getTime() / 60000;
    const { data } = await axios.get(`/search/${fromTime}/${toTime}`);
    setData(data);
  };
  const handelOnCancel = async () => {
    getData();
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      <div className="searchContainer">
        {/* <span>From: </span> */}
        <div className="searchBox">
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span>From: </span>
          </div>
          <input
            className="inputBox"
            value={startHour}
            onChange={(event) => {
              setStartHour(event.target.value);
            }}
          />
          <input
            className="inputBox"
            value={startMinute}
            onChange={(event) => {
              setStartMinute(event.target.value);
            }}
          />
          <DatePicker
            className="inputBox"
            selected={startDate}
            onChange={(date) => {
              setStartDate(date);
            }}
          />
        </div>

        <div className="searchBox">
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span>To: </span>
          </div>
          <input
            className="inputBox"
            value={endHour}
            onChange={(event) => {
              setEndHour(event.target.value);
            }}
          />
          <input
            className="inputBox"
            value={endMinute}
            onChange={(event) => {
              setEndMinute(event.target.value);
            }}
          />
          <DatePicker
            className="inputBox"
            selected={endDate}
            onChange={(date) => {
              setEndDate(date);
            }}
          />
        </div>

        <button onClick={handleOnSearch} className="searchButton">
          <svg className="searchIcon">
            <path d="M11.742 10.344a6.5 6.5 0 10-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 001.415-1.414l-3.85-3.85a1.007 1.007 0 00-.115-.1zM12 6.5a5.5 5.5 0 11-11 0 5.5 5.5 0 0111 0z" />
          </svg>
          Search
        </button>
      </div>

      <button onClick={handelOnCancel} className="listAllButton">
        <svg className="seeIcon">
          <path d="M15 12c0 1.654-1.346 3-3 3s-3-1.346-3-3 1.346-3 3-3 3 1.346 3 3zm9-.449s-4.252 8.449-11.985 8.449c-7.18 0-12.015-8.449-12.015-8.449s4.446-7.551 12.015-7.551c7.694 0 11.985 7.551 11.985 7.551zm-7 .449c0-2.757-2.243-5-5-5s-5 2.243-5 5 2.243 5 5 5 5-2.243 5-5z" />
        </svg>
        List all video
      </button>
      <div className="videoContainer">
        {data.map((item, i) => (
          <button
            className="videoItem"
            key={i}
            onClick={() =>
              onPreviewClickHandler(item.videoName, item.videoSource)
            }
          >
            <img src={item.thumbnail} />
            <p>{item.videoName}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
