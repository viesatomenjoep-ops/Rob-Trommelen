export const dynamic = 'force-dynamic'

import { getTeamMembers } from '@/app/actions/team'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import Image from 'next/image'

export default async function AdminTeamPage() {
  let team = [];
  try {
    team = await getTeamMembers() || [];
  } catch (error) {
    console.error("Supabase not configured yet or error fetching team", error);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">Team Members</h1>
        <div className="flex gap-3">
          <Link href="/admin/pages/about" className="inline-flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:w-auto transition-colors">
            Edit "About" Texts
          </Link>
          <Link href="/admin/team/new" className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:w-auto transition-colors">
            <Plus className="-ml-1 mr-2 h-5 w-5" />
            Add Team Member
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Photo</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name & Role</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Bio Preview</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {team.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                  No team members found. Click "Add Team Member" to create one.
                </td>
              </tr>
            ) : (
              team.map((member: any) => (
                <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden relative">
                      {member.image_url ? (
                        <Image src={member.image_url} alt={member.name} fill className="object-cover" />
                      ) : (
                        <span className="absolute inset-0 flex items-center justify-center text-gray-400">?</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{member.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{member.role}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                    {member.bio}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-3">
                      <Link href={`/admin/team/${member.id}/edit`} className="text-primary hover:text-secondary">Edit</Link>
                      <form action={async () => {
                        'use server';
                        const { deleteTeamMember } = await import('@/app/actions/team');
                        await deleteTeamMember(member.id);
                      }}>
                        <button type="submit" className="text-red-600 hover:text-red-900">Delete</button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
