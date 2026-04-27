'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getCurrentUserPermissions() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user || !user.email) return null

  const email = user.email.toLowerCase()

  // HARDCODED FALLBACK: Owners are ALWAYS superadmin, even if the database table is empty or deleted!
  if (email === 'tomvanbiene@gmail.com' || email === 'tomjo118735@gmail.com' || email === 'tom@equivest.com' || email === 'info@equivest.com' || email === 'info@equivestworldwide.com') {
    return {
      id: 'hardcoded-admin',
      email: email,
      role: 'superadmin',
      permissions: { all: true }
    }
  }

  const { data, error } = await supabase
    .from('admin_permissions')
    .select('*')
    .eq('email', email)
    .single()
    
  if (error || !data) {
    return null // User has no access record
  }
  
  return data
}

export async function getAllStaffPermissions() {
  const supabase = await createClient()
  
  // Security check: only superadmin can fetch this
  const currentUser = await getCurrentUserPermissions()
  if (!currentUser || currentUser.role !== 'superadmin') {
    throw new Error('Unauthorized. Only Super Admin can view staff permissions.')
  }

  const { data, error } = await supabase
    .from('admin_permissions')
    .select('*')
    .order('created_at', { ascending: false })
    
  if (error) throw new Error(error.message)
  return data || []
}

export async function addStaffMember(email: string) {
  const supabase = await createClient()
  
  const currentUser = await getCurrentUserPermissions()
  if (!currentUser || currentUser.role !== 'superadmin') {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase
    .from('admin_permissions')
    .insert([{ 
      email: email.toLowerCase().trim(), 
      role: 'staff', 
      permissions: {} 
    }])
    
  if (error) throw new Error(error.message)
  revalidatePath('/admin/settings')
}

export async function updateStaffPermissions(id: string, permissions: any) {
  const supabase = await createClient()
  
  const currentUser = await getCurrentUserPermissions()
  if (!currentUser || currentUser.role !== 'superadmin') {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase
    .from('admin_permissions')
    .update({ permissions })
    .eq('id', id)
    
  if (error) throw new Error(error.message)
  revalidatePath('/admin/settings')
}

export async function removeStaffMember(id: string) {
  const supabase = await createClient()
  
  const currentUser = await getCurrentUserPermissions()
  if (!currentUser || currentUser.role !== 'superadmin') {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase
    .from('admin_permissions')
    .delete()
    .eq('id', id)
    .neq('role', 'superadmin') // Prevent deleting superadmins this way
    
  if (error) throw new Error(error.message)
  revalidatePath('/admin/settings')
}
