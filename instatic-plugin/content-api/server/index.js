// Public, read-only feed for the Next.js site.
// Mounted at /admin/api/cms/plugins/goodai.content-api/runtime/
//   /posts and /services -> { table, records, totalCount }
// Records are Instatic entries: { id, slug, cells: { <fieldId>: value }, ... }.
// Plugin handlers receive { req, body, user } only (no path params), so each
// table gets its own fixed route.
//
// IMPORTANT — consumers must POST. Instatic's plugin SDK documents no
// public GET: every `api.cms.routes.public.*` example in the official docs
// is `.post` (subscribe, webhook). The capability-gated `.get`/`.patch`/
// `.delete` forms all require a logged-in caller and the matching core
// capability, so they are not reachable anonymously. The site reading this
// feed is a server-side fetch and can POST like any other client.
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
          body: JSON.stringify({ table, records: result.records ?? [], totalCount: result.totalCount ?? 0 }),
        };
      } catch (error) {
        // e.g. the services table does not exist yet
        return {
          __response: true,
          status: 200,
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ table, records: [], totalCount: 0, note: String(error && error.message) }),
        };
      }
    };

    pub.post(`/${table}`, handler);
  }
}
