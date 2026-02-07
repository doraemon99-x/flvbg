export async function onRequest(context) {
  const { request } = context
  const url = new URL(request.url)
  const videoUrl = url.searchParams.get("url")

  if (!videoUrl) {
    return new Response("Missing ?url= parameter", { status: 400 })
  }

  // Ambil header Range biar streaming bisa seek
  const headers = new Headers()
  const range = request.headers.get("Range")
  if (range) headers.set("Range", range)

  // Fetch ke video asli
  const response = await fetch(videoUrl, {
    headers,
    cf: {
      cacheEverything: true,
      cacheTtl: 3600
    }
  })

  // Clone header
  const newHeaders = new Headers(response.headers)

  // Header biar bisa diputar di browser
  newHeaders.set("Access-Control-Allow-Origin", "*")
  newHeaders.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS")
  newHeaders.set("Access-Control-Allow-Headers", "*")
  newHeaders.set("Content-Type", "video/x-flv")

  return new Response(response.body, {
    status: response.status,
    headers: newHeaders
  })
}
