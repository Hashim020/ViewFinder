import React, { useEffect } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import '../../assets/Css/Calendar.css';
import Aos from 'aos'
import '../../../node_modules/aos/dist/aos.css'

const CalendarUser = () => {
    useEffect(()=>{
      Aos.init()
    })
  return (
    <div className="flex fixed w-80 ml-[90px]   items-center justify-center  " data-aos="fade-right">
      <div className="bg-white p-6 rounded-xl ">
        <Calendar 
          // onChange={date => alert(date)}
          value={new Date()}
          className="calendar-custom"
        />
      </div>
    </div>
  )
}

export default CalendarUser