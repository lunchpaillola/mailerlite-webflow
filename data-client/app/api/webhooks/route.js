import { getAPIClient } from "@/utils/webflow_helper";
import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

/**
 * Handles GET requests to retrieve webhooks for a Webflow site using the provided authentication.
 *
 * @async
 * @param {Request} request - The incoming HTTP request object.
 * @returns {Response} The HTTP response containing the requested webhooks or an error message.
 */

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
  
    // Filter webhooks with URLs ending in '/api/mailerlite'
const filteredWebhooks = response.data.webhooks.filter((webhook) => {
  return webhook.url.includes('/api/mailerlite');
});

    return NextResponse.json(
      { webhooks: filteredWebhooks },
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

/**
 * Handles POST requests to create a webhook for a Webflow site using the provided authentication.
 *
 * @async
 * @param {Request} request - The incoming HTTP request object.
 * @returns {Response} The HTTP response indicating success or an error message.
 */

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const fieldConnectionString = searchParams.get("fieldConnection");
  const fieldConnection = JSON.parse(fieldConnectionString);
  const siteId = searchParams.get("siteId");
  const auth = searchParams.get("auth");
  const pageId = searchParams.get("pageId");
  const pageName = searchParams.get("pageName");
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
        pageName: pageName,
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

/**
 * Handles DELETE requests to remove a webhook from a Webflow site using the provided authentication.
 *
 * @async
 * @param {Request} request - The incoming HTTP request object.
 * @returns {Response} The HTTP response indicating success or an error message.
 */

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
