import React from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import '../../assets/Css/Calendar.css';

const CalendarUser = () => {
    
  return (
    <div className="flex fixed w-80 ml-[90px]   items-center justify-center">
      <div className="bg-white p-6 rounded-xl ">
        <Calendar 
          onChange={date => alert(date)}
          value={new Date()}
          className="calendar-custom"
        />
      </div>
    </div>
  )
}

export default CalendarUser