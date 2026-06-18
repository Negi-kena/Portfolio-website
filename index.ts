import "@supabase/functions-js/edge-runtime.d.ts";

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

console.log("Portfolio Email Node Booted successfully.");

// Clean standard serverless export structure
Deno.serve(async (req) => {
  // Handle CORS Preflight security handshakes
  if (req.method === 'OPTIONS') {
    return new Response('ok', { 
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      }
    });
  }

  try {
    // 1. Parse incoming webhook payload
    const payload = await req.json();
    console.log("Raw Webhook Payload Caught:", JSON.stringify(payload));

    // 2. Extract the data safely (Handles all standard Supabase webhook shapes)
    const record = payload.record || payload.new || payload;

    if (!record || (!record.name && !record.email)) {
      throw new Error("Could not find valid record metrics inside incoming payload.");
    }

    // 3. Dispatch data straight to Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Portfolio Contact <onboarding@resend.dev>',
        to: 'kennaakoo143@gmail.com', 
        subject: `💼 Portfolio Message from ${record.name || 'Anonymous Client'}`,
        html: `
          <h3>You received a new message from your portfolio site!</h3>
          <p><strong>Name:</strong> ${record.name || 'N/A'}</p>
          <p><strong>Email:</strong> ${record.email || 'N/A'}</p>
          <p><strong>Message:</strong></p>
          <blockquote style="background: #f1f5f9; padding: 15px; border-left: 4px solid #6366f1;">
            ${record.message || 'No content provided.'}
          </blockquote>
          <br>
          <small>Database ID Tracker: ${record.id || 'N/A'}</small>
        `,
      }),
    });

    const resendData = await response.json();
    console.log("Resend API Gateway Response Status:", response.status, resendData);
    
    return new Response(JSON.stringify({ success: true, data: resendData }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });

  } catch (error) {
    console.error("Critical Execution Fault:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
});