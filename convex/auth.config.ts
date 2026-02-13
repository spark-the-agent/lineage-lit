// Convex auth configuration for Clerk JWT verification.
//
// Setup:
// 1. In your Clerk dashboard, copy the JWT issuer domain
//    (e.g. https://your-instance.clerk.accounts.dev)
// 2. In the Convex dashboard, set the environment variable:
//    CLERK_JWT_ISSUER_DOMAIN = https://your-instance.clerk.accounts.dev

const domain = process.env.CLERK_JWT_ISSUER_DOMAIN;
if (!domain) {
  throw new Error(
    "CLERK_JWT_ISSUER_DOMAIN is not set. Add it to .env.local or the Convex dashboard.",
  );
}

const authConfig = {
  providers: [
    {
      domain,
      applicationID: "convex",
    },
  ],
};

export default authConfig;
