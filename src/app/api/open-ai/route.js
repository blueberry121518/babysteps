import OpenAI from "openai";

export async function POST(request) {
  try {
    console.log("Request received");

    const openai = new OpenAI(
      {
        apiKey: process.env.OPEN_AI_API_KEY,
      }
    );

    // Get today's date
    const date1 = new Date().toISOString().split('T')[0];
    const todaydate = date1; // Assign today's date to the variable "todaydate"

    // Parse the JSON body from the request
    const { goal, date, frequency, type } = await request.json();

    const weekFrequency = Math.floor(7 / frequency);

    function specificResponse(type) {
      if (type === "habit") {
        return "Make it so that the difficulty starts really easy to build the habit. As time passes, ramp up the difficulty but make sure it is still within reason."
      }
      else if (type === "project") {
        return "Make sure that the goals aren't too specific because you don't know what the user has planned. Instead, make general goals and it's fine if the goals repeat. Just make sure that the goals are spread out so that the user has a plan that follows a realistic and efficient timeline"
      }
      else if (type === "skill") {
        return "Make sure that the goals start easy to accomplish so that the user isn't overwhelmed in the beginning."
      }
    }

    // Create the completion using the OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a helpful assistant. Always respond with a valid JSON object." },
        { role: "user", content: `Today's date is: ${todaydate}`},
        {
          role: "user",
          content: `
            My goal is ${type} based
            I want to ${goal}.
            Make micro goals for me every ${weekFrequency} days in the form of a JSON file that looks like the following example:
            [
              MicroGoals: [
                {
                  Summary:
                  Description:
                  Start:
                  End:
                },
                {
                  Summary:
                  Description:
                  Start:
                  End:
                }
              ]
            ]
            Make sure the start and end dates are in YYYY-MM-DD format.
            Do this until ${date}
            ${specificResponse(type)}
          `,
        },
      ],
    });

    const message = completion.choices[0].message.content;

    // Parse the JSON from the GPT response
    let parsedJson;
    try {
      parsedJson = JSON.parse(message);
    } catch (parseError) {
      console.error("Error parsing GPT response as JSON:", parseError);
      return new Response(JSON.stringify({
        error: 'Invalid JSON response from GPT',
        rawResponse: message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Generate a filename for the JSON file
    const filename = `goals_${new Date().toISOString().split('T')[0]}.json`;

    // Log the contents of the returned response
    console.log("Response content:", JSON.stringify(parsedJson, null, 2));

    // Return the parsed JSON response as a downloadable file
    return new Response(JSON.stringify(parsedJson, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });

  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(JSON.stringify({
      error: 'Error processing request',
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}