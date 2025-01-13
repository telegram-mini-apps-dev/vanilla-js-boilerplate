export async function chatWithMinimax(messages, options) {
  const payload = {
    url: "https://api.minimax.chat/v1/text/chatcompletion_v2",
    method: "POST",
    payload: JSON.stringify({
      model: "abab5.5s-chat",
      messages,
      stream: false,
      max_tokens: 256,
      temperature: 0.1,
      top_p: 0.95,
      ...options
    })
  };

  // Using the path in env instead of the direct URL
  const response = await fetch(import.meta.env.VITE_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload)
  });

  const { code, msg, response: _res } = await response.json();
  return { code, msg, response: JSON.parse(_res) };
}