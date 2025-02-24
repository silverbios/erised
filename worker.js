// Function to get client IP
function getClientIP(request) {
  return request.headers.get('CF-Connecting-IP') || "Not Available";
}

// Parse Browser Information from User-Agent
function getBrowserInfo(userAgent) {
  if (!userAgent) return "Unknown";
  const uaData = userAgent.toLowerCase();
  const browser = uaData.includes("chrome") ? "Chrome" :
                  uaData.includes("firefox") ? "Firefox" :
                  uaData.includes("safari") ? "Safari" :
                  "Unknown Browser";
  return `${browser} on ${uaData.includes("linux") ? "Linux" :
                          uaData.includes("windows") ? "Windows" :
                          uaData.includes("mac") ? "macOS" : "Unknown OS"}`;
}

// Function to build response details with valid Cloudflare data and metrics by default
async function buildDetailsResponse(request) {
  const start = Date.now(); // Start timer

  const details = {
    "Public IP": getClientIP(request),
    "ASN": request.cf.asn || "N/A",
    "ISP": request.cf.asOrganization || "N/A",
    "Country": request.cf.country || "N/A",
    "City": request.cf.city || "Unknown City",
    "Region": request.cf.region || "Unknown Region",
    "PoP Site": request.cf.colo || "N/A",
    "Latitude, Longitude": request.cf.latitude && request.cf.longitude ? `${request.cf.latitude},${request.cf.longitude}` : "N/A",
    "Postal Code": request.cf.postalCode || "N/A",
    "Timezone": request.cf.timezone || "N/A",
    "User Agent": request.headers.get('User-Agent'),
    "Browser Info": getBrowserInfo(request.headers.get('User-Agent')),
    "TLS Version": request.cf.tlsVersion || "N/A",
    "HTTP Protocol": request.cf.httpProtocol || "N/A",
    "CF Ray ID": request.headers.get('CF-RAY') || "N/A",
    "Edge Request ID": request.headers.get('CF-Request-ID') || "N/A"
  };

  // Simulate slight delay to ensure response time is noticeable
  await new Promise(resolve => setTimeout(resolve, 1)); // 1ms delay

  // Metrics calculation
  const end = Date.now(); // End timer for response time calculation
  details["Response Time (ms)"] = end - start;
  details["Estimated Data Usage (bytes)"] = JSON.stringify(details).length;

  // Filter out any fields with empty, null, "N/A", "Unknown City", or "Unknown Region" values
  return Object.fromEntries(
    Object.entries(details).filter(([_, value]) => 
      value && value !== "N/A" && value !== "Unknown City" && value !== "Unknown Region"
    )
  );
}

// Format response in JSON or Text based on the query parameter
function formatResponse(details, format) {
  if (format === "json") {
    return new Response(JSON.stringify(details, null, 2), {
      headers: { "content-type": "application/json" },
    });
  }

  const plainText = Object.entries(details)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");

  return new Response(plainText);
}

// Main handler function with curl condition
async function handleRequest(request) {
  const userAgent = request.headers.get('User-Agent') || '';
  const isCurl = userAgent.startsWith('curl/');

  if (isCurl) {
    // Return a minimal response if curl is detected
    return new Response(`${getClientIP(request)}\n`);
  }

  const url = new URL(request.url);
  const format = url.searchParams.get("format") || "text";

  const details = await buildDetailsResponse(request);
  return formatResponse(details, format);
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});
