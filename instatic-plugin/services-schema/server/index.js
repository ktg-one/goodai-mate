// Creates the `services` collection as a routable post type.
//
// Why a plugin: the admin UI cannot reliably create a post-type collection or
// change an existing table's kind, so the schema has to be provisioned in code.
// This is deliberately a SEPARATE plugin from goodai.content-api, which stays
// read-only — schema mutation needs `cms.content.tables.manage`, and there is
// no reason to grant that on a feed that only reads.
//
// Field mapping onto lib/services.ts:
//   title -> name     (postType built-in, mandatory)
//   slug  -> slug     (postType built-in, mandatory; a post type with no slug
//                      field has no public route)
//   line, description, items, detail, order -> custom fields
// `price`, `priceNote` and `range` are intentionally absent: pricing was
// removed from the site on 2026-10-04.
//
// SDK shapes, verified against src/core/plugin-sdk/types/serverApi.ts:
//   api.cms.content.tables.get(slug)  -> Promise<ContentTableSchema | null>
//   api.cms.content.tables.list()     -> Promise<ReadonlyArray<ContentTableSummary>>
//                                        (a BARE array, not { tables })
//   api.cms.content.tables.create(in) -> Promise<ContentTableSchema>
//                                        (the table itself, not { table })
//   api.plugin.log                    -> (...args: unknown[]) => void
//                                        (a plain function, no .info method)

const TABLE_SLUG = "services";

const CUSTOM_FIELDS = [
  { id: "line", label: "Line", type: "text" },
  { id: "description", label: "Description", type: "longText" },
  {
    id: "items",
    label: "Items",
    type: "repeater",
    fields: [{ id: "item", label: "Item", type: "text" }],
  },
  { id: "detail", label: "Detail", type: "longText" },
  { id: "order", label: "Order", type: "number" },
];

function log(api, message) {
  // log is a plain variadic function; older drafts wrongly called .info().
  try {
    api.plugin.log(`[services-schema] ${message}`);
  } catch {
    /* logging must never fail an install */
  }
}

async function findExisting(api) {
  const { tables } = api.cms.content;

  // Primary: direct lookup, no shape guessing at all.
  try {
    const found = await tables.get(TABLE_SLUG);
    if (found) return found;
  } catch (error) {
    log(api, `tables.get() failed (${String(error?.message ?? error)})`);
  }

  // Fallback: list() returns a bare array per the SDK types. Normalise the
  // envelope shape too, so an older/newer host cannot slip past the guard.
  try {
    const listed = await tables.list();
    const rows = Array.isArray(listed)
      ? listed
      : Array.isArray(listed?.tables)
        ? listed.tables
        : [];
    const hit = rows.find((t) => typeof t?.slug === "string" && t.slug.trim().toLowerCase() === TABLE_SLUG);
    return hit ?? null;
  } catch (error) {
    log(api, `tables.list() failed (${String(error?.message ?? error)})`);
    return null;
  }
}

function isUniqueViolation(error) {
  return /UNIQUE constraint failed/i.test(String(error?.message ?? error ?? ""));
}

export async function activate(api) {
  const existing = await findExisting(api);
  if (existing) {
    log(api, `'${TABLE_SLUG}' already exists (kind=${existing.kind ?? "unknown"}) — left untouched`);
    return;
  }

  try {
    const created = await api.cms.content.tables.create({
      slug: TABLE_SLUG,
      name: "Services",
      kind: "postType",
      routeBase: "/services",
      singularLabel: "Service",
      pluralLabel: "Services",
      primaryFieldId: "title",
      fields: CUSTOM_FIELDS,
    });

    // create() resolves to the ContentTableSchema itself.
    log(
      api,
      `created postType '${TABLE_SLUG}' with ${CUSTOM_FIELDS.length} custom fields` +
        (created?.id ? ` (table ${created.id})` : "")
    );
  } catch (error) {
    if (isUniqueViolation(error)) {
      log(api, `'${TABLE_SLUG}' was already present — left untouched`);
      return;
    }
    throw error;
  }
}