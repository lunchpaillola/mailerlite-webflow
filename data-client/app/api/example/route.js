import { getAPIClient } from '@/utils/webflow_helper';
import { NextResponse } from 'next/server';

/**
 * An asynchronous function that handles POST and GET requests. 
 * This function Gets and requests webhooks from the webflow APi
 */

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const siteId = searchParams.get("siteId");
  const auth = searchParams.get("auth");

  if (!auth || !siteId) {
    const webflowAPI = getAPIClient(auth);
    //implement the rest of your Webflow REST API logic here
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

  try {
    return NextResponse.json(
      { response: "ok" },
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
  const siteId = searchParams.get("siteId");
  const auth = searchParams.get("auth");

  if (!auth || !siteId) {
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

  try {
    const webflowAPI = getAPIClient(auth);
    //implement the rest of your Webflow REST API logic here
    return NextResponse.json(
      { response: "ok" },
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

