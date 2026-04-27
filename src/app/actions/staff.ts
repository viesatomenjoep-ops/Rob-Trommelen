'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// --- EMPLOYEES ---

export async function getEmployees() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('employees').select('*').order('full_name')
  if (error) throw new Error(error.message)
  return data
}

export async function addEmployee(formData: FormData) {
  const supabase = await createClient()
  const fullName = formData.get('full_name') as string
  const pinCode = formData.get('pin_code') as string

  if (!fullName || !pinCode) return { error: 'Name and PIN are required' }

  const { error } = await supabase.from('employees').insert([{ full_name: fullName, pin_code: pinCode }])
  if (error) {
    console.error("Error adding employee:", error)
    return { error: error.message }
  }

  revalidatePath('/admin/staff')
  return { success: true }
}

export async function removeEmployee(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('employees').delete().eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/admin/staff')
  return { success: true }
}

export async function staffLogin(pin: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('employees').select('*').eq('pin_code', pin).single()
  
  if (error || !data) return { error: 'Invalid PIN' }
  return { success: true, employee: data }
}

// --- LOGS (TIME TRACKING) ---

export async function clockIn(employeeId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('employee_logs').insert([{ employee_id: employeeId, action: 'clock_in' }])
  if (error) return { error: error.message }
  
  // Fetch employee name for notification
  const { data: emp } = await supabase.from('employees').select('full_name').eq('id', employeeId).single()
  const name = emp ? emp.full_name : 'Een medewerker';

  // Send WhatsApp notification
  const waText = encodeURIComponent(`⏰ *Ingeklokt* ⏰\n${name} is zojuist INGEKLOKT!\nTijd: ${new Date().toLocaleTimeString('nl-NL')}`);
  fetch(`https://api.callmebot.com/whatsapp.php?phone=31651641886&text=${waText}&apikey=6121648&t=${Date.now()}`, { cache: 'no-store' }).catch(console.error);

  // Send Email notification
  fetch('https://formsubmit.co/ajax/tomvanbiene@gmail.com', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Origin': 'https://www.equivestworldwide.com', 'Referer': 'https://www.equivestworldwide.com/' },
    body: JSON.stringify({ _subject: `🟢 ${name} is ingeklokt`, _template: 'basic', message: `${name} is zojuist ingeklokt op de stalkiosk.\nTijd: ${new Date().toLocaleString('nl-NL')}` })
  }).catch(console.error);

  revalidatePath('/staff')
  revalidatePath('/admin/staff')
  return { success: true }
}

export async function clockOut(employeeId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('employee_logs').insert([{ employee_id: employeeId, action: 'clock_out' }])
  if (error) return { error: error.message }
  
  // Fetch employee name for notification
  const { data: emp } = await supabase.from('employees').select('full_name').eq('id', employeeId).single()
  const name = emp ? emp.full_name : 'Een medewerker';

  // Send WhatsApp notification
  const waText = encodeURIComponent(`🏠 *Uitgeklokt* 🏠\n${name} is zojuist UITGEKLOKT!\nTijd: ${new Date().toLocaleTimeString('nl-NL')}`);
  fetch(`https://api.callmebot.com/whatsapp.php?phone=31651641886&text=${waText}&apikey=6121648&t=${Date.now()}`, { cache: 'no-store' }).catch(console.error);

  // Send Email notification
  fetch('https://formsubmit.co/ajax/tomvanbiene@gmail.com', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Origin': 'https://www.equivestworldwide.com', 'Referer': 'https://www.equivestworldwide.com/' },
    body: JSON.stringify({ _subject: `🔴 ${name} is uitgeklokt`, _template: 'basic', message: `${name} is zojuist uitgeklokt en naar huis gegaan.\nTijd: ${new Date().toLocaleString('nl-NL')}` })
  }).catch(console.error);

  revalidatePath('/staff')
  revalidatePath('/admin/staff')
  return { success: true }
}

