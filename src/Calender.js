import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import {  Typography, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useState , useEffect } from 'react';

export default function Calender() {
    const [selectedDate, setSelectedDate] = React.useState(null);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    const fetchEvents = async (month, day) => {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get(`https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/births/${month}/${day}`);
          console.log(response)
          setEvents(response.data.births || []);
        } catch (err) {
          setError('Failed to fetch events');
        } finally {
          setLoading(false);
        }
      };
    
      useEffect(() => {
        if (selectedDate) {
          const month = selectedDate.$M + 1;
          const day = selectedDate.$D;
          fetchEvents(month, day);
        }
      }, [selectedDate]);
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div id='wrapper'>
      <StaticDatePicker orientation="landscape" onChange={(date) => setSelectedDate(date)} />
      <h1>Birthdays On Selected day</h1>
      {loading && <CircularProgress />}
        {error && <Typography color="error">{error}</Typography>}
        <div>
          {events.map((event, index) => (
            <Typography key={index} variant="body1">
              {event.text}
            </Typography>
          ))}
        </div>
        </div>
    </LocalizationProvider>
  );
}