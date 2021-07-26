const { google } = require('googleapis');
require('dotenv').config();

// Responsible for storing events on particular dates in the google calendar.

// Provide the required configuration
const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);
const calendarId = process.env.CALENDAR_ID;

// Google calendar API settings
const SCOPES = 'https://www.googleapis.com/auth/calendar';
const calendar = google.calendar({ version: "v3" });

const auth = new google.auth.JWT(
    CREDENTIALS.client_email,
    null,
    CREDENTIALS.private_key,
    SCOPES
);

// Your TIMEOFFSET Offset
const TIMEOFFSET = '-07:00';

// Get date-time string for calender
const dateTimeForCalendar = (dateValue) => {

    let date = new Date(dateValue);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    if (month < 10) {
        month = `0${month}`;
    }
    let day = date.getDate();
    if (day < 10) {
        day = `0${day}`;
    }
    let hour = date.getHours();
    if (hour < 10) {
        hour = `0${hour}`;
    }
    let minute = date.getMinutes();
    if (minute < 10) {
        minute = `0${minute}`;
    }

    let newDateTime = `${year}-${month}-${day}T${hour}:${minute}:00.000${TIMEOFFSET}`;

    let event = new Date(Date.parse(newDateTime));

    let startDate = event;
    // Delay in end time is 1
    let endDate = new Date(new Date(startDate).setHours(startDate.getHours() + 1));

    return {
        'start': startDate,
        'end': endDate
    }
};

// Insert new event to Google Calendar

const insertCalendarEvent = async (date, title, description) => {

    let dateTime = dateTimeForCalendar(date);
    let event = {
        'summary': title,
        'description': description,
        'start': {
            'dateTime': dateTime['start'],
            'timeZone': 'America/Los_Angeles'
        },
        'end': {
            'dateTime': dateTime['end'],
            'timeZone': 'America/Los_Angeles'
        }
    };

    try {
        let response = await calendar.events.insert({
            auth: auth,
            calendarId: calendarId,
            resource: event
        });

        if (response['status'] == 200 && response['statusText'] === 'OK') {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.log(`Error at insertEvent --> ${error}`);
        return true;
    }
};


exports.insertCalendarEvent = insertCalendarEvent;