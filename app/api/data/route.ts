export async function GET() {
  const res = await fetch(`${process.env.API_URL}/data`, {
    headers: {
      "x-api-key": process.env.API_KEY as string,
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    return new Response("API error", { status: 500 });
  }

  const data = await res.json();

  return Response.json(data);
}
