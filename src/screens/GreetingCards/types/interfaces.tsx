interface SubCategory {
  id: number;
  parent_id: number;
  name: string;
  is_active: true;
  position: number;
  level: number;
  product_count: number;
  children_data: SubCategory[];
}

interface Category {
  id: number;
  parent_id: number;
  name: string;
  is_active: true;
  position: number;
  level: number;
  product_count: number;
  children_data: SubCategory[];
}

export type {Category};
