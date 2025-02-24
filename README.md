# erised
# Cloudflare Worker - Client Information and Metrics

This project contains a Cloudflare Worker script that collects and returns various details about the client making a request. The worker extracts metadata from Cloudflare headers, such as IP address, ASN, country, city, browser information, and request metrics, and formats the response in JSON or plain text.

## Features

- Retrieves the client's IP address using Cloudflare's `CF-Connecting-IP` header.
- Extracts browser information from the `User-Agent` header.
- Provides Cloudflare-specific details like ASN, ISP, country, city, and geolocation (latitude, longitude).
- Calculates response time and estimated data usage.
- Formats the response as JSON or plain text based on a query parameter (`format`).
- If the request comes from `curl`, returns a minimal response (only IP address).
- Supports basic filtering of empty or irrelevant values in the response.

## Usage

1. **Deploy the worker**:
   - Follow the [Cloudflare Worker documentation](https://developers.cloudflare.com/workers/) to deploy this worker to your Cloudflare account.

2. **Access the worker**:
   - Once deployed, the worker can be accessed via the assigned Cloudflare Worker URL.

3. **Request Parameters**:
   - `format`: Specify the response format as either `json` or `text` by adding it as a query parameter in the URL.
     - Example: `https://your-worker-url?format=json`
     - Default format is `text`.

4. **Curl Detection**:
   - If the request's `User-Agent` starts with `curl/`, the worker will return a minimal response with just the client IP address.

## Example Responses

### JSON Format

```json
{
  "Public IP": "203.0.113.195",
  "ASN": "12345",
  "ISP": "Cloudflare, Inc.",
  "Country": "US",
  "City": "San Francisco",
  "Region": "California",
  "PoP Site": "SFO",
  "Latitude, Longitude": "37.7749,-122.4194",
  "Postal Code": "94107",
  "Timezone": "PST",
  "User Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
  "Browser Info": "Chrome on Windows",
  "TLS Version": "TLSv1.2",
  "HTTP Protocol": "HTTP/2",
  "CF Ray ID": "abc123xyz",
  "Edge Request ID": "def456uvw",
  "Response Time (ms)": 15,
  "Estimated Data Usage (bytes)": 512
}
```
### Plaintext Format
Public IP: 203.0.113.195
ASN: 12345
ISP: Cloudflare, Inc.
Country: US
City: San Francisco
Region: California
PoP Site: SFO
Latitude, Longitude: 37.7749,-122.4194
Postal Code: 94107
Timezone: PST
User Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36
Browser Info: Chrome on Windows
TLS Version: TLSv1.2
HTTP Protocol: HTTP/2
CF Ray ID: abc123xyz
Edge Request ID: def456uvw
Response Time (ms): 15
Estimated Data Usage (bytes): 512

### Curl Minimal Response
203.0.113.195 (Just IP)

### Requirements
	•	Cloudflare Workers account.
	•	A domain or subdomain configured to point to the worker.
