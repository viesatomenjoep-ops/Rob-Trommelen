import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // 1. Fetch team members to get Tom and Tyler
    const { data: team, error: fetchError } = await supabase.from('team_members').select('*')
    
    if (fetchError) {
      return NextResponse.json({ error: fetchError.message })
    }

    let tomId = null;
    let tylerId = null;

    for (const member of team) {
      if (member.name.toLowerCase().includes('tom van biene') || member.name.toLowerCase().includes('tom')) {
        tomId = member.id;
      }
      if (member.name.toLowerCase().includes('tyler') || member.name.toLowerCase().includes('petrie')) {
        tylerId = member.id;
      }
    }

    const updates = [];

    // 2. Update Tom van Biene
    if (tomId) {
      const tomBio = "As the Head of IT and Lead Developer at Equivest, Tom van Biene brings over 5 years of specialized experience in designing, hosting, and managing high-end CMS and website infrastructures. He has successfully automated the entire digital ecosystem—ranging from intricate inventory management to dynamic scheduling systems. His architectural vision ensures that the platform is robust, extremely fast, and secure.";
      
      const { error: tomError } = await supabase.from('team_members').update({
        role: 'Head of IT & Lead Developer',
        bio: tomBio,
        sort_order: 1 // Helemaal bovenaan
      }).eq('id', tomId)
      
      if (tomError) updates.push(`Tom error: ${tomError.message}`)
      else updates.push('Tom updated successfully (Sort Order 1, Head of IT)')
    } else {
      updates.push('Tom van Biene not found in database.')
    }

    // 3. Update Tyler Petrie
    if (tylerId) {
      const { error: tylerError } = await supabase.from('team_members').update({
        sort_order: 2 // Onder Tom
      }).eq('id', tylerId)
      
      if (tylerError) updates.push(`Tyler error: ${tylerError.message}`)
      else updates.push('Tyler Petrie updated successfully (Sort Order 2)')
    } else {
      updates.push('Tyler Petrie not found in database.')
    }

    // 4. Update everyone else's sort order to be > 2
    for (const member of team) {
      if (member.id !== tomId && member.id !== tylerId) {
        // Shift them down
        await supabase.from('team_members').update({
          sort_order: (member.sort_order < 3) ? member.sort_order + 10 : member.sort_order
        }).eq('id', member.id)
      }
    }

    return NextResponse.json({ success: true, updates, message: "Tom and Tyler sorted!" })
  } catch (error: any) {
    return NextResponse.json({ error: error.message })
  }
}
