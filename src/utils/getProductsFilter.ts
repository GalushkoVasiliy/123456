interface Filter {
  field: string;
  value: string | number;
  type: string;
}

export interface ProductsFilterProps {
  page?: string | number;
  perPage?: string | number;
  requestName?: 'catalog_view_container' | 'quick_search_container';
  filters?: Filter[];
  filterGroups?: Array<Filter[]>;
}

export function getProductsFilter({
  page,
  perPage,
  requestName,
  filters,
  filterGroups,
}: ProductsFilterProps) {
  const params = ['inStock=1'];
  if (page) {
    params.push(`searchCriteria[currentPage]=${page}`);
  }
  if (perPage) {
    params.push(`searchCriteria[pageSize]=${perPage}`);
  }
  if (requestName) {
    params.push(`searchCriteria[requestName]=${requestName}`);
  }
  if (filters) {
    for (const filterIndex in filters) {
      const {field, type, value} = filters[filterIndex];
      params.push(
        `searchCriteria[filter_groups][0][filters][${filterIndex}][field]=${field}&searchCriteria[filter_groups][0][filters][${filterIndex}][condition_type]=${type}&searchCriteria[filter_groups][0][filters][${filterIndex}][value]=${value}`,
      );
    }
  }
  if (filterGroups) {
    for (const filterGroupIndex in filterGroups) {
      for (const filterIndex in filterGroups[filterGroupIndex]) {
        const {field, type, value} =
          filterGroups[filterGroupIndex][filterIndex];
        params.push(
          `searchCriteria[filter_groups][${filterGroupIndex}][filters][${filterIndex}][field]=${field}&searchCriteria[filter_groups][${filterGroupIndex}][filters][${filterIndex}][condition_type]=${type}&searchCriteria[filter_groups][${filterGroupIndex}][filters][${filterIndex}][value]=${value}`,
        );
      }
    }
  }

  return `?${params.join('&')}`;
}
