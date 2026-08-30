// Server-side only (e.g. app/api/delete-account/route.ts in Next.js).
// NEVER call auth.admin.deleteUser from client-side code — it requires
// the service_role key, which must stay secret on the server.

import { createClient } from '@supabase/supabase-js'

// This client uses the SECRET service_role key — only use it in server code.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!  // secret, server-only env var
)

export async function POST(request: Request) {
  // 1. Get the requester's own session from their auth cookie/token —
  //    never trust a user_id passed in the request body, or anyone
  //    could delete anyone else's account.
  const supabaseUser = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: request.headers.get('Authorization')! } } }
  )
  const { data: { user }, error: userError } = await supabaseUser.auth.getUser()

  if (userError || !user) {
    return Response.json({ error: 'Not authenticated' }, { status: 401 })
  }

  // 2. (Optional but recommended) Delete any Storage files owned by
  //    this user first -- deleteUser fails if storage objects remain.
  // await supabaseAdmin.storage.from('avatars').remove([`${user.id}/avatar.png`])

  // 3. Delete the auth user. Because events, guest_activity_log, and
  //    profiles all have "on delete cascade" foreign keys to auth.users,
  //    this single call wipes all their related data automatically.
  const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id)

  if (deleteError) {
    return Response.json({ error: deleteError.message }, { status: 500 })
  }

  return Response.json({ success: true })
}