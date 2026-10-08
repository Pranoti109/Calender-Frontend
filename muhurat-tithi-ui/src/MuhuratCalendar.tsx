import { useState, useEffect } from 'react'
import './App.css'

const locations = {
  Maharashtra: ['Pune', 'Mumbai', 'Nagpur', 'Nashik'],
  'Andhra Pradesh': ['Vijayawada'],
  'Arunachal Pradesh': ['Itanagar'],
  Assam: ['Dispur'],
  Bihar: ['Patna'],
  Chhattisgarh: ['Raipur'],
  Goa: ['Panaji'],
  Gujarat: ['Ahmedabad', 'Gandhinagar', 'Surat'],
  Haryana: ['Chandigarh'],
  'Himachal Pradesh': ['Shimla'],
  Jharkhand: ['Ranchi'],
  Karnataka: ['Bengaluru', 'Mysuru'],
  Kerala: ['Thiruvananthapuram'],
  'Madhya Pradesh': ['Bhopal'],
  Manipur: ['Imphal'],
  Meghalaya: ['Shillong'],
  Mizoram: ['Aizawl'],
  Nagaland: ['Kohima'],
  Odisha: ['Bhubaneswar'],
  Punjab: ['Chandigarh'],
  Rajasthan: ['Jaipur'],
  Sikkim: ['Gangtok'],
  'Tamil Nadu': ['Chennai'],
  Telangana: ['Hyderabad'],
  Tripura: ['Agartala'],
  'Uttar Pradesh': ['Lucknow'],
  Uttarakhand: ['Dehradun'],
  'West Bengal': ['Kolkata'],
  'Andaman and Nicobar Islands': ['Sri Vijaya Puram'],
  Chandigarh: ['Chandigarh'],
  'Dadra and Nagar Haveli and Daman and Diu': ['Daman'],
  Delhi: ['New Delhi'],
  'Jammu and Kashmir': ['Srinagar', 'Jammu'],
  Ladakh: ['Leh'],
  Lakshadweep: ['Kavaratti'],
  Puducherry: ['Puducherry'],
}






