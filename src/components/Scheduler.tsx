"use client"

import { useEffect, useMemo, useState } from "react"
import { ChevronLeft, ChevronRight, Clock, CalendarIcon } from "lucide-react"

export interface SchedulerProps {
  value: Date | null
  onChange: (val: Date | null) => void
  label?: string
  timeFormat?: "12h" | "24h"
}

function formatTime(date: Date, format: "12h" | "24h" = "24h") {
  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: format === "12h",
  })
}

function formatDate(date: Date) {
  return date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })
}

function clamp(date: Date, min: Date, max: Date) {
  if (date < min) return min
  if (date > max) return max
  return date
}

function addMinutes(base: Date, minutes: number) {
  return new Date(base.getTime() + minutes * 60_000)
}

function setTimeOfDay(base: Date, hours: number, minutes: number) {
  const d = new Date(base)
  d.setHours(hours, minutes, 0, 0)
  return d
}

function toDateInputValue(date: Date) {
  const y = date.getFullYear()
  const m = (date.getMonth() + 1).toString().padStart(2, "0")
  const d = date.getDate().toString().padStart(2, "0")
  return `${y}-${m}-${d}`
}

function fromDateInputValue(val: string) {
  const [y, m, d] = val.split("-").map(Number)
  const date = new Date()
  date.setFullYear(y)
  date.setMonth((m || 1) - 1)
  date.setDate(d || 1)
  date.setHours(0, 0, 0, 0)
  return date
}

function toTimeInputValue(date: Date) {
  const hh = date.getHours().toString().padStart(2, "0")
  const mm = date.getMinutes().toString().padStart(2, "0")
  return `${hh}:${mm}`
}

function fromTimeInputValue(val: string) {
  const [h, m] = val.split(":").map((n) => Number(n || 0))
  const hours = Number.isFinite(h) ? h : 0
  const minutes = Number.isFinite(m) ? m : 0
  return { hours, minutes }
}

