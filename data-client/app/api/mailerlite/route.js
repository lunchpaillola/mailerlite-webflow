import { NextResponse } from 'next/server';
import MailerLite from '@mailerlite/mailerlite-nodejs';
const apiKey = process.env.MAILERLITE_API_KEY;

/**
 * Handles POST requests to process Webflow webhooks and update subscribers.
 *
 * @async
 * @param {Request} request - The incoming HTTP request object.
 * @returns {Response} The HTTP response indicating success or an error message.
 */

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  const group = searchParams.get("group");
  
  if (!group || !email) {
    return NextResponse.json({ error: 'incomplete webhook' }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  const payload = await request.json();
  
  // Validate the structure of the payload (consider expanding this)
  if (!payload.payload || !payload.payload.data || !(email in payload.payload.data)) {
    return NextResponse.json({ error: 'no email field in webhook' });
  }

  const submittedEmail = payload.payload.data[email];
  const mailerlite = new MailerLite({
    api_key: apiKey
  });
  
  // Using promise-based approach
  return mailerlite.subscribers.createOrUpdate({
    email: submittedEmail,
    groups: [group],
    status: "active", 
  })
  .then(response => {
    return NextResponse.json({ success: true });
  })
  .catch(error => {
    console.error(error.response ? error.response.data : error.message);
    return NextResponse.json({ error: 'Failed to process webhook' });
  });
}


/**
 * Handles GET requests to retrieve Mailerlite groups and fields.
 *
 * @async
 * @param {Request} request - The incoming HTTP request object.
 * @returns {Response} The HTTP response containing the requested Mailerlite groups and fields or an error message.
 */

export async function GET() {

  if (!apiKey) {
    return NextResponse.json({ok: false, error: 'Not authenticated'}, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }
  
  const mailerlite = new MailerLite({
    api_key: apiKey
  });

  try {
    const [groupsResponse] = await Promise.all([
      mailerlite.groups.get(),
    ]);

    const simplifiedGroups = groupsResponse.data.data.map(group => ({
      id: group.id,
      name: group.name
    }));
    
    // Construct your return object
    return NextResponse.json({
      groups: simplifiedGroups,
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
    
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message });
  }
}
