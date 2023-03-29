import { Calendar } from '@/components/Calendar'
import { api } from '@/lib/axios'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import {
  Container,
  TimePicker,
  TimePickerHeader,
  TimePickerItem,
  TimePickerList,
} from './styles'

interface Availability {
  possibleTimes: number[]
  availableTimes: number[]
}

export function CalendarStep() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [availability, setAvailability] = useState<Availability | null>(null)

  const router = useRouter()

  const { username } = router.query

  const isDateSelected = !!selectedDate

  const weekDay = selectedDate ? dayjs(selectedDate).format('dddd') : null
  const describeDate = selectedDate
    ? dayjs(selectedDate).format('DD[ de ]MMMM')
    : null

  const getAvailableTimes = async () => {
    const resp = await api.get(`users/${username}/availability`, {
      params: {
        date: dayjs(selectedDate).format('YYYY-MM-DD'),
      },
    })

    console.log(resp.data)

    setAvailability(resp.data)
  }

  useEffect(() => {
    if (!selectedDate) {
      return
    }
    getAvailableTimes()
  }, [selectedDate, username])
  return (
    <Container isTimePickerOpen={isDateSelected}>
      <Calendar selectedDate={selectedDate} onDateSelected={setSelectedDate} />

      {isDateSelected && (
        <TimePicker>
          <TimePickerHeader>
            {weekDay} <span>{describeDate}</span>
          </TimePickerHeader>

          <TimePickerList>
            {availability?.possibleTimes.map((time) => {
              return (
                <TimePickerItem
                  key={time}
                  disabled={!availability.availableTimes.includes(time)}
                >
                  {String(time).padStart(2, '0')}:00h
                </TimePickerItem>
              )
            })}
          </TimePickerList>
        </TimePicker>
      )}
    </Container>
  )
}
