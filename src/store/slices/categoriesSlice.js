import { createSlice, createAsyncThunk, createEntityAdapter, createSelector } from '@reduxjs/toolkit'
import { api } from '../../services/api'
import { mostrarToastTemporario } from './uiSlice'

// ─────────────────────────────────────────────────────────────
//  Entity Adapter
// ─────────────────────────────────────────────────────────────
export const categoriesAdapter = createEntityAdapter({
  selectId: (category) => category.id,
})

// ─────────────────────────────────────────────────────────────
//  Async Thunks
// ─────────────────────────────────────────────────────────────
export const fetchCategories = createAsyncThunk(
  'categories/fetch',
  async () => {
    const res = await api.get('/categories')
    const cats = res.data.data ? res.data.data.map(item => ({ ...item, id: item._id })) : res.data.map(item => ({ ...item, id: item._id }))
    return cats
  }
)

export const addCategory = createAsyncThunk(
  'categories/add',
  async (categoryData, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.post('/categories', categoryData)
      dispatch(mostrarToastTemporario('Categoria criada com sucesso!', 'success'))
      return { ...res.data.data, id: res.data.data._id }
    } catch (err) {
      dispatch(mostrarToastTemporario(err.response?.data?.message || 'Erro ao criar categoria.', 'error'))
      return rejectWithValue(err.response?.data?.message)
    }
  }
)

export const updateCategory = createAsyncThunk(
  'categories/update',
  async ({ id, changes }, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.put(`/categories/${id}`, changes)
      dispatch(mostrarToastTemporario('Categoria atualizada.', 'success'))
      return { id, changes: { ...res.data.data, id: res.data.data._id } }
    } catch (err) {
      dispatch(mostrarToastTemporario(err.response?.data?.message || 'Erro ao atualizar categoria.', 'error'))
      return rejectWithValue(err.response?.data?.message)
    }
  }
)

export const deleteCategory = createAsyncThunk(
  'categories/delete',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`/categories/${id}`)
      dispatch(mostrarToastTemporario('Categoria removida com sucesso.', 'success'))
      return id
    } catch (err) {
      dispatch(mostrarToastTemporario(err.response?.data?.message || 'Erro ao remover categoria.', 'error'))
      return rejectWithValue(err.response?.data?.message)
    }
  }
)

// ─────────────────────────────────────────────────────────────
//  Slice
// ─────────────────────────────────────────────────────────────
const initialState = categoriesAdapter.getInitialState({
  status: 'idle',
  error: null,
})

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded'
        categoriesAdapter.setAll(state, action.payload)
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        categoriesAdapter.addOne(state, action.payload)
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        categoriesAdapter.updateOne(state, action.payload)
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        categoriesAdapter.removeOne(state, action.payload)
      })
  },
})

export default categoriesSlice.reducer

// ─────────────────────────────────────────────────────────────
//  Selectors
// ─────────────────────────────────────────────────────────────
export const {
  selectAll: selectAllCategories,
  selectById: selectCategoryById,
} = categoriesAdapter.getSelectors((state) => state.categories)

export const selectCategoriesStatus = (state) => state.categories.status

// Map nome -> cor para facilitar uso em gráficos
export const selectCategoryColorMap = createSelector(
  [selectAllCategories],
  (categories) => {
    const map = {}
    categories.forEach(c => {
      map[c.nome] = c.cor
    })
    return map
  }
)