export async function getLogs(month: number, year: number) {
  const supabase = await createClient()
  // Generate start and end dates for the month
  const startDate = new Date(year, month - 1, 1).toISOString()
  const endDate = new Date(year, month, 0, 23, 59, 59).toISOString()

  const { data, error } = await supabase
    .from('employee_logs')
    .select('*, employees(full_name)')
    .gte('timestamp', startDate)
    .lte('timestamp', endDate)
    .order('timestamp', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

export async function getLastAction(employeeId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('employee_logs')
    .select('*')
    .eq('employee_id', employeeId)
    .order('timestamp', { ascending: false })
    .limit(1)
    .single()
  
  if (error && error.code !== 'PGRST116') return null // Ignore 'no rows found' error
  return data
}

export async function getTodayHours(employeeId: string) {
  const supabase = await createClient()
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const todayEnd = new Date()
  todayEnd.setHours(23, 59, 59, 999)

  const { data, error } = await supabase
    .from('employee_logs')
    .select('*')
    .eq('employee_id', employeeId)
    .gte('timestamp', todayStart.toISOString())
    .lte('timestamp', todayEnd.toISOString())
    .order('timestamp', { ascending: true })

  if (error || !data) return 0

  let totalMs = 0
  let lastIn: any = null

  data.forEach((log: any) => {
    if (log.action === 'clock_in') {
      lastIn = new Date(log.timestamp)
    } else if (log.action === 'clock_out' && lastIn) {
      totalMs += new Date(log.timestamp).getTime() - new Date(lastIn).getTime()
      lastIn = null
    }
  })

  if (lastIn) {
    totalMs += new Date().getTime() - new Date(lastIn).getTime()
  }

  return totalMs
}

export async function getEmployeeMonthlyHistory(employeeId: string) {
  const supabase = await createClient()
  
  // Get logs for the last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  thirtyDaysAgo.setHours(0, 0, 0, 0)

  const { data, error } = await supabase
    .from('employee_logs')
    .select('*')
    .eq('employee_id', employeeId)
    .gte('timestamp', thirtyDaysAgo.toISOString())
    .order('timestamp', { ascending: true })

  if (error || !data) return []

  // Group by date
  const grouped: Record<string, { totalMs: number, logs: any[] }> = {}
  
  data.forEach((log: any) => {
    const dateStr = log.timestamp.split('T')[0]
    if (!grouped[dateStr]) grouped[dateStr] = { totalMs: 0, logs: [] }
    grouped[dateStr].logs.push(log)
  })

  // Calculate hours for each day
  const history = Object.keys(grouped).map(dateStr => {
    let dayTotalMs = 0
    let lastIn: any = null
    const dayLogs = grouped[dateStr].logs

    dayLogs.forEach((log: any) => {
      if (log.action === 'clock_in') {
        lastIn = new Date(log.timestamp)
      } else if (log.action === 'clock_out' && lastIn) {
        dayTotalMs += new Date(log.timestamp).getTime() - new Date(lastIn).getTime()
        lastIn = null
      }
    })

    // If still clocked in on that day and it's today, add up to now
    if (lastIn && dateStr === new Date().toISOString().split('T')[0]) {
      dayTotalMs += new Date().getTime() - new Date(lastIn).getTime()
    } else if (lastIn) {
      // If they forgot to clock out on a previous day, auto clock out at end of day (23:59)
      const endOfDay = new Date(dateStr + 'T23:59:59Z')
      dayTotalMs += endOfDay.getTime() - new Date(lastIn).getTime()
    }

    return {
      date: dateStr,
      totalMs: dayTotalMs
    }
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return history
}

// --- TASKS ---

export async function getTasks(date: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('daily_tasks')
    .select('*, completed_by_emp:employees!completed_by(full_name)')
    .eq('task_date', date)
    .order('created_at', { ascending: true })

  if (error) throw new Error(error.message)
  return data
}

export async function addTask(formData: FormData) {
  const supabase = await createClient()
  const description = formData.get('description') as string
  const taskDate = formData.get('task_date') as string

  if (!description || !taskDate) return { error: 'Description and Date required' }

  const { error } = await supabase.from('daily_tasks').insert([{ description, task_date: taskDate }])
  if (error) return { error: error.message }

  revalidatePath('/admin/staff')
  revalidatePath('/staff')
  return { success: true }
}

export async function toggleTaskComplete(taskId: string, employeeId: string, isCompleted: boolean) {
  const supabase = await createClient()
  
  const updateData = isCompleted 
    ? { is_completed: true, completed_by: employeeId, completed_at: new Date().toISOString() }
    : { is_completed: false, completed_by: null, completed_at: null }

  const { error } = await supabase.from('daily_tasks').update(updateData).eq('id', taskId)
  if (error) return { error: error.message }

  revalidatePath('/staff')
  revalidatePath('/admin/staff')
  return { success: true }
}

// --- SCHEDULES (ROOSTERS) ---

export async function getUpcomingSchedules() {
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]
  
  const { data: schedules, error } = await supabase
    .from('staff_schedules')
    .select('*')
    .gte('shift_date', today)
    .order('shift_date', { ascending: true })
    .order('start_time', { ascending: true })

  if (error || !schedules) {
    console.error("Error fetching schedules:", error)
    return []
  }

  // Fetch employees to attach names (safest way to avoid PostgREST FK relation errors)
  const { data: employees } = await supabase.from('employees').select('id, full_name')
  
  return schedules.map(schedule => {
    const emp = employees?.find(e => e.id === schedule.employee_id)
    return {
      ...schedule,
      employees: { full_name: emp ? emp.full_name : 'Unknown' }
    }
  })
}

export async function getEmployeeSchedules(employeeId: string) {
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]
  
  const { data, error } = await supabase
    .from('staff_schedules')
    .select('*')
    .eq('employee_id', employeeId)
    .gte('shift_date', today)
    .order('shift_date', { ascending: true })
    .order('start_time', { ascending: true })

  if (error) return []
  return data
}

export async function addSchedule(formData: FormData) {
  const supabase = await createClient()
  
  const employeeId = formData.get('employee_id') as string
  const shiftDate = formData.get('shift_date') as string
  const startTime = formData.get('start_time') as string
  const endTime = formData.get('end_time') as string
  const shiftType = formData.get('shift_type') as string

  if (!employeeId || !shiftDate || !startTime || !endTime) {
    redirect('/admin/staff?error=Missing+required+fields')
  }

  const { error } = await supabase.from('staff_schedules').insert([{
    employee_id: employeeId,
    shift_date: shiftDate,
    start_time: startTime,
    end_time: endTime,
    shift_type: shiftType || null
  }])

  if (error) {
    console.error("Insert error:", error)
    redirect('/admin/staff?error=' + encodeURIComponent(error.message))
  }

  revalidatePath('/admin/staff')
  revalidatePath('/staff')
  redirect('/admin/staff?success=Shift+added')
}

export async function removeSchedule(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('staff_schedules').delete().eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/admin/staff')
  revalidatePath('/staff')
  return { success: true }
}
// --- NEW FEATURES (SHIFTBASE INSPIRED) ---

// 1. Announcements (Prikbord)
export async function getAnnouncements() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('staff_announcements')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)
  
  if (error) {
    console.error("Announcements error:", error)
    return []
  }
  return data
}

