export function parsePaging(query: any) {
  const page = Math.max(1, Number(query.page) || 1);
  const perPage = Math.min(100, Math.max(1, Number(query.per_page) || 10));
  const from = (page - 1) * perPage;
  return { page, perPage, from };
}