function MuhuratCalendar() {
  const today = new Date()

  const [selectedDay, setSelectedDay] = useState(today.getDate())
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())

  const [selectedState, setSelectedState] = useState('Maharashtra')
  const [selectedCity, setSelectedCity] = useState('Pune')


  const [apiMuhurats, setApiMuhurats] = useState<any[]>([])
  const [festivals, setFestivals] = useState<any[]>([])
  const [apiPanchang, setApiPanchang] = useState<any[]>([])

  useEffect(() => {
    const fetchMuhurats = async () => {
      try {
        const params = new URLSearchParams({
          year: String(currentYear),
          month: String(currentMonth + 1),
          
        })

        const response = await fetch(
          `http://localhost:8080/api/muhurats?${params}`
        )

        if (!response.ok) {
          throw new Error(`Backend error: ${response.status}`)
        }

        const data = await response.json()

        setApiMuhurats(
          Array.isArray(data?.muhurats)
            ? data.muhurats
            : []
        )
      } catch (error) {
        console.error('Failed to fetch Vivah Muhurats:', error)
        setApiMuhurats([])
      }
    }

    fetchMuhurats()
  }, [
    currentYear,
    currentMonth,
    
  ])
 useEffect(() => {
  const fetchPanchang = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/muhurats/panchang?year=${currentYear}&month=${currentMonth + 1}`
      )

      if (!response.ok) {
        throw new Error(`Panchang API error: ${response.status}`)
      }

      const data = await response.json()

      setApiPanchang(
        Array.isArray(data?.days)
          ? data.days
          : []
      )
    } catch (error) {
      console.error('Failed to fetch Panchang:', error)
      setApiPanchang([])
    }
  }

  fetchPanchang()
}, [currentYear, currentMonth])
  useEffect(() => {
    const fetchFestivals = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/festivals?year=${currentYear}`
        )

        if (!response.ok) {
          throw new Error(
            `Festival API error: ${response.status}`
          )
        }

        const data = await response.json()

        console.log('Festival API:', data)

        const festivalList =
          Array.isArray(data?.festivals)
            ? data.festivals
            : Array.isArray(data?.data)
              ? data.data
              : Array.isArray(data)
                ? data
                : []

        console.log('Festival List:', festivalList)

        setFestivals(festivalList)
      } catch (error) {
        console.error('Failed to fetch festivals:', error)
        setFestivals([])
      }
    }

    fetchFestivals()
  }, [currentYear])

  const getFestivalDate = (festival: any) => {
    return (
      festival?.date ??
      festival?.[`date_${currentYear}`] ??
      festival?.festivalDate ??
      festival?.eventDate ??
      festival?.observanceDate ??
      ''
    )
  }

  const getFestivalName = (festival: any) => {
    return (
      festival?.name ??
      festival?.festival ??
      festival?.title ??
      festival?.displayName ??
      festival?.event ??
      'Festival'
    )
  }

  const getFestivalForDate = (dateKey: string) => {
    return festivals.find((festival: any) => {
      const festivalDate = getFestivalDate(festival)

      return (
        typeof festivalDate === 'string' &&
        festivalDate.slice(0, 10) === dateKey
      )
    })
  }

  const monthFestivals = festivals.filter((festival: any) => {
    const date = getFestivalDate(festival)

    if (!date) return false

    const festivalDate = String(date).slice(0, 10)

    return festivalDate.startsWith(
      `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`
    )
  })

  

  const selectedDate = new Date(
    currentYear,
    currentMonth,
    selectedDay
  )

  const selectedDateKey = [
    currentYear,
    String(currentMonth + 1).padStart(2, '0'),
    String(selectedDay).padStart(2, '0'),
  ].join('-')
       const selectedMuhurat = apiMuhurats.find(
  (muhurat: any) => muhurat.date === selectedDateKey
)
 const getPanchangForDate = (date: Date) => {
  const dateKey = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-')

  return apiPanchang.find(
    (day: any) => day.date === dateKey
  )
}
  const selectedFestival = festivals.find((festival: any) => {
    const festivalDate = getFestivalDate(festival)

    return (
      typeof festivalDate === 'string' &&
      festivalDate.slice(0, 10) === selectedDateKey
    )
  })

  const panchang = getPanchangForDate(selectedDate)

  


  return (

    <div className="page">

      <header className="navbar">

        <div className="brand">

          <div className="brand-icon">♧</div>

          <span>

            <strong>BookMy</strong><b>Hall</b>

          </span>

        </div>

        <nav>

          <a>Home</a>

          <a>Browse Venues</a>

          <a>✨ AI Planner</a>

          <a className="active">🗓️ Muhurat & Tithi</a>

          <a>📢 Advertise</a>

          <a>How It Works</a>

        </nav>

        <div className="nav-right">

          <button className="sign-in">Sign In</button>

          <button className="menu">☰</button>

        </div>

      </header>

      <section className="hero-section">

        <div className="tag">✧ &nbsp; HINDU PANCHANG & TITHI</div>

        <h1>

          Auspicious <span>Vivah Muhurat</span> & Tithi Calendar

        </h1>

        <p>

          Select the most auspicious dates for your wedding, engagement,

          and celebrations with complete Hindu Panchang details.

        </p>

      </section>

      <main className="content">

        <section className="calendar-card">

            <div className="location-selector">

  <select

    value={selectedState}

    onChange={(e) => {

      const state = e.target.value

      setSelectedState(state)

      const firstCity =
  locations[state as keyof typeof locations][0]

      setSelectedCity(firstCity)

    }}

  >

    {Object.keys(locations).map((state) => (

      <option key={state} value={state}>

        {state}

      </option>

    ))}

  </select>

  <select

    value={selectedCity}

    onChange={(e) => setSelectedCity(e.target.value)}

  >

    {locations[selectedState as keyof typeof locations].map((city) => (

      <option key={city} value={city}>

        {city}

      </option>

    ))}

  </select>

</div>

          <div className="calendar-header">

            <h2>

  ▣ &nbsp;

  {new Date(currentYear, currentMonth).toLocaleDateString('en-US', {

    month: 'long',

    year: 'numeric',

  })}

</h2>

            <div className="calendar-actions">

  <button

    onClick={() => {

      if (currentMonth === 0) {

        setCurrentMonth(11)

        setCurrentYear(currentYear - 1)

      } else {

        setCurrentMonth(currentMonth - 1)

      }

      setSelectedDay(1)

    }}

  >

    ‹

  </button>

  <button

  className="today"

  onClick={() => {

    const today = new Date()

    setCurrentMonth(today.getMonth())

    setCurrentYear(today.getFullYear())

    setSelectedDay(today.getDate())

  }}

>

  Today

</button>

  <button

    onClick={() => {

      if (currentMonth === 11) {

        setCurrentMonth(0)

        setCurrentYear(currentYear + 1)

      } else {

        setCurrentMonth(currentMonth + 1)

      }

      setSelectedDay(1)

    }}

  >

    ›

  </button>

</div>

          </div>

          <div className="weekdays">

            <span className="sunday">Sun</span>

            <span>Mon</span>

            <span>Tue</span>

            <span>Wed</span>

            <span>Thu</span>

            <span>Fri</span>

            <span>Sat</span>

          </div>

          <div className="calendar-grid">

           {Array.from(

  { length: new Date(currentYear, currentMonth, 1).getDay() },

  (_, index) => (

    <div key={`empty-${index}`} className="date-box muted"></div>

  )

)}

{Array.from(

  { length: new Date(currentYear, currentMonth + 1, 0).getDate() },

  (_, index) => {

    const day = index + 1

    const date = new Date(currentYear, currentMonth, day)

    const dayPanchang = getPanchangForDate(date)

const isSaturday = date.getDay() === 6
const isSunday = date.getDay() === 0

const tithi = dayPanchang?.tithiName ?? ''
const nakshatra = dayPanchang?.nakshatra ?? ''
    const dateKey = [

  currentYear,

  String(currentMonth + 1).padStart(2, '0'),

  String(day).padStart(2, '0'),

].join('-')

const isShubh = apiMuhurats.some(

  (muhurat) => muhurat.date === dateKey

)
const festival = getFestivalForDate(dateKey)

const festivalName =
  festival?.name ??
  festival?.festival ??
  festival?.title ??
  festival?.displayName ??
  festival?.event ??
  ''

    return (

      <button

        key={day}

        className={`date-box
    ${selectedDay === day ? 'selected' : ''}
    ${isShubh ? 'shubh-muhurat' : ''}
    ${isSaturday ? 'saturday' : ''}
    ${isSunday ? 'sunday' : ''}
    ${festivalName ? 'festival-day' : ''}
  `}

        onClick={() => setSelectedDay(day)}

        title={`${tithi} • ${nakshatra}`}

      >

        <strong>{day}</strong>

        <small>{tithi}</small>

        {isShubh && (

          <span className="shubh-label">

            💍 Shubh

          </span>

        )}
        {festivalName && (
  <span className="festival-label" title={festivalName}>
     {festivalName}
  </span>
)}

      </button>

    )

  }

)}

          </div>

          <div className="legend">

            <span><i className="legend-a">◉</i> Shubh Vivah Muhurat</span>

            <span><i className="legend-b"></i> Selected Date</span>

            <span><i className="legend-c">●</i> Major Festival</span>

          </div>

          <div className="details-card">

            <div className="details-heading">

              <div>

                <p>HINDU PANCHANG & TITHI DETAILS</p>

                <h2>

  {selectedDate.toLocaleDateString('en-US', {

    weekday: 'long',

    month: 'long',

    day: '2-digit',

    year: 'numeric',

  })}

</h2>

              </div>
       
             <span className="day-badge">
  {selectedFestival
    ? 'Festival'
    : selectedMuhurat
      ? 'Shubh Vivah Muhurat'
      : 'Regular Day'}
</span>

            </div>

            <div className="details-grid">

              <div className="detail-box">

                <label>Tithi (तिथि)</label>

                <strong>{panchang?.tithiName ?? 'N/A'}</strong>

                <small>{panchang?.paksha ?? ''}</small>

              </div>

              <div className="detail-box">

                <label>Nakshatra (नक्षत्र)</label>

                <strong>{panchang?.nakshatra ?? 'N/A'}</strong>

                <small className="green">Nakshatra</small>

              </div>

              <div className="detail-box">

  <label>Shubh Muhurat Timing</label>

 {selectedMuhurat?.abhijit?.start && selectedMuhurat?.abhijit?.end ? (
  <>
    <strong>
      {new Date(selectedMuhurat.abhijit.start).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })}
      {' – '}
      {new Date(selectedMuhurat.abhijit.end).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })}
    </strong>

    <small className="orange">
      Abhijit Muhurat
    </small>
  </>
) : (
  <>
    <strong>No Shubh Timing</strong>

    <small className="orange">
      No auspicious timing found
    </small>
  </>
)}

