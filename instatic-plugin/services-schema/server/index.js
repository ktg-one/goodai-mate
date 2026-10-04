// Creates the `services` collection as a routable post type.
//
// Why a plugin: the admin UI cannot reliably create a post-type collection or
// change an existing table's kind, so the schema has to be provisioned in code.
// This is deliberately a SEPARATE plugin from goodai.content-api, which stays
// read-only — schema mutation needs `cms.content.tables.manage`, and there is
// no reason to grant that on a feed that only reads.
//
// Idempotent by design: if a `services` table already exists at all (any kind)
// this does nothing and changes nothing. That protects hand-made tables and
// existing rows. Delete the table first if you want this to recreate it.
//
// The existence check is deliberately paranoid. `tables.list()` has been seen
// returning both a bare array and a `{ tables: [...] }` envelope depending on
// SDK version, so normalise both. And the create is wrapped: a UNIQUE
// violation on (branch_id, slug) is the authoritative "already there" signal,
// so it is swallowed rather than failing the install.
//
// Field mapping onto lib/services.ts:
//   title -> name     (postType built-in, mandatory)
//   slug  -> slug     (postType built-in, mandatory; a post type with no slug
//                      field has no public route)
//   line, description, items, detail, order -> custom fields
// `price`, `priceNote` and `range` are intentionally absent: pricing was
// removed from the site on 2026-10-04.

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

function slugOf(table) {
  return typeof table?.slug === "string" ? table.slug.trim().toLowerCase() : "";
}

function alreadyExists(listResult) {
  const rows = Array.isArray(listResult)
    ? listResult
    : Array.isArray(listResult?.tables)
      ? listResult.tables
      : [];
  return rows.some((t) => slugOf(t) === TABLE_SLUG);
}

function isUniqueViolation(error) {
  const message = String(error?.message ?? error ?? "");
  return /UNIQUE constraint failed/i.test(message);
}

export async function activate(api) {
  const tables = api.cms.content.tables;
  const log = api.plugin.log?.info?.bind(api.plugin.log) ?? (() => {});

  try {
    if (alreadyExists(await tables.list())) {
      log(`[services-schema] '${TABLE_SLUG}' already exists — left untouched`);
      return;
    }
  } catch (error) {
    // Listing is a convenience, not a guarantee. Fall through and let the
    // create attempt be the real test.
    log(`[services-schema] list() failed (${String(error?.message ?? error)}); attempting create anyway`);
  }

  try {
    const created = await tables.create({
      slug: TABLE_SLUG,
      name: "Services",
      kind: "postType",
      routeBase: "/services",
      singularLabel: "Service",
      pluralLabel: "Services",
      primaryFieldId: "title",
      fields: CUSTOM_FIELDS,
    });

    log(
      `[services-schema] created postType '${TABLE_SLUG}' with ${CUSTOM_FIELDS.length} custom fields` +
        (created?.table?.id ? ` (table ${created.table.id})` : "")
    );
  } catch (error) {
    if (isUniqueViolation(error)) {
      log(`[services-schema] '${TABLE_SLUG}' was already present — left untouched`);
      return;
    }
    throw error;
  }
}