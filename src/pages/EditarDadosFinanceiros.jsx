import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFinance } from "../hooks/useFinance";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  .edf-wrapper { font-family: 'DM Sans', sans-serif; }

  .edf-greeting {
    font-size: 0.78rem; color: var(--bd-muted);
    letter-spacing: 0.04em; text-transform: uppercase; margin-bottom: 0.15rem;
  }
  .edf-title {
    font-family: 'Syne', sans-serif; font-weight: 800;
    font-size: clamp(1.4rem, 4vw, 2rem);
    color: var(--bd-text); line-height: 1.1; margin: 0 0 1.5rem;
  }

  .edf-back-btn {
    width: 38px; height: 38px;
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--bd-border);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    color: var(--bd-muted); cursor: pointer; font-size: 1rem; flex-shrink: 0;
    transition: background 0.18s, color 0.18s;
  }
  .edf-back-btn:hover { background: rgba(255,255,255,0.09); color: var(--bd-text); }

  /* ── Summary cards ── */
  .edf-summary-card {
    background: var(--bd-card);
    border: 1px solid var(--bd-border);
    border-radius: 14px; padding: 1rem;
  }
  .edf-summary-icon {
    width: 36px; height: 36px; border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem; margin-bottom: 0.6rem;
  }
  .edf-summary-icon.green  { background: rgba(78,227,160,0.12); color: var(--bd-green); }
  .edf-summary-icon.red    { background: rgba(240,106,106,0.12); color: #f06a6a; }
  .edf-summary-icon.teal   { background: rgba(78,227,196,0.12);  color: var(--bd-teal); }
  .edf-summary-icon.purple { background: rgba(172,182,229,0.12); color: var(--bd-purple); }
  .edf-summary-label {
    font-size: 0.7rem; color: var(--bd-muted);
    text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 0.2rem;
  }
  .edf-summary-value {
    font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1.05rem; margin: 0;
  }
  .edf-summary-value.green  { color: var(--bd-green); }
  .edf-summary-value.red    { color: #f06a6a; }
  .edf-summary-value.teal   { color: var(--bd-teal); }
  .edf-summary-value.purple { color: var(--bd-purple); }

  /* ── Card ── */
  .edf-card {
    background: var(--bd-card);
    border: 1px solid var(--bd-border);
    border-radius: 16px; padding: 1.5rem;
    margin-bottom: 1.5rem;
  }
  .edf-section-title {
    font-family: 'Syne', sans-serif; font-weight: 700;
    font-size: 0.88rem; color: var(--bd-text); margin: 0;
  }
  .edf-item-count {
    font-size: 0.72rem; color: var(--bd-muted);
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--bd-border);
    border-radius: 20px; padding: 0.15rem 0.6rem;
  }

  /* ── Inputs ── */
  .edf-label {
    display: block; font-size: 0.75rem; color: var(--bd-muted);
    letter-spacing: 0.03em; margin-bottom: 0.4rem;
  }
  .edf-input-wrap {
    position: relative; display: flex; align-items: center; margin-bottom: 1rem;
  }
  .edf-input-wrap.no-mb { margin-bottom: 0; }
  .edf-prefix-icon {
    position: absolute; left: 0.9rem; color: var(--bd-muted);
    font-size: 0.95rem; pointer-events: none; z-index: 1;
  }
  .edf-input {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--bd-border);
    border-radius: 12px;
    padding: 0.68rem 2.4rem 0.68rem 2.6rem;
    color: var(--bd-text);
    font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
    outline: none; transition: border-color 0.2s, background 0.2s;
    box-sizing: border-box;
  }
  .edf-input.no-prefix { padding-left: 1rem; }
  .edf-input:focus {
    border-color: rgba(78,227,196,0.4);
    background: rgba(78,227,196,0.04);
  }
  .edf-input::placeholder { color: rgba(138,155,191,0.4); }
  .edf-pencil-icon {
    position: absolute; right: 0.9rem; color: var(--bd-muted);
    font-size: 0.85rem; pointer-events: none;
  }

  /* ── Field row (item dinâmico) ── */
  .edf-field-row {
    display: flex; align-items: flex-end; gap: 0.5rem; margin-bottom: 0.9rem;
  }
  .edf-field-group { flex: 1; }
  .edf-remove-btn {
    width: 38px; height: 38px;
    background: rgba(240,106,106,0.08);
    border: 1px solid rgba(240,106,106,0.18);
    border-radius: 10px; color: #f06a6a;
    font-size: 0.9rem; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; transition: background 0.16s; margin-bottom: 0.1rem;
  }
  .edf-remove-btn:hover { background: rgba(240,106,106,0.15); }

  /* ── Add item button ── */
  .edf-btn-add-item {
    display: flex; align-items: center; gap: 0.4rem;
    background: none;
    border: 1px dashed rgba(78,227,196,0.25);
    border-radius: 10px; color: var(--bd-teal);
    font-size: 0.8rem; font-weight: 500;
    padding: 0.55rem 1rem; cursor: pointer; width: 100%;
    justify-content: center;
    transition: background 0.18s, border-color 0.18s;
    font-family: 'DM Sans', sans-serif;
  }
  .edf-btn-add-item:hover {
    background: rgba(78,227,196,0.06);
    border-color: rgba(78,227,196,0.45);
  }

  /* ── Percentual bar ── */
  .edf-pct-bar-wrap {
    display: flex; align-items: center; gap: 0.75rem; margin-top: 0.5rem;
  }
  .edf-pct-bar {
    flex: 1; height: 6px;
    background: rgba(255,255,255,0.06);
    border-radius: 99px; overflow: hidden;
  }
  .edf-pct-fill {
    height: 100%; border-radius: 99px;
    transition: width 0.3s ease, background 0.3s ease;
  }
  .edf-pct-label {
    font-family: 'Syne', sans-serif; font-weight: 700;
    font-size: 0.8rem; color: var(--bd-teal); width: 2.5rem; text-align: right;
  }

  /* ── Orçamento por categoria ── */
  .edf-budget-row {
    display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem;
  }
  .edf-budget-cat {
    display: flex; align-items: center; gap: 0.5rem; width: 110px; flex-shrink: 0;
  }
  .edf-budget-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .edf-budget-input { flex: 1; }

  /* ── Toggle switches ── */
  .edf-toggle-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--bd-border);
  }
  .edf-toggle-row:last-child { border-bottom: none; }
  .edf-toggle-label { font-size: 0.85rem; font-weight: 500; color: var(--bd-text); margin: 0; }
  .edf-toggle-sub   { font-size: 0.72rem; color: var(--bd-muted); margin: 0.1rem 0 0; }
  .edf-toggle-switch {
    position: relative; display: inline-block;
    width: 42px; height: 24px; flex-shrink: 0; cursor: pointer;
  }
  .edf-toggle-switch input { opacity: 0; width: 0; height: 0; }
  .edf-toggle-slider {
    position: absolute; inset: 0;
    background: rgba(255,255,255,0.08);
    border: 1px solid var(--bd-border);
    border-radius: 99px; transition: background 0.25s;
  }
  .edf-toggle-slider::before {
    content: ''; position: absolute;
    width: 16px; height: 16px;
    background: var(--bd-muted); border-radius: 50%;
    left: 3px; top: 3px; transition: transform 0.25s, background 0.25s;
  }
  .edf-toggle-switch input:checked + .edf-toggle-slider {
    background: rgba(78,227,196,0.15); border-color: rgba(78,227,196,0.3);
  }
  .edf-toggle-switch input:checked + .edf-toggle-slider::before {
    background: var(--bd-teal); transform: translateX(18px);
  }

  /* ── Divider ── */
  .edf-divider { border: none; border-top: 1px solid var(--bd-border); margin: 0.5rem 0 1rem; }

  /* ── Toast ── */
  .edf-toast {
    border-radius: 10px; padding: 0.65rem 1rem;
    font-size: 0.82rem; text-align: center; margin-top: 1rem;
  }
  .edf-toast.success {
    background: rgba(78,227,160,0.1);
    border: 1px solid rgba(78,227,160,0.25); color: var(--bd-green);
  }
  .edf-toast.error {
    background: rgba(240,106,106,0.1);
    border: 1px solid rgba(240,106,106,0.25); color: #f06a6a;
  }

  /* ── Botões ── */
  .edf-btn {
    display: inline-flex; align-items: center; justify-content: center;
    padding: 0.75rem 1.2rem; border-radius: 12px;
    font-size: 0.88rem; font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer; border: none; text-decoration: none;
    transition: opacity 0.18s, transform 0.15s;
  }
  .edf-btn:hover  { opacity: 0.88; transform: translateY(-1px); }
  .edf-btn:active { transform: translateY(0); }
  .edf-btn-primary {
    background: rgba(78,227,196,0.12);
    border: 1px solid rgba(78,227,196,0.3); color: var(--bd-teal); flex: 1;
  }
  .edf-btn-ghost {
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--bd-border); color: var(--bd-muted);
  }
