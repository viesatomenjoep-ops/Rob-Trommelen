'use server'

import { createClient } from '@/lib/supabase/server'
import { unstable_noStore as noStore } from 'next/cache'

// Called on the public page when a property is viewed
export async function incrementPropertyView(propertyId: string) {
  // Try to use the RPC function first
  const supabase = await createClient()
  await supabase.rpc('increment_property_view', { property_id: propertyId })
}

// Fetch analytics for the dashboard
export async function getDashboardStats() {
  noStore() // Ensure we don't cache dashboard stats
  const supabase = await createClient()
  
  // Get top viewed properties
  const { data: topProperties } = await supabase
    .from('properties')
    .select('id, name, views, image_url')
    .order('views', { ascending: false, nullsFirst: false })
    .limit(5)
    
  // Get total properties
  const { count: totalProperties } = await supabase
    .from('properties')
    .select('id', { count: 'exact', head: true })
    
  // Get total appointments
  const { count: totalAppointments } = await supabase
    .from('appointments')
    .select('id', { count: 'exact', head: true })

  // Get total quotes
  const { count: totalQuotes } = await supabase
    .from('quotes')
    .select('id', { count: 'exact', head: true })

  // Get inventory data for financial dashboard
  const { data: inventoryData } = await supabase
    .from('inventory_items')
    .select('quantity, purchase_price, selling_price')
    
  // Get total team members
  const { count: totalTeamMembers } = await supabase
    .from('team')
    .select('id', { count: 'exact', head: true })

  let inventoryCost = 0;
  let inventoryValue = 0;
  
  if (inventoryData) {
    inventoryData.forEach(item => {
      const q = Number(item.quantity) || 0;
      const buy = Number(item.purchase_price) || 0;
      const sell = Number(item.selling_price) || 0;
      inventoryCost += (q * buy);
      inventoryValue += (q * sell);
    });
  }

  return {
    topProperties: topProperties || [],
    totalProperties: totalProperties || 0,
    totalAppointments: totalAppointments || 0,
    totalQuotes: totalQuotes || 0,
    totalTeamMembers: totalTeamMembers || 0,
    inventoryCost,
    inventoryValue,
    inventoryProfit: inventoryValue - inventoryCost
  }
}
