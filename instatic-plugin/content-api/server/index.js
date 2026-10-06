// Public, read-only feed for the Next.js site.
// Mounted at /admin/api/cms/plugins/goodai.content-api/runtime/
//   /posts and /services -> { table, entries, totalCount }
//
// Entries are ContentEntry: { id, tableSlug, slug, status, cells, authorUserId,
// pluginActorId, createdAt, updatedAt, publishedAt, scheduledPublishAt }.
// Field values live under `cells` keyed by fieldId, so a cell is `cells.slug`,
// not `slug`. list() returns `{ entries, totalCount }` -- NOT `records`.
//
// Both verbs are registered. An earlier draft removed GET on the belief that
// Instatic had no public GET — that was wrong. The SDK type
// (src/core/plugin-sdk/types/serverApi.ts) declares all four verbs under
// `routes.public`, and the docs describe the shape as intended for
// "public read APIs (sitemaps, robots, search)". GET is the natural verb for a
// read feed; POST stays registered because it is verified working against the
// installed host, so either verb works.
//
// posts is a routable post type (has publish status); services is a plain Data
// table, which has no workflow/status, so it is listed unfiltered.
const TABLES = { posts: { status: "published" }, services: {} };

export function activate(api) {
  const pub = api.cms.routes.public;

  for (const [table, filter] of Object.entries(TABLES)) {
    const handler = async () => {
      try {
        const result = await api.cms.content.table(table).list({ ...filter, limit: 200 });
        return {
          __response: true,
          status: 200,
          headers: { "content-type": "application/json", "cache-control": "public, max-age=60" },
          body: JSON.stringify({ table, entries: result.entries ?? [], totalCount: result.totalCount ?? 0 }),
        };
      } catch (error) {
        // e.g. the services table does not exist yet
        return {
          __response: true,
          status: 200,
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ table, entries: [], totalCount: 0, note: String(error && error.message) }),
        };
      }
    };

    pub.post(`/${table}`, handler);
    pub.get(`/${table}`, handler);
  }
}
