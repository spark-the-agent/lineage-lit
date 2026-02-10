/**
 * Fallback stub when Convex codegen has not been run.
 * Run `npx convex dev` to generate the real _generated files for your schema.
 */
export {
  queryGeneric as query,
  mutationGeneric as mutation,
  actionGeneric as action,
  internalQueryGeneric as internalQuery,
  internalMutationGeneric as internalMutation,
  internalActionGeneric as internalAction,
} from "convex/server";
