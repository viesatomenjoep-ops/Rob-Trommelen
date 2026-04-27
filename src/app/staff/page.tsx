'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { getEmployees, staffLogin, clockIn, clockOut, getLastAction, getTasks, toggleTaskComplete, getTodayHours, getEmployeeMonthlyHistory, updateEmployeeProfile } from '@/app/actions/staff'
import { LogIn, LogOut, CheckCircle2, Circle, Clock, Timer, CalendarDays, Megaphone, CalendarRange, Umbrella, FileEdit, UserCheck, Calendar, AlertCircle, User, Settings } from 'lucide-react'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import CloudinaryUploader from '@/components/admin/CloudinaryUploader'

export default function StaffPortal() {
  const [employees, setEmployees] = useState<any[]>([])
  const [loggedInEmp, setLoggedInEmp] = useState<any | null>(null)
  
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  
  const [lastAction, setLastAction] = useState<any | null>(null)
  const [tasks, setTasks] = useState<any[]>([])
  const [todayMs, setTodayMs] = useState(0)
  const [history, setHistory] = useState<any[]>([])
  const [schedules, setSchedules] = useState<any[]>([])
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [leaveRequests, setLeaveRequests] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('dashboard')

  // Load basic data
  useEffect(() => {
    const saved = localStorage.getItem('equivest_staff_session')
    if (saved) {
      const emp = JSON.parse(saved)
      setLoggedInEmp(emp)
      fetchDashboardData(emp.id)
    }

    getEmployees().then(data => {
      if (data) setEmployees(data)
    }).catch(console.error)
  }, [])

  // Live timer for currently working employees
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (loggedInEmp && lastAction?.action === 'clock_in') {
      interval = setInterval(() => {
        setTodayMs(prev => prev + 1000)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [loggedInEmp, lastAction])

  const fetchDashboardData = async (empId: string) => {
    const action = await getLastAction(empId)
    setLastAction(action)

    const ms = await getTodayHours(empId)
    setTodayMs(ms)

    const today = new Date().toISOString().split('T')[0]
    const todaysTasks = await getTasks(today)
    setTasks(todaysTasks)

    const monthlyHistory = await getEmployeeMonthlyHistory(empId)
    setHistory(monthlyHistory)

    const actions = await import('@/app/actions/staff')
    const empSchedules = await actions.getEmployeeSchedules(empId)
    setSchedules(empSchedules || [])

    const anns = await actions.getAnnouncements()
    setAnnouncements(anns || [])

    const leaves = await actions.getEmployeeLeaveRequests(empId)
    setLeaveRequests(leaves || [])
  }

  const handleLogin = async (e: React.FormEvent, pinArg?: string) => {
    e.preventDefault()
    setError('')
    const loginPin = pinArg || pin
    const res = await staffLogin(loginPin)
    if (res.error) {
      setError(res.error)
      setPin('') 
    } else if (res.success && res.employee) {
      setLoggedInEmp(res.employee)
      localStorage.setItem('equivest_staff_session', JSON.stringify(res.employee))
      setPin('')
      fetchDashboardData(res.employee.id)
    }
  }

  const handleLogout = () => {
    setLoggedInEmp(null)
    setLastAction(null)
    setActiveTab('dashboard')
    localStorage.removeItem('equivest_staff_session')
  }

  const handleClockIn = async () => {
    if (!loggedInEmp) return
    await clockIn(loggedInEmp.id)
    await fetchDashboardData(loggedInEmp.id)
  }

  const handleClockOut = async () => {
    if (!loggedInEmp) return
    await clockOut(loggedInEmp.id)
    await fetchDashboardData(loggedInEmp.id)
  }

  const handleToggleTask = async (taskId: string, currentStatus: boolean) => {
    if (!loggedInEmp) return
    setTasks(tasks.map(t => t.id === taskId ? { ...t, is_completed: !currentStatus, completed_by_emp: { full_name: loggedInEmp.full_name } } : t))
    const { toggleTaskComplete } = await import('@/app/actions/staff')
    await toggleTaskComplete(taskId, loggedInEmp.id, !currentStatus)
    await fetchDashboardData(loggedInEmp.id)
  }

  const handleLeaveSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!loggedInEmp) return
    const formData = new FormData(e.currentTarget)
    formData.append('employee_id', loggedInEmp.id)
    const { submitLeaveRequest } = await import('@/app/actions/staff')
    await submitLeaveRequest(formData)
    alert("Verlofaanvraag succesvol verzonden ter goedkeuring!")
    e.currentTarget.reset()
  }

  const handleTimeCorrection = async () => {
    if (!loggedInEmp) return
    const shiftDate = prompt("Voor welke datum wil je een correctie aanvragen? (YYYY-MM-DD)")
    if (!shiftDate) return
    const requestedTime = prompt("Wat had de correcte tijd moeten zijn? (Bijv 17:30)")
    if (!requestedTime) return
    const reason = prompt("Wat was de reden? (Bijv. 'Vergeten uit te klokken')")
    
    const formData = new FormData()
    formData.append('employee_id', loggedInEmp.id)
    formData.append('shift_date', shiftDate)
    formData.append('requested_time', requestedTime)
    formData.append('reason', reason || '')

    const { submitTimeCorrection } = await import('@/app/actions/staff')
    await submitTimeCorrection(formData)
    alert("Correctieverzoek ingediend!")
  }

  const handleAvailabilityChange = async (isAvailable: boolean, notes: string) => {
    if (!loggedInEmp) return
    const { setAvailability } = await import('@/app/actions/staff')
    await setAvailability(loggedInEmp.id, isAvailable, notes)
    alert("Beschikbaarheid doorgegeven!")
  }

  const isClockedIn = lastAction?.action === 'clock_in'
  const hours = Math.floor(todayMs / (1000 * 60 * 60))
  const minutes = Math.floor((todayMs % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((todayMs % (1000 * 60)) / 1000)

  if (!loggedInEmp) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 relative">
        <div className="absolute top-4 right-4 z-50">
          <LanguageSwitcher expandDirection="left" />
        </div>
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="bg-primary p-8 text-center relative flex flex-col items-center">
            <Image src="/logo.png" alt="Equivest Logo" width={64} height={64} className="w-16 h-16 object-contain mb-4" />
            <h1 className="text-3xl font-serif font-bold text-white uppercase tracking-widest">Staff Terminal</h1>
            <p className="text-primary-light mt-2 font-medium">Enter your 4-digit PIN</p>
          </div>
          
          <div className="p-8">
            {error && <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg text-sm font-bold text-center animate-pulse">{error}</div>}
            
            <div className="flex justify-center gap-4 mb-8">
              {[0, 1, 2, 3].map((index) => (
                <div 
                  key={index} 
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all duration-200 ${
                    pin.length > index 
                      ? 'bg-primary text-white scale-110 shadow-md' 
                      : 'bg-gray-100 dark:bg-gray-700 text-transparent'
                  }`}
                >
                  {pin.length > index ? '•' : ''}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    if (pin.length < 4) {
                      const newPin = pin + num
                      setPin(newPin)
                      if (newPin.length === 4) setTimeout(() => handleLogin({ preventDefault: () => {} } as any, newPin), 100)
                    }
                  }}
                  className="h-20 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-2xl text-2xl font-bold text-gray-900 dark:text-white transition-transform active:scale-95 shadow-sm"
                >
                  {num}
                </button>
              ))}
              
              <button
                type="button"
                onClick={() => setPin('')}
                className="h-20 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 rounded-2xl text-sm font-bold text-red-600 transition-transform active:scale-95 shadow-sm"
              >
                CLEAR
              </button>
              
              <button
                type="button"
                onClick={() => {
                  if (pin.length < 4) {
                    const newPin = pin + '0'
                    setPin(newPin)
                    if (newPin.length === 4) setTimeout(() => handleLogin({ preventDefault: () => {} } as any, newPin), 100)
                  }
                }}
                className="h-20 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-2xl text-2xl font-bold text-gray-900 dark:text-white transition-transform active:scale-95 shadow-sm"
              >
                0
              </button>
              
              <button
                type="button"
                onClick={() => setPin(pin.slice(0, -1))}
                className="h-20 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-2xl text-xl font-bold text-gray-600 dark:text-gray-300 transition-transform active:scale-95 shadow-sm flex justify-center items-center"
              >
                ⌫
              </button>
            </div>
            
            <div className="text-center mt-8">
              <a href="/" className="text-xs text-gray-400 hover:text-primary transition-colors font-medium tracking-wider uppercase">Return to Website</a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {loggedInEmp.profile_picture ? (
              <Image src={loggedInEmp.profile_picture} alt={loggedInEmp.full_name} width={40} height={40} className="w-10 h-10 rounded-full object-cover border-2 border-primary shrink-0" />
            ) : (
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-lg shrink-0">
                {loggedInEmp.full_name.charAt(0)}
              </div>
            )}
            <div>
              <h1 className="font-bold text-gray-900 dark:text-white leading-tight">{loggedInEmp.full_name}</h1>
              <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${isClockedIn ? 'bg-green-500' : 'bg-red-500'}`}></span>
                {isClockedIn ? 'Clocked In' : 'Clocked Out'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher expandDirection="left" />
            <button onClick={handleLogout} className="text-gray-500 hover:text-gray-900 dark:hover:text-white p-2">
              <LogOut size={24} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-6xl mx-auto px-4 py-3 md:py-4 flex gap-3 md:gap-4 overflow-x-auto hide-scrollbar border-t border-gray-100 dark:border-gray-700 scroll-smooth pb-4">
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`flex items-center gap-2 md:gap-3 px-5 py-2.5 md:px-8 md:py-4 rounded-full font-bold text-sm md:text-lg whitespace-nowrap transition-colors shadow-sm ${activeTab === 'dashboard' ? 'bg-primary text-white shadow-md' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
          >
            <Clock className="w-4 h-4 md:w-6 md:h-6" /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('schedule')} 
            className={`flex items-center gap-2 md:gap-3 px-5 py-2.5 md:px-8 md:py-4 rounded-full font-bold text-sm md:text-lg whitespace-nowrap transition-colors shadow-sm ${activeTab === 'schedule' ? 'bg-primary text-white shadow-md' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
          >
            <CalendarRange className="w-4 h-4 md:w-6 md:h-6" /> Rooster & Historie
          </button>
          <button 
            onClick={() => setActiveTab('leave')} 
            className={`flex items-center gap-2 md:gap-3 px-5 py-2.5 md:px-8 md:py-4 rounded-full font-bold text-sm md:text-lg whitespace-nowrap transition-colors shadow-sm ${activeTab === 'leave' ? 'bg-primary text-white shadow-md' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
          >
            <Umbrella className="w-4 h-4 md:w-6 md:h-6" /> Verlof & Beschikbaarheid
          </button>
          <button 
            onClick={() => setActiveTab('notices')} 
            className={`flex items-center gap-2 md:gap-3 px-5 py-2.5 md:px-8 md:py-4 rounded-full font-bold text-sm md:text-lg whitespace-nowrap transition-colors shadow-sm ${activeTab === 'notices' ? 'bg-primary text-white shadow-md' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
          >
            <Megaphone className="w-4 h-4 md:w-6 md:h-6" /> Prikbord <span className="bg-red-500 text-white text-xs md:text-sm px-2 py-0.5 rounded-full ml-1 md:ml-2">1</span>
          </button>
          <button 
            onClick={() => setActiveTab('profile')} 
            className={`flex items-center gap-2 md:gap-3 px-5 py-2.5 md:px-8 md:py-4 rounded-full font-bold text-sm md:text-lg whitespace-nowrap transition-colors shadow-sm ${activeTab === 'profile' ? 'bg-primary text-white shadow-md' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
          >
            <User className="w-4 h-4 md:w-6 md:h-6" /> Mijn Profiel
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pt-6 pb-12">
        
        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* Clock Widget */}
              <section className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700 p-8 text-center relative overflow-hidden flex-1 flex flex-col items-center justify-center min-h-[400px]">
                {isClockedIn && <div className="absolute inset-0 bg-green-50 dark:bg-green-900/10 opacity-50 animate-pulse pointer-events-none"></div>}
                
                <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4">Current Status</h2>
                <div className="mb-8">
                  {isClockedIn ? (
                    <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-4 py-1.5 rounded-full text-sm font-bold animate-fade-in">
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                      ACTIVELY WORKING
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 px-4 py-1.5 rounded-full text-sm font-bold">
                      <span className="w-2.5 h-2.5 rounded-full bg-gray-400"></span>
                      OFF THE CLOCK
                    </div>
                  )}
                </div>

                <div className="flex justify-center items-center relative z-10 py-4">
                  {!isClockedIn ? (
                    <button onClick={handleClockIn} className="group flex flex-col items-center justify-center gap-6 transition-all hover:scale-105 active:scale-95">
                      <div className="w-48 h-48 rounded-full bg-green-50 dark:bg-green-900/30 shadow-xl border-4 border-green-500 flex items-center justify-center p-6 group-hover:bg-green-100 dark:group-hover:bg-green-900/50 group-hover:shadow-[0_0_40px_rgba(34,197,94,0.4)] transition-all duration-300">
                        <Image src="/logo.png" alt="Clock In Logo" width={120} height={120} className="object-contain drop-shadow-md" />
                      </div>
                      <div className="bg-green-600 text-white px-8 py-3 rounded-full font-black tracking-widest shadow-lg group-hover:bg-green-500 transition-colors">TAP TO CLOCK IN</div>
                    </button>
                  ) : (
                    <button onClick={handleClockOut} className="group flex flex-col items-center justify-center gap-6 transition-all hover:scale-105 active:scale-95">
                      <div className="w-48 h-48 rounded-full bg-red-50 dark:bg-red-900/30 shadow-[0_0_40px_rgba(239,68,68,0.3)] border-4 border-red-500 flex items-center justify-center p-6 animate-pulse group-hover:bg-red-100 dark:group-hover:bg-red-900/50 group-hover:shadow-[0_0_40px_rgba(239,68,68,0.6)] transition-all duration-300">
                        <Image src="/logo.png" alt="Clock Out Logo" width={120} height={120} className="object-contain drop-shadow-md" />
                      </div>
                      <div className="bg-red-600 group-hover:bg-red-500 text-white px-8 py-3 rounded-full font-black tracking-widest shadow-lg transition-colors">
                        <span className="group-hover:hidden">ACTIVELY LOGGING</span>
                        <span className="hidden group-hover:inline">TAP TO CLOCK OUT</span>
                      </div>
                    </button>
                  )}
                </div>
              </section>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 flex flex-col items-center justify-center border border-gray-100 dark:border-gray-700">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                    <Timer size={14} /> Total Time Today
                  </span>
                  <div className="text-4xl font-mono font-black text-primary dark:text-white tracking-tight flex items-baseline">
                    {hours}<span className="text-xl text-gray-400 mx-1">h</span> {minutes.toString().padStart(2, '0')}<span className="text-xl text-gray-400 mx-1">m</span> <span className="text-2xl">{seconds.toString().padStart(2, '0')}</span><span className="text-lg text-gray-400 ml-1">s</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 flex flex-col items-center justify-center border border-gray-100 dark:border-gray-700">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Last Activity</span>
                  {lastAction ? (
                    <div className="text-center">
                      <div className={`text-xl font-bold mb-1 ${lastAction.action === 'clock_in' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {lastAction.action === 'clock_in' ? 'Clocked In' : 'Clocked Out'}
                      </div>
                      <div className="text-xl font-mono font-bold text-gray-900 dark:text-white mt-1">
                        {new Date(lastAction.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-400 italic text-sm">No activity</div>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-6">
              <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex-1 flex flex-col min-h-[300px]">
                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-serif font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <CheckCircle2 className="text-primary" size={20} /> Today's Tasks
                  </h2>
                </div>
                
                <ul className="divide-y divide-gray-100 dark:divide-gray-700/50">
                  {tasks.length === 0 ? (
                    <li className="p-8 text-center text-gray-500">No tasks for today. Have a great day!</li>
                  ) : (
                    tasks.map(task => (
                      <li key={task.id} onClick={() => handleToggleTask(task.id, task.is_completed)} className={`p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${task.is_completed ? 'opacity-60' : ''}`}>
                        <button className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${task.is_completed ? 'bg-green-500 border-green-500' : 'border-gray-300 dark:border-gray-600 text-transparent'}`}>
                          <CheckCircle2 className="w-5 h-5 text-white" />
                        </button>
                        <div className="flex-1">
                          <p className={`font-medium ${task.is_completed ? 'text-gray-500 line-through' : 'text-gray-900 dark:text-white'}`}>{task.description}</p>
                          {task.is_completed && task.completed_by_emp && (
                            <p className="text-xs text-green-600 dark:text-green-400 mt-1">Completed by {task.completed_by_emp.full_name}</p>
                          )}
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </section>
            </div>
          </div>
        )}

        {/* TAB 2: ROOSTER & HISTORIE */}
        {activeTab === 'schedule' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
            {/* FEATURE 1: Rooster Bekijken */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <CalendarRange className="text-primary" /> Mijn Rooster (Deze Week)
              </h2>
              <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                {schedules.length === 0 ? (
                  <p className="text-sm text-gray-500">Je hebt momenteel geen ingeplande diensten voor de komende dagen.</p>
                ) : (
                  schedules.map((schedule: any) => (
                    <div key={schedule.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">
                          {new Date(schedule.shift_date).toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </p>
                        <p className="text-sm text-gray-500">{schedule.shift_type}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-bold text-primary">
                          {schedule.start_time.substring(0,5)} - {schedule.end_time.substring(0,5)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <CalendarDays className="text-primary" /> Gewerkte Uren
              </h2>
              <ul className="divide-y divide-gray-100 dark:divide-gray-700/50 max-h-80 overflow-y-auto mb-4">
                {history.length === 0 ? (
                  <li className="p-4 text-center text-gray-500">No recent shifts found.</li>
                ) : (
                  history.map((day, idx) => {
                    const dayHours = Math.floor(day.totalMs / (1000 * 60 * 60))
                    const dayMins = Math.floor((day.totalMs % (1000 * 60 * 60)) / (1000 * 60))
                    return (
                      <li key={idx} className="py-3 flex items-center justify-between">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {new Date(day.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                        </div>
                        <div className="font-mono font-bold text-primary dark:text-primary-light bg-primary/10 px-3 py-1 rounded-full">
                          {dayHours}h {dayMins.toString().padStart(2, '0')}m
                        </div>
                      </li>
                    )
                  })
                )}
              </ul>
              
              {/* FEATURE 2: Correctieverzoek */}
              <button onClick={handleTimeCorrection} className="w-full mt-2 flex items-center justify-center gap-2 py-3 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                <FileEdit size={18} /> Uren vergeten? Vraag correctie aan
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: VERLOF & BESCHIKBAARHEID */}
        {activeTab === 'leave' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            {/* FEATURE 3: Verlof Aanvragen */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Umbrella className="text-primary" /> Verlof Aanvragen
              </h2>
              <form className="space-y-4" onSubmit={handleLeaveSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Van</label>
                    <input type="date" name="start_date" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tot</label>
                    <input type="date" name="end_date" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type Verlof</label>
                  <select name="leave_type" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option>Vakantie (Betaald)</option>
                    <option>Ziekte</option>
                    <option>Bijzonder Verlof</option>
                    <option>Onbetaald Verlof</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Opmerking</label>
                  <textarea name="notes" rows={2} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"></textarea>
                </div>
                <button type="submit" className="w-full bg-primary hover:bg-secondary text-white font-bold py-3 rounded-lg transition-colors">
                  Aanvraag Indienen
                </button>
              </form>

              {/* Mijn Verlofaanvragen List */}
              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-serif font-bold text-gray-900 dark:text-white mb-4">Mijn Aanvragen</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                  {leaveRequests.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">Je hebt nog geen verlof aangevraagd.</p>
                  ) : (
                    leaveRequests.map((req: any) => {
                      const isApproved = req.status === 'approved'
                      const isRejected = req.status === 'rejected'
                      return (
                        <div key={req.id} className={`flex items-start justify-between p-3 rounded-xl border ${
                          isApproved ? 'bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-800' :
                          isRejected ? 'bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800' :
                          'bg-amber-50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-800'
                        }`}>
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white text-sm">{req.leave_type}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(req.start_date).toLocaleDateString('nl-NL', {day: 'numeric', month: 'short'})} - {new Date(req.end_date).toLocaleDateString('nl-NL', {day: 'numeric', month: 'short'})}
                            </p>
                            {req.notes && <p className="text-xs text-gray-400 mt-1 truncate max-w-[200px]">"{req.notes}"</p>}
                          </div>
                          <div className={`px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                            isApproved ? 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200' :
                            isRejected ? 'bg-red-200 text-red-800 dark:bg-red-800 dark:text-red-200' :
                            'bg-amber-200 text-amber-800 dark:bg-amber-800 dark:text-amber-200'
                          }`}>
                            {req.status === 'pending' ? 'In Afwachting' : req.status === 'approved' ? 'Goedgekeurd' : 'Afgewezen'}
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            </div>

            {/* FEATURE 4: Beschikbaarheid */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <UserCheck className="text-primary" /> Mijn Beschikbaarheid
              </h2>
              <p className="text-sm text-gray-500 mb-6">Geef aan wanneer je volgende week extra kunt werken of juist absoluut niet beschikbaar bent.</p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800 rounded-xl">
                  <div>
                    <p className="font-bold text-green-900 dark:text-green-400">Extra Werken</p>
                    <p className="text-sm text-green-700 dark:text-green-500">Geef door als je extra beschikbaar bent.</p>
                  </div>
                  <div className="flex items-center">
                    <button onClick={() => handleAvailabilityChange(true, prompt('Wanneer precies?') || '')} className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm hover:bg-green-500">Beschikbaar</button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800 rounded-xl">
                  <div>
                    <p className="font-bold text-red-900 dark:text-red-400">Niet Beschikbaar</p>
                    <p className="text-sm text-red-700 dark:text-red-500">Geef door als je echt vrij moet zijn.</p>
                  </div>
                  <div className="flex items-center">
                    <button onClick={() => handleAvailabilityChange(false, prompt('Wanneer precies en waarom?') || '')} className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm hover:bg-red-500">Onbeschikbaar</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PRIKBORD */}
        {activeTab === 'notices' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 lg:p-8 animate-fade-in">
            {/* FEATURE 5: Prikbord / Mededelingen */}
            <div className="flex justify-between items-center mb-8 border-b border-gray-100 dark:border-gray-700 pb-4">
              <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Megaphone className="text-accent" size={28} /> Mededelingen & Updates
              </h2>
            </div>
            
            <div className="space-y-6 max-w-3xl">
              {announcements.length === 0 ? (
                <p className="text-gray-500">Geen actuele mededelingen.</p>
              ) : (
                announcements.map((ann: any) => {
                  const isRed = ann.type === 'urgent'
                  return (
                    <div key={ann.id} className={`${isRed ? 'bg-red-50 border-red-500 dark:bg-red-900/10' : 'bg-blue-50 border-blue-500 dark:bg-blue-900/10'} border-l-4 p-4 rounded-r-lg`}>
                      <div className={`flex items-center gap-2 ${isRed ? 'text-red-800 dark:text-red-400' : 'text-blue-800 dark:text-blue-400'} font-bold mb-1`}>
                        {isRed && <AlertCircle size={18} />} {ann.title}
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">
                        {ann.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-2 font-medium">Geplaatst door: {ann.author} - {new Date(ann.created_at).toLocaleDateString('nl-NL')} om {new Date(ann.created_at).toLocaleTimeString('nl-NL', {hour: '2-digit', minute:'2-digit'})}</p>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )}

        {/* TAB 5: PROFIEL */}
        {activeTab === 'profile' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 lg:p-8 animate-fade-in max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-8 border-b border-gray-100 dark:border-gray-700 pb-4">
              <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Settings className="text-primary" size={24} /> Persoonlijke Gegevens
              </h2>
            </div>
            
            <form action={async (formData) => {
              formData.append('id', loggedInEmp.id)
              const res = await updateEmployeeProfile(formData)
              if (res.success) {
                alert("Profiel succesvol opgeslagen!")
                // Update local storage and state with new details
                const updatedEmp = {
                  ...loggedInEmp,
                  profile_picture: formData.get('profile_picture'),
                  address: formData.get('address'),
                  date_of_birth: formData.get('date_of_birth')
                }
                setLoggedInEmp(updatedEmp)
                localStorage.setItem('equivest_staff_session', JSON.stringify(updatedEmp))
              }
            }} className="space-y-6">
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Profielfoto</label>
                <CloudinaryUploader 
                  onUploadSuccess={(url) => {
                    const input = document.getElementById('profile_picture') as HTMLInputElement
                    if (input) input.value = url
                    alert("Foto succesvol geüpload! Vergeet niet op opslaan te klikken.")
                  }}
                />
                <input type="hidden" id="profile_picture" name="profile_picture" defaultValue={loggedInEmp.profile_picture || ''} />
                {loggedInEmp.profile_picture && (
                  <div className="mt-4 flex items-center gap-4">
                    <Image src={loggedInEmp.profile_picture} alt="Preview" width={80} height={80} className="rounded-full object-cover border-4 border-gray-100 dark:border-gray-700" />
                    <span className="text-sm text-green-600 font-medium flex items-center gap-1"><CheckCircle2 size={16}/> Huidige foto</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Volledig Adres</label>
                <textarea 
                  name="address" 
                  rows={3} 
                  defaultValue={loggedInEmp.address || ''}
                  placeholder="Straat, Huisnummer&#10;Postcode, Woonplaats"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Geboortedatum</label>
                <input 
                  type="date" 
                  name="date_of_birth" 
                  defaultValue={loggedInEmp.date_of_birth || ''}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full bg-primary hover:bg-secondary text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98] shadow-md flex justify-center items-center gap-2 text-lg">
                  <CheckCircle2 size={24} /> Profiel Opslaan
                </button>
              </div>

            </form>
          </div>
        )}
      </main>
    </div>
  )
}
