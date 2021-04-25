import {
    selectCategory,
    selectCategoriesById,
    selectCategoriesByUserId,
    selectCategoriesByResourceIds,
    insertCategory,
    updateCategory,
    deleteCategory,
    deleteCategories,
    _insertCategory,
    _updateCategory,
    _deleteCategory,
    _deleteCategories
} from './CategoryController';

export default {
    selectCategory,
    selectCategoriesById,
    selectCategoriesByUserId,
    selectCategoriesByResourceIds,
    insertCategory,
    updateCategory,
    deleteCategory,
    deleteCategories
}

export const _CategoryController = {
    _insertCategory,
    _updateCategory,
    _deleteCategory,
    _deleteCategories
}