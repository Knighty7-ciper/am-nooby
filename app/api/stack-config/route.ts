export async function GET() {
  return Response.json({
    projectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID,
    publishableClientKey: process.env.STACK_PUBLISHABLE_CLIENT_KEY,
  })
}
