import { getAPIClient } from '@/utils/webflow_helper';
import { NextResponse } from 'next/server';

/**
 * Handles GET requests to retrieve forms from a Webflow site using the provided authentication.
 *
 * @async
 * @param {Request} request - The incoming HTTP request object.
 * @returns {Response} The HTTP response containing the requested forms or an error message.
 */

// Get forms from Webflow
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const auth = searchParams.get('auth');
  const siteId = searchParams.get('siteId');
  
  if (!auth) {
    return NextResponse.json({ok: false, error: 'Not authenticated'}, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }
  
  const webflowAPI = getAPIClient(auth);

  try {
    const response = await webflowAPI.get(`/sites/${siteId}/forms`);
    return NextResponse.json({ forms: response.data }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
}

