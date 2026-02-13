import { Creator, Work } from "./data";

export interface ExportOptions {
  format: "csv" | "json";
  includeWorks?: boolean;
  includeInfluences?: boolean;
  includeMetadata?: boolean;
}

interface FlattenedCreator {
  slug: string;
  name: string;
  years: string;
  bio: string;
  influencedBy: string;
  influenced: string;
  workCount: number;
  influenceCount: number;
  influencedByCount: number;
}

interface FlattenedWork {
  slug: string;
  title: string;
  year: number;
  type: string;
  description: string;
  creatorSlug: string;
  creatorName: string;
}

interface NetworkEdge {
  source: string;
  target: string;
  relationship: "influenced_by" | "influenced";
  weight: number;
}

export function exportToCSV(
  creators: Creator[],
  options: ExportOptions = { format: "csv" },
): string {
  const { includeWorks = true } = options;

  // Main creators CSV
  const creatorHeaders = [
    "slug",
    "name",
    "years",
    "bio",
    "influenced_by",
    "influenced",
    "work_count",
    "influence_count",
  ];
  const creatorRows = creators.map((c) => [
    c.slug,
    `"${c.name.replace(/"/g, '""')}"`,
    c.years,
    `"${c.bio.replace(/"/g, '""')}"`,
    c.influencedBy.join("; "),
    c.influenced.join("; "),
    c.works.length,
    c.influenced.length + c.influencedBy.length,
  ]);

  let csv =
    creatorHeaders.join(",") +
    "\n" +
    creatorRows.map((r) => r.join(",")).join("\n");

  if (includeWorks) {
    csv += "\n\n--- WORKS ---\n\n";
    const workHeaders = [
      "slug",
      "title",
      "year",
      "type",
      "description",
      "creator_slug",
      "creator_name",
    ];
    const workRows: (string | number)[][] = [];

    creators.forEach((c) => {
      c.works.forEach((w) => {
        workRows.push([
          w.slug,
          `"${w.title.replace(/"/g, '""')}"`,
          w.year,
          w.type,
          `"${w.description.replace(/"/g, '""')}"`,
          c.slug,
          c.name,
        ]);
      });
    });

    csv +=
      workHeaders.join(",") +
      "\n" +
      workRows.map((r) => r.join(",")).join("\n");
  }

  // Add influence relationships
  csv += "\n\n--- INFLUENCES ---\n\n";
  const influenceHeaders = [
    "source_id",
    "source_name",
    "target_id",
    "target_name",
    "direction",
  ];
  const influenceRows: string[][] = [];

  creators.forEach((c) => {
    c.influencedBy.forEach((influencerSlug) => {
      const influencer = creators.find((x) => x.slug === influencerSlug);
      if (influencer) {
        influenceRows.push([
          influencer.slug,
          influencer.name,
          c.slug,
          c.name,
          "influenced_by",
        ]);
      }
    });

    c.influenced.forEach((influencedSlug) => {
      const influenced = creators.find((x) => x.slug === influencedSlug);
      if (influenced) {
        influenceRows.push([
          c.slug,
          c.name,
          influenced.slug,
          influenced.name,
          "influenced",
        ]);
      }
    });
  });

  csv +=
    influenceHeaders.join(",") +
    "\n" +
    influenceRows.map((r) => r.join(",")).join("\n");

  return csv;
}

export function exportToJSON(
  creators: Creator[],
  options: ExportOptions = { format: "json" },
): string {
  const {
    includeWorks = true,
    includeInfluences = true,
    includeMetadata = true,
  } = options;

  const data: any = {
    version: "1.0",
    exportDate: new Date().toISOString(),
    source: "Lineage Lit Research Export",
  };

  // Creators with expanded relationships
  data.creators = creators.map((c) => ({
    slug: c.slug,
    name: c.name,
    years: c.years,
    bio: c.bio,
    ...(includeWorks && { works: c.works }),
    ...(includeInfluences && {
      influencedBy: c.influencedBy.map((slug) => {
        const inf = creators.find((x) => x.slug === slug);
        return { slug, name: inf?.name || slug };
      }),
      influenced: c.influenced.map((slug) => {
        const inf = creators.find((x) => x.slug === slug);
        return { slug, name: inf?.name || slug };
      }),
    }),
    metrics: {
      workCount: c.works.length,
      influenceCount: c.influenced.length,
      influencedByCount: c.influencedBy.length,
      totalConnections: c.influenced.length + c.influencedBy.length,
    },
  }));

  // Network edges for graph analysis
  if (includeInfluences) {
    data.networkEdges = [] as NetworkEdge[];
    creators.forEach((c) => {
      c.influencedBy.forEach((slug) => {
        data.networkEdges.push({
          source: slug,
          target: c.slug,
          relationship: "influenced_by",
          weight: 1,
        });
      });
    });
  }

  // Summary statistics
  if (includeMetadata) {
    data.metadata = {
      totalCreators: creators.length,
      totalWorks: creators.reduce((acc, c) => acc + c.works.length, 0),
      totalInfluences: creators.reduce(
        (acc, c) => acc + c.influenced.length,
        0,
      ),
      dateRange: {
        earliest: Math.min(
          ...creators.flatMap((c) => c.works.map((w) => w.year)),
        ),
        latest: Math.max(
          ...creators.flatMap((c) => c.works.map((w) => w.year)),
        ),
      },
    };
  }

  return JSON.stringify(data, null, 2);
}

export function generateNetworkJSON(creators: Creator[]): string {
  const nodes = creators.map((c) => ({
    slug: c.slug,
    label: c.name,
    group: determineEra(c.years),
    works: c.works.length,
    influenceScore: c.influenced.length,
    influencedBy: c.influencedBy.length,
  }));

  const edges: { from: string; to: string; label: string }[] = [];
  creators.forEach((c) => {
    c.influencedBy.forEach((slug) => {
      edges.push({
        from: slug,
        to: c.slug,
        label: "influenced",
      });
    });
  });

  return JSON.stringify({ nodes, edges }, null, 2);
}

function determineEra(years: string): string {
  const startYear = parseInt(years.split("-")[0]);
  if (startYear < 1900) return "19th Century";
  if (startYear < 1950) return "Early 20th Century";
  if (startYear < 1970) return "Mid 20th Century";
  if (startYear < 1990) return "Late 20th Century";
  return "21st Century";
}

export function downloadBlob(
  content: string,
  filename: string,
  contentType: string,
): void {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadCSV(
  creators: Creator[],
  filename = "lineage-lit-data.csv",
): void {
  const csv = exportToCSV(creators);
  downloadBlob(csv, filename, "text/csv;charset=utf-8;");
}

export function downloadJSON(
  creators: Creator[],
  filename = "lineage-lit-data.json",
): void {
  const json = exportToJSON(creators);
  downloadBlob(json, filename, "application/json;charset=utf-8;");
}

export function downloadNetworkJSON(
  creators: Creator[],
  filename = "lineage-lit-network.json",
): void {
  const json = generateNetworkJSON(creators);
  downloadBlob(json, filename, "application/json;charset=utf-8;");
}
