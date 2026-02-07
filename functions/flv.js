export async function onRequest(context) {
  const { request } = context
  const url = new URL(request.url)
  const videoUrl = url.searchParams.get("url")

  if (!videoUrl) {
    return new Response("Missing ?url=", { status: 400 })
  }

  // Header pura-pura browser
  const headers = new Headers()
  const range = request.headers.get("Range")
  if (range) headers.set("Range", range)

  headers.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)")
  headers.set("Referer", "https://live3.procdnlive.com/")
  headers.set("Origin", "https://live3.procdnlive.com")

  const response = await fetch(videoUrl, {
    headers,
    cf: {
      cacheEverything: true,
      cacheTtl: 3600
    }
  })

  const newHeaders = new Headers(response.headers)
  newHeaders.set("Access-Control-Allow-Origin", "*")
  newHeaders.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS")
  newHeaders.set("Access-Control-Allow-Headers", "*")
  newHeaders.set("Content-Type", "video/x-flv")

  return new Response(response.body, {
    status: response.status,
    headers: newHeaders
  })
}
