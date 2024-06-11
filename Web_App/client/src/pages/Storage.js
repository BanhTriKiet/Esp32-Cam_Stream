import React, { useEffect, useState, useRef, } from "react";
import { useNavigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import VideoDuration from "../component/VideoDuration";
// import Box from '@mui/material/Box';
import "./style.css";
import axios from "axios";

export default function About() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()));
  const [endDate, setEndDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()));
  const [startHour, setStartHour] = useState(new Date().getHours());
  const [endHour, setEndHour] = useState(new Date().getHours());
  const [startMinute, setStartMinute] = useState(new Date().getMinutes());
  const [endMinute, setEndMinute] = useState(new Date().getMinutes());
  const [durations, setDurations] = useState({})

  const getData = async () => {
    const { data } = await axios.get('/videos');
    setData(data);
  }

  const handelOnPreviewClick = (videoName, videoSource, duration) => {
    navigate("/video", {
      state: {
        videoName: videoName,
        videoSource: videoSource,
        duration: duration,
      }
    });
  };

  const handleOnSearch = async () => {
    const fromDate = startDate.toLocaleDateString().split("/");
    const toDate = endDate.toLocaleDateString().split("/");
    const fromTime = (new Date(fromDate[2], fromDate[0] - 1, fromDate[1], startHour, startMinute).getTime()) / 60000;
    const toTime = (new Date(toDate[2], toDate[0] - 1, toDate[1], endHour, endMinute).getTime()) / 60000;
    const { data } = await axios.get(`/search/${fromTime}/${toTime}`)
    setData(data);
  };

  const handelOnCancel = async () => {
    getData();
  };

  const handleOnDurationChange = (videoSource, duration) => {
    setDurations((prevDurations) => ({
      ...prevDurations,
      [videoSource]: duration,
    }));
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      <div style={{ display: "flex", flexDirection: 'row', }}>
        <div style={{ display: "flex", flexDirection: 'column', }}>
          <span>From: </span>
          <span>To: </span>
        </div>
        <div style={{ display: "flex", flexDirection: 'column', }}>
          <div>
            <input value={startHour} onChange={(event) => { setStartHour(event.target.value) }} />
            <input value={startMinute} onChange={(event) => { setStartMinute(event.target.value) }} />
            <DatePicker selected={startDate} onChange={(date) => { setStartDate(date) }} />
          </div>
          <div>
            <input value={endHour} onChange={(event) => { setEndHour(event.target.value) }} />
            <input value={endMinute} onChange={(event) => { setEndMinute(event.target.value) }} />
            <DatePicker selected={endDate} onChange={(date) => { setEndDate(date) }} />
          </div>
        </div>
      </div>
      <button onClick={handleOnSearch}>Search</button>
      <button onClick={handelOnCancel}>Cancel</button>
      <div>
        {
          data.map((item, i) => {
            return (
              < button key={i}
                onClick={() => handelOnPreviewClick(item.videoName, item.videoSource, durations[item.videoSource])}
              >

                <img src={item.thumbnail} />
                <VideoDuration videoUrl={item.videoSource} videoDuration={(duration) => handleOnDurationChange(item.videoSource, duration)} />
                <p>{item.videoName}</p>
              </button>
            )
          })
        }
      </div>
    </div >
  )
}