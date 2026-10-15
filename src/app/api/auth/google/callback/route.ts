import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state"); // user ID
  const error = searchParams.get("error");

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  // Handle user-denied access
  if (error) {
    return NextResponse.redirect(
      `${siteUrl}/dashboard?google_error=${encodeURIComponent(error)}`
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(
      `${siteUrl}/dashboard?google_error=missing_code`
    );
  }

  const clientId = process.env.GOOGLE_CLIENT_ID!;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI!;

  // Exchange code for tokens
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenResponse.ok) {
    const err = await tokenResponse.text();
    console.error("Token exchange failed:", err);
    return NextResponse.redirect(
      `${siteUrl}/dashboard?google_error=token_exchange_failed`
    );
  }

  const tokens = await tokenResponse.json();

  const {
    access_token,
    refresh_token,
    expires_in,
  } = tokens;

  const expiresAt = new Date(Date.now() + expires_in * 1000).toISOString();

  // Save tokens to the customer record
  const supabase = await createClient();
  const { error: updateError } = await supabase
    .from("customers")
    .update({
      google_access_token: access_token,
      google_refresh_token: refresh_token,
      google_token_expires_at: expiresAt,
      google_sheet_connected: true,
    })
    .eq("id", state);

  if (updateError) {
    console.error("Failed to save tokens:", updateError);
    return NextResponse.redirect(
      `${siteUrl}/dashboard?google_error=save_failed`
    );
  }

  // Success
  return NextResponse.redirect(
    `${siteUrl}/dashboard?google_connected=true`
  );
}
