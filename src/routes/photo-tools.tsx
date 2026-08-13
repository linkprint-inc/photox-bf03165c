import { createFileRoute, redirect } from "@tanstack/react-router";

type ToolId = "restore" | "enhance" | "text";
const ids: ToolId[] = ["restore", "enhance", "text"];

/**
 * Photo tools are now part of the custom print workflow.
 * This route stays for compatibility and forwards into that editing state.
 */
export const Route = createFileRoute("/photo-tools")({
  validateSearch: (search: Record<string, unknown>): { tool?: ToolId } =>
    ids.includes(search["tool"] as ToolId) ? { tool: search["tool"] as ToolId } : {},
  beforeLoad: ({ search }) => {
    throw redirect({ to: "/custom", search: search.tool ? { tool: search.tool } : {} });
  },
  component: () => null,
});
