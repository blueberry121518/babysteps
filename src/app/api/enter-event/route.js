import { google } from 'googleapis';

export async function POST(request) {
    try {
        console.log("Entering POST function");

        // Extract cookies from the request
        const cookies = request.headers.get('cookie') || '';
        const accessTokenMatch = cookies.match(/access_token=([^;]+)/);
        const refreshTokenMatch = cookies.match(/refresh_token=([^;]+)/);

        const accessToken = accessTokenMatch ? accessTokenMatch[1] : null;
        const refreshToken = refreshTokenMatch ? refreshTokenMatch[1] : null;

        console.log("Access Token:", accessToken ? "Present" : "Missing");
        console.log("Refresh Token:", refreshToken ? "Present" : "Missing");

        if (!accessToken) {
            console.log("No access token found");
            return new Response('No access token found.', { status: 401 });
        }

        const body = await request.json();
        console.log("Request body:", body); // Added log to check the request body

        const {Summary, Description, Start, End} = body; // Removed location
        console.log("Event details:", { Summary, Description, Start, End }); // Updated log

        const oAuth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/oauth2callback`
        );

        oAuth2Client.setCredentials({
            access_token: accessToken,
            refresh_token: refreshToken,
        });

        const calendar = google.calendar({version: 'v3', auth: oAuth2Client});

        const endDate = new Date(End);
        endDate.setDate(endDate.getDate() + 1);
        const newEnd = endDate.toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'

        const start1 = new Date(Start).toISOString();
        const end1 = new Date(End).toISOString();
        console.log("Start:", start1);
        console.log("End:", end1);

        const event = {
            start: {
                date: Start,
                timeZone: 'America/Los_Angeles',
            },
            end: {
                date: newEnd,
                timeZone: 'America/Los_Angeles',
            },
            'summary': Summary,
            'description': Description,
        };

        console.log("Event object:", JSON.stringify(event, null, 2));

        console.log("Attempting to insert event");
        const response = await calendar.events.insert({
            calendarId: 'primary',
            resource: event,
        });

        console.log("Event inserted successfully");
        return new Response(JSON.stringify({ message: 'Event added successfully', event: response.data }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    }
    catch (error) {
        console.error("Error adding event: ", error);
        if (error.response) {
            console.error("Error response data:", error.response.data);
            console.error("Error response status:", error.response.status);
            console.error("Error response headers:", error.response.headers);
        }
        return new Response(JSON.stringify({
            message: 'Error creating calendar event',
            error: error.message,
            details: error.response?.data
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}