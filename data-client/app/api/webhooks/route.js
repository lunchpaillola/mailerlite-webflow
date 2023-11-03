import { getAPIClient } from "@/utils/webflow_helper";
import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

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

// Create a wbeflow hook

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const siteId = searchParams.get("siteId");
  const auth = searchParams.get("auth");

  if (!auth) {
    console.log("error");
    return NextResponse.json(
      { ok: false, error: "Not authenticated" },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  }

  const webflowAPI = getAPIClient(auth);


  try {
    console.log("trying to get the webgooks");
    const response = await webflowAPI.get(`sites/${siteId}/webhooks`);
    console.log("getting the webhooks, response", response.data);
    return NextResponse.json(
      { webhooks: response.data },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message });
  }
}


export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const fieldConnectionString = searchParams.get("fieldConnection");
  const fieldConnection = JSON.parse(fieldConnectionString);
  const siteId = searchParams.get("siteId");
  const auth = searchParams.get("auth");
  const formId = searchParams.get("formId");


  const params = new URLSearchParams({
    email: fieldConnection.email,
    group: fieldConnection.group
  });
  const webhookUrl = `${BACKEND_URL}/api/webhooks?${params.toString()}`;

  if (!auth) {
    console.log("error");
    return NextResponse.json(
      { ok: false, error: "Not authenticated" },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  }

  const webflowAPI = getAPIClient(auth);


  try {
    const response = await webflowAPI.post(`sites/${siteId}/webhooks`,
    {
      triggerType: "form_submission",
      url: webhookUrl,
      filter: {
        id: formId,
      },
    });
    return NextResponse.json(
      { webhooks: response.data },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message });
  }
}
