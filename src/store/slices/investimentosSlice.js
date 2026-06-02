
import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit'
import { InvestimentoDB } from '../../services/InvestimentoDB'


export const investimentosAdapter = createEntityAdapter({
  selectId: (investimento) => investimento.id,
})
import { BolsoDB } from '../../services/BolsoDB'
import { mostrarToastTemporario } from './uiSlice'



function _snapshotInvestimentos() {
  return {
    investimentos: InvestimentoDB.listar(),
    totais: InvestimentoDB.getTotais(),
  }
}

function _snapshotFinance() {
  return {
    saldo: BolsoDB.getSaldo(),
    transacoes: BolsoDB.getTransacoes(),
    estado: BolsoDB.getEstado(),
    configuracoes: BolsoDB.getConfiguracoes(),
  }
}



export const initInvestimentos = createAsyncThunk(
  'investimentos/init',
  () => {
    InvestimentoDB.init()
    return _snapshotInvestimentos()
  }
)

export const adicionarInvestimento = createAsyncThunk(
  'investimentos/adicionar',
  (params, { dispatch }) => {
    const inv = InvestimentoDB.adicionar(params)
    dispatch(mostrarToastTemporario('Investimento adicionado!', 'success'))
    return { inv, ..._snapshotInvestimentos() }
  }
)

export const removerInvestimento = createAsyncThunk(
  'investimentos/remover',
  (id, { dispatch }) => {
    const inv = InvestimentoDB.remover(id)
    if (inv) {
      // Devolver montante acumulado ao saldo
      const { montante } = InvestimentoDB.calcularValorAcumulado(inv)
      if (montante > 0) {
        BolsoDB.adicionarGanho({
          nome: `Resgate investimento: ${inv.nome}`,
          valor: montante,
        })
      }
      dispatch(mostrarToastTemporario('Investimento resgatado e valor devolvido ao saldo.', 'success'))
    }
    return { inv, ..._snapshotInvestimentos(), finance: _snapshotFinance() }
  }
)

export const editarInvestimento = createAsyncThunk(
  'investimentos/editar',
  ({ id, patch }, { dispatch }) => {
    InvestimentoDB.editar(id, patch)
    dispatch(mostrarToastTemporario('Investimento atualizado!', 'success'))
    return _snapshotInvestimentos()
  }
)

export const aportarInvestimento = createAsyncThunk(
  'investimentos/aportar',
  ({ id, valor }, { dispatch, rejectWithValue }) => {
    try {
      const inv = InvestimentoDB.listar().find(i => i.id === id)
      if (!inv) throw new Error('Investimento não encontrado')

      BolsoDB.adicionarGasto({
        nome: `Aporte: ${inv.nome}`,
        valor,
        categoria: 'Poupança',
        tipo: 'debito',
      })
      InvestimentoDB.aportar(id, valor)
      dispatch(mostrarToastTemporario('Aporte realizado com sucesso!', 'success'))
      return { ..._snapshotInvestimentos(), finance: _snapshotFinance() }
    } catch (err) {
      console.error('[investimentosSlice] Erro no aporte:', err)
      dispatch(mostrarToastTemporario(err.message, 'error'))
      return rejectWithValue(err.message)
    }
  }
)



const initialState = investimentosAdapter.getInitialState({
  totais: { totalInvestido: 0, montanteTotal: 0, rendimentoTotal: 0 },
  initialized: false,
})

function applyInvSnapshot(state, action) {
  const { investimentos, totais } = action.payload
  if (investimentos) investimentosAdapter.setAll(state, investimentos)
  if (totais) state.totais = totais
}

const investimentosSlice = createSlice({
  name: 'investimentos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(initInvestimentos.fulfilled, (state, action) => {
        applyInvSnapshot(state, action)
        state.initialized = true
      })
      .addMatcher(
        (action) =>
          action.type.startsWith('investimentos/') &&
          action.type.endsWith('/fulfilled') &&
          action.type !== 'investimentos/init/fulfilled',
        applyInvSnapshot
      )
  },
})

export default investimentosSlice.reducer



const investimentosSelectors = investimentosAdapter.getSelectors(
  (state) => state.investimentos
)

export const selectInvestimentos = investimentosSelectors.selectAll
export const selectInvestimentoById = investimentosSelectors.selectById
export const selectInvestimentosTotais = (state) => state.investimentos.totais
export const selectInvestimentosInitialized = (state) => state.investimentos.initialized

// Re-exporta a função de cálculo do service para uso direto em componentes
export const calcularValorInvestimento = InvestimentoDB.calcularValorAcumulado
