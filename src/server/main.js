Bun.serve({
  hostname: '0.0.0.0',
  port: 3000,
  fetch(request) {
    console.log(request)
    const response = {}
    response.success = true
    return new Response(
      JSON.stringify(response),
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    )
  }
})

console.log('Listening on port 3000, all IPs')