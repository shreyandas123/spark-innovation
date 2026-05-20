const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://sparkel-sales-server.vercel.app';

export async function GET(request, context) {
  return handleRequest(request, context, 'GET');
}

export async function POST(request, context) {
  return handleRequest(request, context, 'POST');
}

export async function PUT(request, context) {
  return handleRequest(request, context, 'PUT');
}

export async function PATCH(request, context) {
  return handleRequest(request, context, 'PATCH');
}

export async function DELETE(request, context) {
  return handleRequest(request, context, 'DELETE');
}

export async function OPTIONS(request) {
  return new Response(null, { status: 204 });
}

async function handleRequest(request, context, method) {
  try {
    const { route } = context.params;
    const path = Array.isArray(route) ? route.join('/') : route;
    const url = new URL(request.url);
    const backendUrl = `${BACKEND_URL}/api/${path}${url.search}`;

    const headers = new Headers(request.headers);
    // Remove host header to avoid conflicts
    headers.delete('host');

    let body;
    if (method !== 'GET' && method !== 'DELETE') {
      body = await request.text();
    }

    const backendRes = await fetch(backendUrl, {
      method,
      headers,
      body,
      credentials: 'omit',
    });

    const data = await backendRes.text();

    return new Response(data, {
      status: backendRes.status,
      headers: {
        'Content-Type': backendRes.headers.get('content-type') || 'application/json',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return new Response(
      JSON.stringify({ error: 'Proxy request failed', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
