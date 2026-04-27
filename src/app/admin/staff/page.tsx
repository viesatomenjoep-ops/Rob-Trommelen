import { getEmployees, getLogs, getTasks } from '@/app/actions/staff'
import Link from 'next/link'
import { Plus, Clock, CheckCircle2, UserPlus, Trash2, Calendar } from 'lucide-react'
import AddStaffForm from '@/components/admin/AddStaffForm'

export default async function StaffAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string; date?: string; error?: string; success?: string }>
}) {
  const params = await searchParams
  
  const currentDate = new Date()
  const currentMonth = params.month ? parseInt(params.month) : currentDate.getMonth() + 1
  const currentYear = params.year ? parseInt(params.year) : currentDate.getFullYear()
  const selectedDate = params.date || currentDate.toISOString().split('T')[0]

  let employees = []
  let logs = []
  let tasks = []
  let schedules = []

  try {
    const actions = await import('@/app/actions/staff')
    employees = await actions.getEmployees() || []
    logs = await actions.getLogs(currentMonth, currentYear) || []
    tasks = await actions.getTasks(selectedDate) || []
    schedules = await actions.getUpcomingSchedules() || []
  } catch (error) {
    console.error("Staff tables not configured in Supabase yet.", error)
  }

  // Calculate hours per employee for the month
  const hoursMap: Record<string, { name: string, totalMs: number, lastIn: Date | null }> = {}
  
  employees.forEach((emp: any) => {
    hoursMap[emp.id] = { name: emp.full_name, totalMs: 0, lastIn: null }
  })

  // Simple calculation: match clock_in with next clock_out
  const reversedLogs = [...logs].reverse() // process chronologically
  reversedLogs.forEach((log: any) => {
    const empData = hoursMap[log.employee_id]
    if (!empData) return

    if (log.action === 'clock_in') {
      empData.lastIn = new Date(log.timestamp)
    } else if (log.action === 'clock_out' && empData.lastIn) {
      const outDate = new Date(log.timestamp)
      const diffMs = outDate.getTime() - empData.lastIn.getTime()
      if (diffMs > 0 && diffMs < 1000 * 60 * 60 * 24) { // Ignore shifts > 24 hours (probably forgot to clock out)
        empData.totalMs += diffMs
      }
      empData.lastIn = null
    }
  })

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4">
        <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">Staff Management</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Staff List & Hours */}
        <div className="space-y-8">
          
          {/* Employee Management */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center"><UserPlus className="mr-2" size={20}/> Manage Staff</h2>
            
            <AddStaffForm />

            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {employees.map((emp: any) => (
                <li key={emp.id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{emp.full_name}</p>
                    <p className="text-xs text-gray-500">PIN: ••••</p>
                  </div>
                  <form action={async () => {
                    'use server'
                    const { removeEmployee } = await import('@/app/actions/staff')
                    await removeEmployee(emp.id)
                  }}>
                    <button type="submit" className="text-red-600 hover:text-red-800 p-2"><Trash2 size={16} /></button>
                  </form>
                </li>
              ))}
              {employees.length === 0 && <p className="text-sm text-gray-500 py-2">No staff added yet.</p>}
            </ul>
          </div>

          {/* Time Tracking Dashboard */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center"><Clock className="mr-2" size={20}/> Time Tracking</h2>
              <div className="text-sm font-medium bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-md">
                {currentMonth}/{currentYear}
              </div>
            </div>
            
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 mt-4">
              <thead>
                <tr>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase pb-2">Employee</th>
                  <th className="text-right text-xs font-medium text-gray-500 uppercase pb-2">Total Hours</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {Object.values(hoursMap).map((data) => {
                  const hours = (data.totalMs / (1000 * 60 * 60)).toFixed(1)
                  return (
                    <tr key={data.name}>
                      <td className="py-3 text-sm font-medium text-gray-900 dark:text-white">{data.name}</td>
                      <td className="py-3 text-sm text-right text-gray-700 dark:text-gray-300 font-mono">{hours} hrs</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

        </div>

        {/* Right Column: Daily Tasks */}
        <div className="space-y-8">
          <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center"><CheckCircle2 className="mr-2" size={20}/> Daily Tasks Overview</h2>
            
            <form action={async (formData) => {
              'use server'
              const { addTask } = await import('@/app/actions/staff')
              await addTask(formData)
            }} className="flex flex-col gap-4 mb-6 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Add New Task</label>
              <input type="date" name="task_date" defaultValue={selectedDate} required className="rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm" />
              <div className="flex gap-2">
                <input type="text" name="description" placeholder="Task description (e.g. Muck out stalls 1-5)" required className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm" />
                <button type="submit" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary transition-colors text-sm font-medium">Add Task</button>
              </div>
            </form>

            <h3 className="font-medium text-gray-900 dark:text-white mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">Tasks for {selectedDate}</h3>
            <ul className="space-y-3">
              {tasks.length === 0 ? (
                <p className="text-sm text-gray-500">No tasks assigned for this date.</p>
              ) : (
                tasks.map((task: any) => (
                  <li key={task.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${task.is_completed ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                        {task.is_completed && <CheckCircle2 className="text-white w-4 h-4" />}
                      </div>
                      <span className={`text-sm ${task.is_completed ? 'line-through text-gray-400' : 'text-gray-900 dark:text-white font-medium'}`}>
                        {task.description}
                      </span>
                    </div>
                    {task.is_completed && task.completed_by_emp && (
                      <span className="text-xs text-gray-500 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">
                        Done by {task.completed_by_emp.full_name}
                      </span>
                    )}
                  </li>
                ))
              )}
            </ul>
          </div>
          
          {/* Schedule Builder (Rooster Maken) */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center"><Calendar className="mr-2" size={20}/> Schedule Builder (Roosters)</h2>
            <p className="text-sm text-gray-500 mb-6">Create and assign shifts to staff members.</p>
            
            <form className="space-y-4" action={async (formData) => {
              'use server'
              const { addSchedule } = await import('@/app/actions/staff')
              await addSchedule(formData)
            }}>
              {params.error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg border border-red-200 text-sm">
                  {decodeURIComponent(params.error)}
                </div>
              )}
              {params.success && (
                <div className="bg-green-50 text-green-600 p-3 rounded-lg border border-green-200 text-sm">
                  Shift successfully added!
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Employee</label>
                  <select name="employee_id" className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm">
                    {employees.map((emp: any) => (
                      <option key={emp.id} value={emp.id}>{emp.full_name}</option>
                    ))}
                    {employees.length === 0 && <option>No employees found</option>}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                  <input type="date" name="shift_date" required className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Time</label>
                  <input type="time" name="start_time" defaultValue="08:00" required className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Time</label>
                  <input type="time" name="end_time" defaultValue="17:00" required className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Shift Type / Location</label>
                <input type="text" name="shift_type" placeholder="e.g. Stallen & Voeren" className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white sm:text-sm" />
              </div>
              <button type="submit" className="w-full bg-primary hover:bg-secondary text-white font-bold py-2 rounded-lg transition-colors">
                Add Shift to Schedule
              </button>
            </form>
            
            <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">Upcoming Shifts</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {schedules.length === 0 ? (
                  <p className="text-sm text-gray-500">No upcoming shifts scheduled.</p>
                ) : (
                  schedules.map((schedule: any) => (
                    <div key={schedule.id} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-700 flex justify-between items-center">
                      <div>
                        <p className="font-medium text-sm text-gray-900 dark:text-white">{schedule.employees?.full_name} <span className="text-gray-500 font-normal">({schedule.shift_type})</span></p>
                        <p className="text-xs text-gray-500">
                          {new Date(schedule.shift_date).toLocaleDateString('en-GB')} • {schedule.start_time.substring(0,5)} - {schedule.end_time.substring(0,5)}
                        </p>
                      </div>
                      <form action={async () => {
                        'use server'
                        const { removeSchedule } = await import('@/app/actions/staff')
                        await removeSchedule(schedule.id)
                      }}>
                        <button type="submit" className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                      </form>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