</div>

              <div className="detail-box">

                <label>Festival / Occasion</label>

                {selectedFestival ? (
  <>
    <strong>
      {selectedFestival.name ??
        selectedFestival.festival ??
        selectedFestival.title ??
        selectedFestival.displayName ??
        selectedFestival.event ??
        'Festival'}
    </strong>

    <small className="purple">
      Major Festival
    </small>
  </>
) : (
  <>
    <strong>No Major Festival</strong>
    <small className="purple">
      No festival on this date
    </small>
  </>
)}

              </div>

             

  

            </div>

          </div>

        </section>

        <aside className="sidebar">

  <div className="key-muhurats-card">

    <div className="key-muhurats-header">
      <div className="key-muhurats-icon"></div>

      <div>
        <h3>Key Muhurats & Festivals</h3>
        <p>Important dates for this month</p>
      </div>
    </div>

  </div>

  <div className="muhurat-list">

  {/* SHUBH MUHURATS */}
  {apiMuhurats.map((muhurat: any, index: number) => {

    const muhuratDate = muhurat?.date

    if (!muhuratDate) return null

    const date = new Date(`${muhuratDate}T00:00:00`)

    const day = date.getDate()

    const monthName = date.toLocaleDateString('en-IN', {
      month: 'short',
    })

    const year = date.getFullYear()

    const dayPanchang = getPanchangForDate(date)

    const tithi = dayPanchang?.tithiName ?? ''

    const nakshatra = dayPanchang?.nakshatra ?? ''

    return (
      <div
        className="muhurat-item"
        key={`muhurat-${index}`}
      >

        <div className="muhurat-top">

          <strong>
            {day} {monthName} {year}
          </strong>

          <span>Shubh</span>

        </div>

        <p>
          <b>Tithi:</b> {tithi}
          {' · '}
          <b>Nakshatra:</b> {nakshatra}
        </p>

      </div>
    )
  })}


  {/* FESTIVALS */}
  {monthFestivals.map((festival: any, index: number) => {

    const festivalDate = getFestivalDate(festival)

    if (!festivalDate) return null

    const date = new Date(
      `${String(festivalDate).slice(0, 10)}T00:00:00`
    )

    const day = date.getDate()

    const monthName = date.toLocaleDateString('en-IN', {
      month: 'short',
    })

    const year = date.getFullYear()

    const festivalName = getFestivalName(festival)

    return (
      <div
        className="muhurat-item festival-muhurat-item"
        key={`festival-${index}`}
      >

        <div className="muhurat-top">

          <strong>
            {day} {monthName} {year}
          </strong>

          <span className="festival-badge">
            Festival
          </span>

        </div>

        <p className="festival-name">
           {festivalName}
        </p>

      </div>
    )
  })}


  {/* NO DATA */}
  {apiMuhurats.length === 0 &&
    monthFestivals.length === 0 && (
      <div className="no-muhurat-data">
        No Shubh Muhurat or Festival for this month
      </div>
    )}

</div>

  <button className="book-button">
    ⌕ &nbsp; Book Venues on Muhurat Dates
  </button>

  <div className="info-card">

    <h2>☼ &nbsp; Understanding Muhurat & Tithi</h2>

    <p>
      <b>Tithi (तिथि):</b> The lunar day in the Hindu calendar.
      Shukla Paksha (waxing moon) is generally preferred for
      auspicious celebrations.
    </p>

    <p>
      <b>Nakshatra (नक्षत्र):</b> Lunar mansion constellations.
      Rohini, Mrigashirsha, and Uttara Phalguni are celebrated
      as prime wedding nakshatras.
    </p>

  </div>

</aside>

      </main>

  </div>

  )

}

export default MuhuratCalendar

