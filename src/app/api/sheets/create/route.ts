import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch the customer record with their Google tokens
  const { data: customer, error: fetchError } = await supabase
    .from("customers")
    .select("google_access_token, google_refresh_token, google_token_expires_at, google_sheet_id")
    .eq("id", user.id)
    .single();

  if (fetchError || !customer) {
    return NextResponse.json({ error: "Customer not found" }, { status: 404 });
  }

  if (!customer.google_access_token) {
    return NextResponse.json(
      { error: "Google not connected. Please connect first." },
      { status: 400 }
    );
  }

  // If a sheet already exists, return its URL
  if (customer.google_sheet_id) {
    return NextResponse.json({
      sheetId: customer.google_sheet_id,
      url: `https://docs.google.com/spreadsheets/d/${customer.google_sheet_id}`,
      existing: true,
    });
  }

  // Refresh the access token if needed
  let accessToken = customer.google_access_token;
  const expiresAt = customer.google_token_expires_at
    ? new Date(customer.google_token_expires_at)
    : new Date(0);

  if (expiresAt.getTime() - Date.now() < 5 * 60 * 1000) {
    // Token expires in less than 5 minutes — refresh it
    if (!customer.google_refresh_token) {
      return NextResponse.json(
        { error: "Refresh token missing. Please reconnect Google." },
        { status: 400 }
      );
    }

    const refreshResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        refresh_token: customer.google_refresh_token,
        grant_type: "refresh_token",
      }),
    });

    if (!refreshResponse.ok) {
      const err = await refreshResponse.text();
      console.error("Token refresh failed:", err);
      return NextResponse.json(
        { error: "Failed to refresh Google token" },
        { status: 500 }
      );
    }

    const refreshData = await refreshResponse.json();
    accessToken = refreshData.access_token;

    // Save new access token + expiry
    const newExpiresAt = new Date(
      Date.now() + refreshData.expires_in * 1000
    ).toISOString();

    await supabase
      .from("customers")
      .update({
        google_access_token: accessToken,
        google_token_expires_at: newExpiresAt,
      })
      .eq("id", user.id);
  }

  // Create the Sheet
  const createResponse = await fetch(
    "https://sheets.googleapis.com/v4/spreadsheets",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        properties: {
          title: "SlipToDB Invoices",
        },
        sheets: [
          {
            properties: {
              title: "Invoices",
            },
            data: [
              {
                startRow: 0,
                startColumn: 0,
                rowData: [
                  {
                    values: [
                      { userEnteredValue: { stringValue: "Date" } },
                      { userEnteredValue: { stringValue: "Vendor" } },
                      { userEnteredValue: { stringValue: "Invoice #" } },
                      { userEnteredValue: { stringValue: "Due Date" } },
                      { userEnteredValue: { stringValue: "Currency" } },
                      { userEnteredValue: { stringValue: "Subtotal" } },
                      { userEnteredValue: { stringValue: "Tax" } },
                      { userEnteredValue: { stringValue: "Total" } },
                      { userEnteredValue: { stringValue: "Filename" } },
                      { userEnteredValue: { stringValue: "Processed At" } },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      }),
    }
  );

  if (!createResponse.ok) {
    const err = await createResponse.text();
    console.error("Sheet creation failed:", err);
    return NextResponse.json(
      { error: "Failed to create Google Sheet. " + err.substring(0, 200) },
      { status: 500 }
    );
  }

  const sheetData = await createResponse.json();
  const sheetId = sheetData.spreadsheetId;

  // Save the sheet ID to the customer record
  const { error: saveError } = await supabase
    .from("customers")
    .update({ google_sheet_id: sheetId })
    .eq("id", user.id);

  if (saveError) {
    console.error("Failed to save sheet ID:", saveError);
    return NextResponse.json(
      { error: "Sheet created, but ID not saved" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    sheetId,
    url: `https://docs.google.com/spreadsheets/d/${sheetId}`,
    existing: false,
  });
}