`;

/* ── Helpers ── */
function parseVal(str) {
  const num = parseFloat(String(str).replace(/[^\d,]/g, "").replace(",", "."));
  return isNaN(num) ? 0 : num;
}
function formatBRL(val) {
  return val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function pctColor(val) {
  if (val > 30) return "#4ee3a0";
  if (val > 15) return "#4ee3c4";
  return "#ACB6E5";
}

/* ── Componente ── */
export default function EditarDadosFinanceiros() {
  const navigate = useNavigate();
  const { configuracoes, salvarConfiguracoes, mostrarToast, financeiro, salvarFinanceiro } = useFinance();

  /* Configurações do Cartão (Issue #21) */
  const [ccVencimento, setCcVencimento] = useState(configuracoes.diaVencimentoCartao ?? "");
  const [ccLimite, setCcLimite] = useState(configuracoes.limiteCartao ?? "");
  const [ccRecebimento, setCcRecebimento] = useState(configuracoes.diaRecebimentoSalario ?? "");

  /* Ganhos e gastos dinâmicos */
  const [ganhos, setGanhos] = useState(
    financeiro?.ganhos ?? [
      { label: "Salário", valor: "", icon: "bi-building" },
      { label: "Renda Extra", valor: "", icon: "bi-briefcase" },
    ]
  );
  const [gastos, setGastos] = useState(
    financeiro?.gastos ?? [
      { label: "Condomínio / Aluguel", valor: "", icon: "bi-house" },
      { label: "Seguro", valor: "", icon: "bi-shield-check" },
    ]
  );

  /* Metas */
  const [metaPoupanca,    setMetaPoupanca]    = useState(financeiro?.metaPoupanca    ?? "");
  const [reservaMeses,    setReservaMeses]    = useState(financeiro?.reservaMeses    ?? "");
  const [percInvestimento, setPercInvestimento] = useState(financeiro?.percInvestimento ?? "");

  /* Orçamento */
  const [orcamento, setOrcamento] = useState(
    financeiro?.orcamento ?? { alimentacao: "", transporte: "", lazer: "", saude: "", educacao: "" }
  );

  /* Alertas */
  const [alertaGasto,  setAlertaGasto]  = useState(financeiro?.alertaGasto  ?? true);
  const [alertaFatura, setAlertaFatura] = useState(financeiro?.alertaFatura ?? true);
  const [alertaMeta,   setAlertaMeta]   = useState(financeiro?.alertaMeta   ?? false);

  /* Toast */
  const [toast, setToast] = useState({ msg: "", type: "" });

  /* Sincronizar configurações do contexto caso mudem */
  useEffect(() => {
    if (configuracoes.diaVencimentoCartao) setCcVencimento(configuracoes.diaVencimentoCartao);
    if (configuracoes.limiteCartao) setCcLimite(configuracoes.limiteCartao);
    if (configuracoes.diaRecebimentoSalario) setCcRecebimento(configuracoes.diaRecebimentoSalario);
  }, [configuracoes]);

  /* ── Resumo calculado ── */
  const totalGanhos  = ganhos.reduce((s, g) => s + parseVal(g.valor), 0);
  const totalGastos  = gastos.reduce((s, g) => s + parseVal(g.valor), 0);
  const poupancaVal  = parseVal(metaPoupanca);
  const saldoProj    = totalGanhos - totalGastos - poupancaVal;
  const pct          = Math.min(100, Math.max(0, parseFloat(percInvestimento) || 0));

  /* ── Handlers ganhos/gastos ── */
  const updateItem = (lista, setLista, idx, field, val) => {
    const copia = [...lista];
    copia[idx] = { ...copia[idx], [field]: val };
    setLista(copia);
  };
  const removeItem = (lista, setLista, idx) => setLista(lista.filter((_, i) => i !== idx));
  const addGanho = () => setGanhos([...ganhos, { label: "Novo ganho", valor: "", icon: "bi-cash-coin" }]);
  const addGasto = () => setGastos([...gastos, { label: "Novo gasto", valor: "", icon: "bi-dash-circle" }]);

  /* ── Salvar ── */
  const handleSubmit = (e) => {
    e.preventDefault();

    // Salvar configurações globais (Issue #21)
    salvarConfiguracoes({
      diaVencimentoCartao: parseInt(ccVencimento) || null,
      limiteCartao: parseFloat(String(ccLimite).replace(/[^\d.]/g, "")) || 0,
      diaRecebimentoSalario: parseInt(ccRecebimento) || null
    });

    salvarFinanceiro({ ganhos, gastos, metaPoupanca, reservaMeses, percInvestimento, orcamento, alertaGasto, alertaFatura, alertaMeta });

    mostrarToast("Dados financeiros salvos com sucesso!", "success");
  };

  /* ── Render ── */
  return (
    <>
      <style>{styles}</style>
      <div className="edf-wrapper">

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
          <button className="edf-back-btn" onClick={() => navigate("/perfil")}>
            <i className="bi bi-arrow-left" />
          </button>
          <div>
            <p className="edf-greeting">Configurações / Perfil</p>
            <h1 className="edf-title">Dados Financeiros</h1>
          </div>
        </div>

        {/* Summary cards */}
        <div className="row g-3 mb-4">
          {[
            { icon: "bi-arrow-down-circle", cls: "green",  label: "Total de Ganhos",  val: formatBRL(totalGanhos) },
            { icon: "bi-arrow-up-circle",   cls: "red",    label: "Total de Gastos",  val: formatBRL(totalGastos) },
            { icon: "bi-piggy-bank",        cls: "teal",   label: "Meta de Poupança", val: formatBRL(poupancaVal) },
            { icon: "bi-wallet2",           cls: saldoProj >= 0 ? "teal" : "red", label: "Saldo Projetado", val: formatBRL(saldoProj) },
          ].map((c, i) => (
            <div className="col-6 col-lg-3" key={i}>
              <div className="edf-summary-card">
                <div className={`edf-summary-icon ${c.cls}`}><i className={`bi ${c.icon}`} /></div>
                <p className="edf-summary-label">{c.label}</p>
                <p className={`edf-summary-value ${c.cls}`}>{c.val}</p>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row g-4 align-items-start">

            {/* ══ COLUNA ESQUERDA ══ */}
            <div className="col-12 col-lg-6">

              {/* Ganhos Fixos */}
              <div className="edf-card">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <p className="edf-section-title">💰 Ganhos Fixos</p>
                  <span className="edf-item-count">{ganhos.length} {ganhos.length === 1 ? "item" : "itens"}</span>
                </div>
                {ganhos.map((g, i) => (
                  <div className="edf-field-row" key={i}>
                    <div className="edf-field-group">
                      <label className="edf-label">{g.label}</label>
                      <div className="edf-input-wrap no-mb">
                        <i className={`bi ${g.icon} edf-prefix-icon`} />
                        <input
                          className="edf-input"
                          type="text"
                          value={g.valor}
                          placeholder="R$ 0,00"
                          onChange={(e) => updateItem(ganhos, setGanhos, i, "valor", e.target.value)}
                        />
                        <i className="bi bi-pencil edf-pencil-icon" />
                      </div>
                    </div>
                    <button type="button" className="edf-remove-btn" onClick={() => removeItem(ganhos, setGanhos, i)}>
                      <i className="bi bi-trash3" />
                    </button>
                  </div>
                ))}
                <button type="button" className="edf-btn-add-item" onClick={addGanho}>
                  <i className="bi bi-plus-lg" /> Adicionar ganho
                </button>
              </div>

              {/* Gastos Fixos */}
              <div className="edf-card">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <p className="edf-section-title">💸 Gastos Fixos</p>
                  <span className="edf-item-count">{gastos.length} {gastos.length === 1 ? "item" : "itens"}</span>
                </div>
                {gastos.map((g, i) => (
                  <div className="edf-field-row" key={i}>
                    <div className="edf-field-group">
                      <label className="edf-label">{g.label}</label>
                      <div className="edf-input-wrap no-mb">
                        <i className={`bi ${g.icon} edf-prefix-icon`} />
                        <input
                          className="edf-input"
                          type="text"
                          value={g.valor}
                          placeholder="R$ 0,00"
                          onChange={(e) => updateItem(gastos, setGastos, i, "valor", e.target.value)}
                        />
                        <i className="bi bi-pencil edf-pencil-icon" />
                      </div>
                    </div>
                    <button type="button" className="edf-remove-btn" onClick={() => removeItem(gastos, setGastos, i)}>
                      <i className="bi bi-trash3" />
                    </button>
                  </div>
                ))}
                <button type="button" className="edf-btn-add-item" onClick={addGasto}>
                  <i className="bi bi-plus-lg" /> Adicionar gasto
                </button>
              </div>

            </div>

            {/* ══ COLUNA DIREITA ══ */}
            <div className="col-12 col-lg-6">

              {/* Metas */}
              <div className="edf-card">
                <p className="edf-section-title mb-3">🎯 Metas Financeiras</p>

                <label className="edf-label">Meta de Poupança Mensal</label>
                <div className="edf-input-wrap">
                  <i className="bi bi-piggy-bank edf-prefix-icon" />
                  <input className="edf-input" type="text" placeholder="R$ 0,00"
                    value={metaPoupanca} onChange={(e) => setMetaPoupanca(e.target.value)} />
                  <i className="bi bi-pencil edf-pencil-icon" />
                </div>

                <label className="edf-label">Reserva de Emergência (meses)</label>
                <div className="edf-input-wrap">
                  <i className="bi bi-umbrella edf-prefix-icon" />
                  <input className="edf-input" type="number" min="1" max="24" placeholder="6"
                    value={reservaMeses} onChange={(e) => setReservaMeses(e.target.value)} />
                  <i className="bi bi-pencil edf-pencil-icon" />
                </div>

                <label className="edf-label">Percentual de Investimento (%)</label>
                <div className="edf-input-wrap" style={{ marginBottom: "0.4rem" }}>
                  <i className="bi bi-graph-up-arrow edf-prefix-icon" />
                  <input className="edf-input" type="number" min="0" max="100" placeholder="10"
                    value={percInvestimento} onChange={(e) => setPercInvestimento(e.target.value)} />
                  <i className="bi bi-pencil edf-pencil-icon" />
                </div>
                <div className="edf-pct-bar-wrap">
                  <div className="edf-pct-bar">
                    <div className="edf-pct-fill" style={{ width: `${pct}%`, background: pctColor(pct) }} />
                  </div>
                  <span className="edf-pct-label">{pct}%</span>
                </div>
              </div>


              {/* Configurações do Cartão e Salário (Issue #21) */}
              <div className="edf-card">
                <p className="edf-section-title mb-3">⚙️ Configurações do Cartão e Salário</p>

                <label className="edf-label">Dia de Vencimento do Cartão (1-28)</label>
                <div className="edf-input-wrap">
                  <i className="bi bi-calendar-event edf-prefix-icon" />
                  <input className="edf-input" type="number" min="1" max="28" placeholder="10"
                    value={ccVencimento} onChange={(e) => setCcVencimento(e.target.value)} />
                  <i className="bi bi-pencil edf-pencil-icon" />
                </div>

                <label className="edf-label">Limite do Cartão de Crédito</label>
                <div className="edf-input-wrap">
                  <i className="bi bi-credit-card-2-front edf-prefix-icon" />
                  <input className="edf-input" type="text" placeholder="R$ 0,00"
                    value={ccLimite} onChange={(e) => setCcLimite(e.target.value)} />
                  <i className="bi bi-pencil edf-pencil-icon" />
                </div>

                <label className="edf-label">Dia de Recebimento do Salário (1-28)</label>
                <div className="edf-input-wrap no-mb">
                  <i className="bi bi-cash-stack edf-prefix-icon" />
                  <input className="edf-input" type="number" min="1" max="28" placeholder="5"
                    value={ccRecebimento} onChange={(e) => setCcRecebimento(e.target.value)} />
                  <i className="bi bi-pencil edf-pencil-icon" />
                </div>
              </div>

              {/* Orçamento por categoria */}
              <div className="edf-card">
                <p className="edf-section-title mb-3">📊 Orçamento por Categoria</p>
                {[
                  { key: "alimentacao", color: "#4ee3c4", label: "Alimentação" },
                  { key: "transporte",  color: "#ACB6E5", label: "Transporte" },
                  { key: "lazer",       color: "#4ee3a0", label: "Lazer" },
                  { key: "saude",       color: "#f4c864", label: "Saúde" },
                  { key: "educacao",    color: "#f06a6a", label: "Educação" },
                ].map(({ key, color, label }) => (
                  <div className="edf-budget-row" key={key}>
                    <div className="edf-budget-cat">
                      <span className="edf-budget-dot" style={{ background: color }} />
                      <label className="edf-label mb-0">{label}</label>
                    </div>
                    <div className="edf-budget-input">
                      <div className="edf-input-wrap no-mb">
                        <input
                          className="edf-input no-prefix"
                          type="text"
                          placeholder="R$ 0,00"
                          value={orcamento[key]}
                          onChange={(e) => setOrcamento({ ...orcamento, [key]: e.target.value })}
                        />
                        <i className="bi bi-pencil edf-pencil-icon" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Alertas */}
              <div className="edf-card">
                <p className="edf-section-title mb-3">🔔 Alertas Financeiros</p>
                {[
                  { label: "Alerta de gasto excessivo", sub: "Notificar quando ultrapassar o orçamento", val: alertaGasto,  set: setAlertaGasto },
                  { label: "Lembrete de fatura",        sub: "Avisar 5 dias antes do vencimento",       val: alertaFatura, set: setAlertaFatura },
                  { label: "Meta de poupança atingida", sub: "Celebrar quando bater a meta mensal",      val: alertaMeta,   set: setAlertaMeta },
                ].map(({ label, sub, val, set }, i) => (
                  <div className="edf-toggle-row" key={i}>
                    <div>
                      <p className="edf-toggle-label">{label}</p>
                      <p className="edf-toggle-sub">{sub}</p>
                    </div>
                    <label className="edf-toggle-switch">
                      <input type="checkbox" checked={val} onChange={(e) => set(e.target.checked)} />
                      <span className="edf-toggle-slider" />
                    </label>
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* Toast */}
          {toast.msg && <div className={`edf-toast ${toast.type}`}>{toast.msg}</div>}

          {/* Ações */}
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
            <button type="button" className="edf-btn edf-btn-ghost" onClick={() => navigate("/perfil")}>
              Cancelar
            </button>
            <button type="submit" className="edf-btn edf-btn-primary">
              <i className="bi bi-check-lg" style={{ marginRight: "0.3rem" }} />
              Salvar Alterações
            </button>
          </div>

        </form>
      </div>
    </>
  );
}