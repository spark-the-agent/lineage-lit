/**
 * Fallback stub when Convex codegen has not been run.
 * Run `npx convex dev` to generate the real _generated files for your schema.
 * This allows internal.db.* and other internal function references to type-check.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FunctionReference } from "convex/server";

type InternalApi = {
  db: {
    getLineageRequest: import("convex/server").FunctionReference<"query", "internal", any, any>;
    updateLineageStatus: import("convex/server").FunctionReference<"mutation", "internal", any, any>;
    completeLineageRequest: import("convex/server").FunctionReference<"mutation", "internal", any, any>;
    failLineageRequest: import("convex/server").FunctionReference<"mutation", "internal", any, any>;
  };
  ai: {
    processLineageRequest: import("convex/server").FunctionReference<"action", "internal", any, any>;
  };
};

export const internal: InternalApi = {} as InternalApi;
export const api = {} as Record<string, Record<string, FunctionReference<any, any, any, any>>>;
