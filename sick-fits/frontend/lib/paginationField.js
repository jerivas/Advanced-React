import { PRODUCT_COUNT_QUERY } from '../components/Pagination';

export default function paginationField() {
  return {
    keyArgs: false,

    read(existing = [], { args: { skip, first }, cache }) {
      const data = cache.readQuery({ query: PRODUCT_COUNT_QUERY });
      const total = data?._allProductsMeta?.count;
      const page = skip / first + 1;
      const pageCount = Math.ceil(total / first);

      const items = existing.slice(skip, skip + first).filter(Boolean);

      if (items.length && items.length !== first && page === pageCount)
        return items;

      if (items.length !== first) return false;

      if (items.length) return items;

      return false;
    },

    merge(existing, incoming, { args: { skip } }) {
      const merged = existing ? existing.slice(0) : [];
      for (let i = skip; i < skip + incoming.length; i += 1) {
        merged[i] = incoming[i - skip];
      }
      return merged;
    },
  };
}
