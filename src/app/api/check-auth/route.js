// src/app/api/check-auth/route.js
import { google } from 'googleapis';

export async function GET() {
  try {
    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/oauth2callback`
    );

    // Check if tokens are stored and valid
    const tokens = {}; // Fetch tokens from storage (e.g., session or database)
    oAuth2Client.setCredentials(tokens);

    // Verify token validity or authentication status
    const isAuthenticated = tokens.access_token ? true : false;

    return new Response(JSON.stringify({ isAuthenticated }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response('Error checking authentication status.', { status: 500 });
  }
}