export async function addAnnouncement(formData: FormData) {
  const supabase = await createClient()
  const title = formData.get('title') as string
  const message = formData.get('message') as string
  const type = formData.get('type') as string || 'info'
  const author = formData.get('author') as string || 'Admin'

  if (!title || !message) return { error: 'Missing fields' }

  const { error } = await supabase.from('staff_announcements').insert([{ title, message, type, author }])
  if (error) return { error: error.message }

  revalidatePath('/staff')
  revalidatePath('/admin/staff')
  return { success: true }
}

// 2. Leave Requests (Verlof)
export async function submitLeaveRequest(formData: FormData) {
  const supabase = await createClient()
  const employeeId = formData.get('employee_id') as string
  const startDate = formData.get('start_date') as string
  const endDate = formData.get('end_date') as string
  const leaveType = formData.get('leave_type') as string
  const notes = formData.get('notes') as string

  if (!employeeId || !startDate || !endDate) return { error: 'Missing fields' }

  const { error } = await supabase.from('staff_leave_requests').insert([{
    employee_id: employeeId,
    start_date: startDate,
    end_date: endDate,
    leave_type: leaveType,
    notes: notes || null
  }])

  if (error) return { error: error.message }

  // Notify Tom via Email
  const { data: emp } = await supabase.from('employees').select('full_name').eq('id', employeeId).single()
  const name = emp ? emp.full_name : 'Een medewerker';
  fetch('https://formsubmit.co/ajax/tomvanbiene@gmail.com', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ _subject: `🏖️ Verlofaanvraag: ${name}`, _template: 'basic', message: `${name} heeft verlof aangevraagd.\nVan: ${startDate}\nTot: ${endDate}\nType: ${leaveType}\nOpmerking: ${notes}` })
  }).catch(console.error);

  revalidatePath('/staff')
  revalidatePath('/admin/staff')
  return { success: true }
}

