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

//GET a webgook

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const siteId = searchParams.get("siteId");
  const auth = searchParams.get("auth");

  if (!auth) {
    return NextResponse.json(
      { ok: false, error: "Not authenticated" },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, DELETE",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  }

  const webflowAPI = getAPIClient(auth);

  try {
    const response = await webflowAPI.get(`sites/${siteId}/webhooks`);
    return NextResponse.json(
      { webhooks: response.data },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, DELETE",
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
  const pageId = searchParams.get("pageId");
  const pageName=searchParams.get("pageName");
  const formName = searchParams.get("formName");

  const params = new URLSearchParams({
    email: fieldConnection.email,
    group: fieldConnection.group,
  });
  const webhookUrl = `${BACKEND_URL}/api/mailerlite?${params.toString()}`;

  if (!auth) {
    console.log("error");
    return NextResponse.json(
      { ok: false, error: "Not authenticated" },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, DELETE",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  }

  const webflowAPI = getAPIClient(auth);

  try {
    const response = await webflowAPI.post(`sites/${siteId}/webhooks`, {
      triggerType: "form_submission",
      url: webhookUrl,
      filter: {
        pageId: pageId,
        formName: formName,
        pageName: pageName
      },
    });
    return NextResponse.json(
      { webhooks: response.data },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, DELETE",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message });
  }
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const auth = searchParams.get("auth");
  const webhookId = searchParams.get("webhookId");

  if (!auth) {
    console.log("error");
    return NextResponse.json(
      { ok: false, error: "Not authenticated" },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "DELETE,",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  }

  const webflowAPI = getAPIClient(auth);

  try {
    const response = await webflowAPI.delete(`webhooks/${webhookId}`);

    // Create a response with a 204 status code to indicate success with no content.
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "DELETE,",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    console.error(error);

    // Here you can also provide an appropriate status code, for example, 400 for a bad request, or 500 for server errors.
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: error.response?.status || 500,
    });
  }
}