function Calendar({
  selectedDate,
  onDateSelect,
  minDate,
  maxDate,
}: {
  selectedDate: Date
  onDateSelect: (date: Date) => void
  minDate: Date
  maxDate: Date
}) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate.getMonth())
  const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear())

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay()

  const days = []

  // Empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null)
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day)
  }

  const isDateInRange = (day: number) => {
    const date = new Date(currentYear, currentMonth, day)
    return date >= minDate && date <= maxDate
  }

  const isSelectedDate = (day: number) => {
    const date = new Date(currentYear, currentMonth, day)
    return date.toDateString() === selectedDate.toDateString()
  }

  const isToday = (day: number) => {
    const date = new Date(currentYear, currentMonth, day)
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const handleDateClick = (day: number) => {
    if (isDateInRange(day)) {
      const newDate = new Date(currentYear, currentMonth, day)
      onDateSelect(newDate)
    }
  }

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-xl p-3 sm:p-4 md:p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <button
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200"
          type="button"
        >
          <ChevronLeft className="w-5 h-5 text-slate-600" />
        </button>
        <h3 className="font-semibold text-base sm:text-lg text-slate-800">
          {monthNames[currentMonth]} {currentYear}
        </h3>
        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200"
          type="button"
        >
          <ChevronRight className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-3 sm:mb-4">
        {dayNames.map((day) => (
          <div key={day} className="text-xs sm:text-sm font-semibold text-slate-500 text-center p-2 sm:p-3">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => (
          <div key={index} className="aspect-square">
            {day && (
              <button
                type="button"
                onClick={() => handleDateClick(day)}
                disabled={!isDateInRange(day)}
                className={`w-full h-full text-sm font-medium rounded-lg transition-all duration-200 ${isSelectedDate(day)
                    ? "bg-blue-500 text-white shadow-lg scale-105 hover:bg-blue-600"
                    : isToday(day) && isDateInRange(day)
                      ? "bg-blue-100 text-blue-700 border-2 border-blue-300 hover:bg-blue-200"
                      : isDateInRange(day)
                        ? "text-slate-700 hover:bg-slate-100 hover:scale-105"
                        : "text-slate-300 cursor-not-allowed"
                  }`}
              >
                {day}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function ScrollableTimePicker({
  selectedTime,
  onTimeSelect,
  minTime,
  maxTime,
  timeFormat,
  onChangeTimeFormat,
}: {
  selectedTime: string
  onTimeSelect: (time: string) => void
  minTime?: string
  maxTime?: string
  timeFormat: "12h" | "24h"
  onChangeTimeFormat: (fmt: "12h" | "24h") => void
}) {
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"))
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"))

  const [selectedHour, selectedMinute] = selectedTime.split(":")

  const isTimeValid = (hour: string, minute: string) => {
    const timeString = `${hour}:${minute}`
    if (minTime && timeString < minTime) return false
    if (maxTime && timeString > maxTime) return false
    return true
  }

  const handleTimeChange = (hour: string, minute: string) => {
    if (isTimeValid(hour, minute)) {
      onTimeSelect(`${hour}:${minute}`)
    }
  }

  const displayHourLabel = (hour: string) => {
    if (timeFormat === "24h") return hour
    const h = Number(hour)
    const suffix = h < 12 ? "AM" : "PM"
    const hour12 = h % 12 === 0 ? 12 : h % 12
    return `${hour12} ${suffix}`
  }

  return (
    <div className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-xl p-3 sm:p-4 md:p-6 shadow-lg">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-slate-600" />
          <h4 className="font-semibold text-slate-800 text-sm sm:text-base">Select Time</h4>
        </div>

        <div
          role="group"
          aria-label="Time format"
          className="inline-flex rounded-lg border border-slate-200 overflow-hidden"
        >
          <button
            type="button"
            aria-pressed={timeFormat === "24h"}
            onClick={() => onChangeTimeFormat("24h")}
            className={`px-2.5 py-1.5 text-xs sm:text-sm font-medium transition-colors ${timeFormat === "24h" ? "bg-blue-600 text-white" : "bg-white text-slate-700 hover:bg-slate-100"
              }`}
          >
            24h
          </button>
          <button
            type="button"
            aria-pressed={timeFormat === "12h"}
            onClick={() => onChangeTimeFormat("12h")}
            className={`px-2.5 py-1.5 text-xs sm:text-sm font-medium transition-colors ${timeFormat === "12h" ? "bg-blue-600 text-white" : "bg-white text-slate-700 hover:bg-slate-100"
              }`}
          >
            12h
          </button>
        </div>
      </div>

      <div className="flex gap-4 sm:gap-6">
        <div className="flex-1">
          <label className="block text-sm font-semibold text-slate-600 mb-2 sm:mb-3">Hour</label>
          <div className="h-32 sm:h-40 overflow-y-auto border border-slate-200 rounded-lg bg-white shadow-inner">
            {hours.map((hour) => (
              <button
                key={hour}
                type="button"
                onClick={() => handleTimeChange(hour, selectedMinute)}
                disabled={!isTimeValid(hour, selectedMinute)}
                className={`w-full px-3 py-2 sm:px-4 sm:py-3 text-sm font-medium text-left transition-all duration-200 ${hour === selectedHour
                    ? "bg-blue-500 text-white shadow-md"
                    : isTimeValid(hour, selectedMinute)
                      ? "text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                      : "text-slate-300 cursor-not-allowed"
                  }`}
              >
                {displayHourLabel(hour)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-semibold text-slate-600 mb-2 sm:mb-3">Minute</label>
          <div className="h-32 sm:h-40 overflow-y-auto border border-slate-200 rounded-lg bg-white shadow-inner">
            {minutes.map((minute) => (
              <button
                type="button"
                key={minute}
                onClick={() => handleTimeChange(selectedHour, minute)}
                disabled={!isTimeValid(selectedHour, minute)}
                className={`w-full px-3 py-2 sm:px-4 sm:py-3 text-sm font-medium text-left transition-all duration-200 ${minute === selectedMinute
                    ? "bg-blue-500 text-white shadow-md"
                    : isTimeValid(selectedHour, minute)
                      ? "text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                      : "text-slate-300 cursor-not-allowed"
                  }`}
              >
                {minute}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Scheduler({ value, onChange, label = "Schedule", timeFormat }: SchedulerProps) {
  // freeze "now" at mount so the window doesn't drift during interaction
  const [now, setNow] = useState(() => new Date())
  const [currentFormat, setCurrentFormat] = useState<"12h" | "24h">(timeFormat ?? "24h")

  useEffect(() => {
    const tick = () => setNow(new Date())

    // align to next minute boundary, then run every 60s
    const msToNextMinute = 60000 - (Date.now() % 60000)
    const start = setTimeout(() => {
      tick()
      const id = setInterval(tick, 60000)
        // cleanup will clear this interval
        ; (window as any).__tickId = id
    }, msToNextMinute)

    return () => {
      clearTimeout(start)
      if ((window as any).__tickId) clearInterval((window as any).__tickId)
    }
  }, [])

  const minDateTime = useMemo(() => new Date(now.getTime() + 5 * 60 * 1000), [now])

  // Optional: auto-clamp if current value falls behind the moving window
  useEffect(() => {
    if (value && value < minDateTime) onChange(minDateTime)
  }, [value, minDateTime, onChange])

  const minDate = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return today
  }, [])
  const maxDate = useMemo(() => addMinutes(now, 7 * 24 * 60), [now])

  const [selectedDay, setSelectedDay] = useState<string>(() => toDateInputValue(minDateTime))
  const [note, setNote] = useState<string>("")

  useEffect(() => {
    // Initialize/clamp incoming value
    if (!value) {
      onChange(minDateTime)
      setSelectedDay(toDateInputValue(minDateTime))
    } else {
      const clamped = clamp(value, minDateTime, maxDate)
      if (clamped.getTime() !== value.getTime()) {
        setNote("Adjusted to the allowed window (5 minutes ahead minimum).")
      }
      onChange(clamped)
      setSelectedDay(toDateInputValue(clamped))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const quickOptions = useMemo(
    () => [
      {
        key: "in5",
        label: () => `In 5 min (${formatTime(addMinutes(now, 5), currentFormat)})`,
        get: () => addMinutes(now, 5),
      },
      {
        key: "in30",
        label: () => `In 30 min (${formatTime(addMinutes(now, 30), currentFormat)})`,
        get: () => addMinutes(now, 30),
      },
      {
        key: "in60",
        label: () => `In 1 hour (${formatTime(addMinutes(now, 60), currentFormat)})`,
        get: () => addMinutes(now, 60),
      },
      {
        key: "tonight19",
        label: () => `Tonight ${formatTime(setTimeOfDay(now, 19, 0), currentFormat)}`,
        get: () => setTimeOfDay(now, 19, 0),
      },
      {
        key: "tomorrow9",
        label: () => `Tomorrow ${formatTime(setTimeOfDay(addMinutes(now, 24 * 60), 9, 0), currentFormat)}`,
        get: () => setTimeOfDay(addMinutes(now, 24 * 60), 9, 0),
      },
      {
        key: "in3d9",
        label: () => `In 3 days ${formatTime(setTimeOfDay(addMinutes(now, 3 * 24 * 60), 9, 0), currentFormat)}`,
        get: () => setTimeOfDay(addMinutes(now, 3 * 24 * 60), 9, 0),
      },
      { key: "in7d", label: () => "In 7 days", get: () => addMinutes(now, 7 * 24 * 60) },
    ],
    [now, currentFormat],
  )

  const quickPick = (target: Date) => {
    const within = clamp(target, minDateTime, maxDate)
    if (within.getTime() !== target.getTime()) {
      setNote("Adjusted to the allowed window (5 minutes ahead minimum).")
    } else {
      setNote("")
    }
    onChange(within)
    setSelectedDay(toDateInputValue(within))
  }

  const clear = () => {
    onChange(null)
    setNote("")
  }

  const onSelectDay = (date: Date) => {
    const dateString = toDateInputValue(date)
    setSelectedDay(dateString)
    setNote("")
    const current = value ?? minDateTime
    const desired = setTimeOfDay(date, current.getHours(), current.getMinutes())
    const candidate = clamp(desired, minDateTime, maxDate)
    onChange(candidate)
    setSelectedDay(toDateInputValue(candidate))
    if (candidate.getTime() !== desired.getTime()) {
      setNote("Time adjusted to be at least 5 minutes from now.")
    }
  }

  const timeValue = useMemo(() => {
    if (value && toDateInputValue(value) === selectedDay) {
      return toTimeInputValue(value)
    }
    if (selectedDay === toDateInputValue(minDateTime)) {
      return toTimeInputValue(minDateTime)
    }
    return "09:00"
  }, [value, selectedDay, minDateTime])

  const timeMin = useMemo(() => {
    const selectedDate = fromDateInputValue(selectedDay)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (selectedDate.getTime() === today.getTime()) {
      return toTimeInputValue(minDateTime)
    }
    return undefined
  }, [selectedDay, minDateTime])

  const timeMax = useMemo(() => {
    return selectedDay === toDateInputValue(maxDate) ? toTimeInputValue(maxDate) : undefined
  }, [selectedDay, maxDate])

  const onTimeChange = (val: string) => {
    const { hours, minutes } = fromTimeInputValue(val)
    const desired = setTimeOfDay(fromDateInputValue(selectedDay), hours, minutes)
    const candidate = clamp(desired, minDateTime, maxDate)
    if (candidate.getTime() !== desired.getTime()) {
      setNote("Time adjusted to be at least 5 minutes from now.")
    } else {
      setNote("")
    }
    onChange(candidate)
    setSelectedDay(toDateInputValue(candidate))
  }

  const selectedInfo = useMemo(() => {
    if (!value) return null
    const dateLabel = formatDate(value)
    const timeLabel = formatTime(value, currentFormat)
    const diffMs = value.getTime() - now.getTime()
    const diffMin = Math.max(0, Math.round(diffMs / 60_000))
    const diffHours = Math.round(diffMin / 60)
    const diffDays = Math.round(diffMin / (60 * 24))
    let rel = ""
    if (diffMin < 60) {
      rel = `in ${diffMin} min`
    } else if (diffHours < 24) {
      rel = `in ${diffHours} hour${diffHours === 1 ? "" : "s"}`
    } else {
      rel = `in ${diffDays} day${diffDays === 1 ? "" : "s"}`
    }
    return { dateLabel, timeLabel, rel }
  }, [value, now, currentFormat])

  return (
    <div className="w-full max-w-md sm:max-w-2xl lg:max-w-5xl rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4 sm:p-6 lg:p-8 mt-3">
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
          <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          <label className="text-lg sm:text-xl font-bold text-slate-800">{label}</label>
        </div>
        <p className="text-sm text-slate-600">Pick a time at least 5 minutes from now, up to 7 days ahead.</p>
      </div>

      {/* Quick picks */}
      <div className="mb-4 sm:mb-6 flex flex-wrap gap-2 sm:gap-3">
        {quickOptions.map((q) => (
          <button
            key={q.key}
            type="button"
            onClick={() => quickPick(q.get())}
            className="rounded-full border border-slate-300 bg-white px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            {q.label()}
          </button>
        ))}
        <button
          type="button"
          onClick={clear}
          className="rounded-full border border-transparent bg-slate-200 px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-medium text-slate-600 hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all duration-200"
        >
          Clear
        </button>
      </div>

      <div className="mb-6 sm:mb-8 grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-2">
        <div>
          <Calendar
            selectedDate={value || minDateTime}
            onDateSelect={onSelectDay}
            minDate={minDate}
            maxDate={maxDate}
          />
        </div>

        <div>
          <ScrollableTimePicker
            selectedTime={timeValue}
            onTimeSelect={onTimeChange}
            minTime={timeMin}
            maxTime={timeMax}
            timeFormat={currentFormat}
            onChangeTimeFormat={setCurrentFormat}
          />
          {(timeMin || timeMax) && (
            <p className="mt-2 sm:mt-3 text-sm text-slate-600 bg-blue-50 rounded-lg p-2 sm:p-3 border border-blue-200">
              {(() => {
                const parts: string[] = []
                if (timeMin) {
                  const { hours, minutes } = fromTimeInputValue(timeMin)
                  const d = setTimeOfDay(fromDateInputValue(selectedDay), hours, minutes)
                  parts.push(`⏰ Earliest today: ${formatTime(d, currentFormat)}`)
                }
                if (timeMax) {
                  const { hours, minutes } = fromTimeInputValue(timeMax)
                  const d = setTimeOfDay(fromDateInputValue(selectedDay), hours, minutes)
                  parts.push(`Latest this day: ${formatTime(d, currentFormat)}`)
                }
                return parts.join(" • ")
              })()}
            </p>
          )}
        </div>
      </div>

      {/* Selection summary + messages */}
      <div className="flex items-start justify-between gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="text-sm text-slate-600">
          {value ? (
            <>
              <div className="font-semibold text-slate-800 text-sm sm:text-base mb-1">
                {formatDate(value)} at {formatTime(value, currentFormat)}
              </div>
              <div className="text-slate-500">{selectedInfo?.rel}</div>
            </>
          ) : (
            <div className="text-slate-500 italic">No time selected</div>
          )}
        </div>

        {note && (
          <div
            aria-live="polite"
            className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 sm:px-4 sm:py-3 text-sm text-amber-800 shadow-sm"
          >
            {note}
          </div>
        )}
      </div>
    </div>
  )
}
