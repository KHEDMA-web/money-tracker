import { NextResponse } from "next/server";

export async function GET() {
  const authUser = process.env.AUTH_USERNAME;
  const authEmail = process.env.AUTH_EMAIL;
  const supaUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supaKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return NextResponse.json({
    AUTH_USERNAME: authUser ? `OK (len=${authUser.length}, val="${authUser}")` : "UNDEFINED",
    AUTH_EMAIL: authEmail ? `OK (len=${authEmail.length})` : "UNDEFINED",
    SUPABASE_URL: supaUrl ? `OK (len=${supaUrl.length})` : "UNDEFINED",
    SUPABASE_KEY: supaKey ? `OK (len=${supaKey.length})` : "UNDEFINED",
  });
}