// 3. Time Corrections (Uren Correctie)
export async function submitTimeCorrection(formData: FormData) {
  const supabase = await createClient()
  const employeeId = formData.get('employee_id') as string
  const shiftDate = formData.get('shift_date') as string
  const requestedTime = formData.get('requested_time') as string
  const reason = formData.get('reason') as string

  if (!employeeId || !shiftDate || !requestedTime) return { error: 'Missing fields' }

  const { error } = await supabase.from('staff_time_corrections').insert([{
    employee_id: employeeId,
    shift_date: shiftDate,
    requested_time: requestedTime,
    reason: reason || null
  }])

  if (error) return { error: error.message }
  
  // Notify Tom via Email
  const { data: emp } = await supabase.from('employees').select('full_name').eq('id', employeeId).single()
  const name = emp ? emp.full_name : 'Een medewerker';
  fetch('https://formsubmit.co/ajax/tomvanbiene@gmail.com', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ _subject: `⏰ Uren Correctie: ${name}`, _template: 'basic', message: `${name} wil uren corrigeren.\nDatum: ${shiftDate}\nNieuwe Tijd: ${requestedTime}\nReden: ${reason}` })
  }).catch(console.error);

  revalidatePath('/staff')
  return { success: true }
}

// 4. Availability
export async function setAvailability(employeeId: string, isAvailable: boolean, notes: string) {
  const supabase = await createClient()
  
  // Just log it for next week Monday
  const d = new Date()
  d.setDate(d.getDate() + (1 + 7 - d.getDay()) % 7)
  const nextMonday = d.toISOString().split('T')[0]

  const { error } = await supabase.from('staff_availability').insert([{
    employee_id: employeeId,
    week_date: nextMonday,
    is_available: isAvailable,
    notes: notes
  }])

  if (error) return { error: error.message }
  
  revalidatePath('/staff')
  return { success: true }
}

export async function getEmployeeLeaveRequests(employeeId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('staff_leave_requests')
    .select('*')
    .eq('employee_id', employeeId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Error fetching leave requests:", error)
    return []
  }
  return data || []
}

export async function updateEmployeeProfile(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string
  const profile_picture = formData.get('profile_picture') as string
  const address = formData.get('address') as string
  const date_of_birth = formData.get('date_of_birth') as string

  const { error } = await supabase
    .from('staff_employees')
    .update({ 
      profile_picture: profile_picture || null,
      address: address || null,
      date_of_birth: date_of_birth || null
    })
    .eq('id', id)

  if (error) return { error: error.message }
  
  revalidatePath('/staff')
  return { success: true }
}
