import React, { useEffect } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import '../../assets/Css/Calendar.css';
import Aos from 'aos'
import '../../../node_modules/aos/dist/aos.css'

const CalendarUser = () => {
  useEffect(() => {
    Aos.init()
  })

  const handleChange = async (date)=>{
    // alert(date)
  }

  return (
    <div className="flex fixed w-80 ml-[130px]   items-center justify-center  " data-aos="zoom-in">
      <div className="bg-white p-6 rounded-xl ">
        <Calendar
          onChange={date => handleChange(date)}
          value={new Date()}
          className="calendar-custom"
        />
      </div>
    </div>
  )
}

export default CalendarUser