import { Category, CategoryRow } from '../domain/category.types';

export const categoryMapper = {
  toDomain(row: CategoryRow): Category {
    return {
      id: row.id,
      profileId: row.profile_id,
      name: row.name,
      type: row.type,
      icon: row.icon,
      color: row.color,
      isCustom: row.is_custom,
      createdAt: row.created_at,
    };
  },

  toPersistence(domain: Partial<Category>): Partial<CategoryRow> {
    const row: Partial<CategoryRow> = {};
    if (domain.name !== undefined) row.name = domain.name;
    if (domain.type !== undefined) row.type = domain.type;
    if (domain.icon !== undefined) row.icon = domain.icon;
    if (domain.color !== undefined) row.color = domain.color;
    if (domain.profileId !== undefined) row.profile_id = domain.profileId;
    if (domain.isCustom !== undefined) row.is_custom = domain.isCustom;
    return row;
  },
};