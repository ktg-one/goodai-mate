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

export async function activate(api) {
  const tables = api.cms.content.tables;

  const existing = await tables.list();
  const already = (existing?.tables ?? []).some((t) => t.slug === TABLE_SLUG);
  if (already) {
    api.plugin.log?.info?.(`[services-schema] '${TABLE_SLUG}' already exists — left untouched`);
    return;
  }

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

  api.plugin.log?.info?.(
    `[services-schema] created postType '${TABLE_SLUG}' with ${CUSTOM_FIELDS.length} custom fields` +
      (created?.table?.id ? ` (table ${created.table.id})` : "")
  );
}