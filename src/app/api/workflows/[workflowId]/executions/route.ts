// app/api/workflow/${workflowId}/executions/route.ts
import { GetWorkflowExecutions } from "@/actions/workflows/getWorkflowExecution";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ workflowId: string }> }
) {
  try {
    // Authenticate the user
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract workflowId from the dynamic route parameter
    const { workflowId } = await params;

    if (!workflowId) {
      return NextResponse.json(
        { error: "Workflow ID is required" },
        { status: 400 }
      );
    }

    // Call your existing server action
    const executions = await GetWorkflowExecutions(workflowId);

    // Return the data as JSON
    return NextResponse.json(executions);
  } catch (error) {
    console.error("Failed to fetch workflow executions:", error);
    return NextResponse.json(
      { error: "Failed to fetch workflow executions" },
      { status: 500 }
    );
  }
}
