import { NextResponse } from 'next/server';
import MailerLite from '@mailerlite/mailerlite-nodejs';
const apiKey = process.env.MAILERLITE_API_KEY;

/**
 * An asynchronous function that handles POST requests. 
 * 
 * This function performs the following operations:
 * 1. Checks if the 'webflow_auth' cookie is present. If not, it returns a JSON response indicating that the user is not authenticated.
 * 2. Retrieves the 'webflow_auth' cookie value and initializes the Webflow API client.
 * 3. Extracts the 'siteId' from the request body. If either of these is missing, it returns a JSON response indicating the missing parameters.
 * 4. Downloads the file from the provided 'imageURL', generates its MD5 hash, and stores it in a temporary directory.
 * 5. Makes a POST request to the Webflow API to generate an AWS S3 presigned post, using the 'siteId', file name, and file hash.
 * 6. Uploads the file to AWS S3 using the details provided in the presigned post.
 * 7. If the upload is successful, it deletes the file from the temporary directory and returns a JSON response indicating success and the status of the upload response.
 * 8. If any error occurs during the process, it returns a JSON response with the error message.
 * 
 * @param {Object} request - The request object, expected to contain 'imageURL' and 'siteId' in its JSON body.
 * @returns {Object} A NextResponse object containing a JSON response. The response contains a status of the operation and, in case of an error, an error message.
 * 
 * @throws Will throw an error if the 'imageURL' or 'siteId' is missing in the request, if there's an HTTP error when fetching the image, or if the upload to Webflow fails.
 */

//from the webhook will publish for mailierte 
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
    return NextResponse.json({ error: 'invalid payload structure' });
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
    console.log(response.data);
    return NextResponse.json({ success: true });
  })
  .catch(error => {
    console.error(error.response ? error.response.data : error.message);
    return NextResponse.json({ error: 'Failed to process webhook' });
  });
}



// Get fields from Mailerlite
export async function GET(request) {

  // Commented out for now as it's not being used
  // const { searchParams } = new URL(request.url);
  // const auth = searchParams.get('auth');

  // For now, using apiKey directly, but remember to use a client-facing token later
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
    // Make concurrent API calls
    const [groupsResponse, fieldsResponse] = await Promise.all([
      mailerlite.groups.get(),
      mailerlite.fields.get()
    ]);

    const simplifiedGroups = groupsResponse.data.data.map(group => ({
      id: group.id,
      name: group.name
    }));

    const simplifiedFields = fieldsResponse.data.data.map(fields => ({
      id: fields.id,
      name: fields.name,
      key: fields.key
    }));
    
    // Construct your return object
    return NextResponse.json({
      groups: simplifiedGroups,
      fields: simplifiedFields
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
