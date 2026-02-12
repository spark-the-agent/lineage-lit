import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

// AI-powered lineage discovery
// This runs as an action (can call external APIs)

export const processLineageRequest = internalAction({
  args: { requestId: v.id("lineageRequests") },
  handler: async (ctx, args) => {
    // Get the request
    const request = await ctx.runQuery(internal.db.getLineageRequest, {
      id: args.requestId,
    });

    if (!request) {
      throw new Error("Request not found");
    }

    // Mark as processing
    await ctx.runMutation(internal.db.updateLineageStatus, {
      id: args.requestId,
      status: "processing",
    });

    try {
      // Call OpenAI to analyze lineage
      const result = await analyzeLineageWithAI(request);

      // Mark as completed
      await ctx.runMutation(internal.db.completeLineageRequest, {
        id: args.requestId,
        result,
        tokensUsed: result.tokensUsed,
      });
    } catch (error) {
      // Mark as failed
      await ctx.runMutation(internal.db.failLineageRequest, {
        id: args.requestId,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
});

type LineageRequestInput = {
  workTitle: string;
  workAuthor?: string;
  workType?: string;
  sourceText?: string;
};

async function analyzeLineageWithAI(request: LineageRequestInput) {
  const { workTitle, workAuthor, workType, sourceText } = request;

  // Build prompt
  let prompt = `Analyze the creative lineage and influences for "${workTitle}"`;
  if (workAuthor) prompt += ` by ${workAuthor}`;
  if (workType) prompt += ` (${workType})`;
  prompt += `.\n\n`;

  if (sourceText) {
    prompt += `Source material (acknowledgments, preface, etc.):\n"""${sourceText}"""\n\n`;
  }

  prompt += `Identify:
1. Direct influences (writers, works, or movements that explicitly inspired this)
2. Stylistic similarities (writers with similar approaches)
3. The creative lineage - who influenced the influencers

Format as JSON with this structure:
{
  "identifiedInfluences": [
    {
      "name": "Creator or work name",
      "confidence": 0.9, // 0-1
      "evidence": "Quote or reasoning",
      "type": "direct|stylistic|movement"
    }
  ],
  "relatedWorks": ["Title by Author", "Another Title"],
  "lineageSummary": "Brief narrative of the creative lineage"
}`;

  // Call OpenAI (in production, use proper API key from env)
  const openaiApiKey = process.env.OPENAI_API_KEY;

  if (!openaiApiKey) {
    // Mock response for development
    return {
      identifiedInfluences: [
        {
          name: "Ernest Hemingway",
          confidence: 0.85,
          evidence: "Sparse prose style and iceberg theory approach",
          type: "stylistic",
        },
        {
          name: "Raymond Carver",
          confidence: 0.75,
          evidence: "Minimalist short story techniques",
          type: "stylistic",
        },
      ],
      relatedWorks: [
        "The Sun Also Rises by Ernest Hemingway",
        "What We Talk About When We Talk About Love by Raymond Carver",
      ],
      lineageSummary: `This work shows strong minimalist influences, particularly echoing Hemingway's "iceberg theory" of prose...`,
      tokensUsed: 1500,
    };
  }

  // Real OpenAI call
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openaiApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a literary historian specializing in creative influences and artistic lineage. Be precise and cite specific connections when possible.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI error: ${response.statusText}`);
  }

  const data = await response.json();
  const content = JSON.parse(data.choices[0].message.content);

  return {
    ...content,
    tokensUsed: data.usage?.total_tokens || 0,
  };
}
