// src/app/api/oauth2callback/route.js
import { google } from 'googleapis';

export async function GET(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return new Response('Error: Missing authorization code.', { status: 400 });
  }

  try {
    console.log("ddddsdklfjadsk")
    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/oauth2callback`
    );

    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    // Create a response object
    const htmlContent = `
    <html>
      <head>
        <title>Authentication Successful</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
      </head>
      <body class="bg-black text-[#F4F4F9] flex items-center justify-center min-h-screen">
        <div class="text-center">
          <img src="/images/celebrate.gif" alt="celebrate" class="w-1/2 h-1/2 mx-auto">
          <p class="text-lg" style="color: #F4F4F9 !important;">Authentication successful! You can close this tab.</p> <!-- Added inline style -->
          <script>
            localStorage.setItem('isAuthenticated', 'true');
          </script>
        </div>
      </body>
    </html>
  `;

  const response = new Response(htmlContent, {
    headers: { 'Content-Type': 'text/html' },
  });

  // Set cookies
  const cookieOptions = `HttpOnly; Secure; Path=/; ${process.env.NODE_ENV === 'production' ? 'SameSite=None;' : ''}`;
  response.headers.append('Set-Cookie', `access_token=${tokens.access_token}; ${cookieOptions}`);
  if (tokens.refresh_token) {
    response.headers.append('Set-Cookie', `refresh_token=${tokens.refresh_token}; ${cookieOptions}`);
  }

  return response;
  } catch (error) {
    return new Response('Error authenticating with Google.', { status: 500 });
  }
}
