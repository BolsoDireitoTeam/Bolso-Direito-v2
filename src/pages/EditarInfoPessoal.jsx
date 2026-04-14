import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useFinance } from "../hooks/useFinance";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  .eip-wrapper {
    font-family: 'DM Sans', sans-serif;
  }

  .eip-greeting {
    font-size: 0.78rem;
    color: var(--bd-muted);
    letter-spacing: 0.04em;
    text-transform: uppercase;
    margin-bottom: 0.15rem;
  }

  .eip-title {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: clamp(1.4rem, 4vw, 2rem);
    color: var(--bd-text);
    line-height: 1.1;
    margin: 0 0 1.5rem;
  }

  .eip-back-btn {
    width: 38px; height: 38px;
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--bd-border);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    color: var(--bd-muted);
    cursor: pointer;
    font-size: 1rem;
    flex-shrink: 0;
    transition: background 0.18s, color 0.18s;
  }
  .eip-back-btn:hover { background: rgba(255,255,255,0.09); color: var(--bd-text); }

  /* ── Card ── */
  .eip-card {
    background: var(--bd-card);
    border: 1px solid var(--bd-border);
    border-radius: 16px;
    padding: 1.5rem;
  }

  .eip-section-title {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 0.85rem;
    color: var(--bd-text);
    letter-spacing: 0.02em;
    margin-bottom: 1rem;
  }

  /* ── Avatar ── */
  .eip-avatar-wrap {
    position: relative;
    width: 100px; height: 100px;
    margin: 0 auto 0.75rem;
  }
  .eip-avatar-img {
    width: 100px; height: 100px;
    border-radius: 50%;
    border: 3px solid rgba(78,227,196,0.35);
    object-fit: cover;
  }
  .eip-avatar-edit {
    position: absolute;
    bottom: 2px; right: 2px;
    width: 28px; height: 28px;
    background: var(--bd-teal);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    border: 2px solid var(--bd-card);
    font-size: 0.65rem;
    color: #0d1525;
    transition: opacity 0.15s;
  }
  .eip-avatar-edit:hover { opacity: 0.85; }

  .eip-avatar-hint {
    font-size: 0.72rem;
    color: var(--bd-muted);
    text-align: center;
    margin-bottom: 1rem;
  }

  /* ── Inputs ── */
  .eip-label {
    display: block;
    font-size: 0.75rem;
    color: var(--bd-muted);
    letter-spacing: 0.03em;
    margin-bottom: 0.4rem;
  }

  .eip-input-wrap {
    position: relative;
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
  }

  .eip-prefix-icon {
    position: absolute;
    left: 0.9rem;
    color: var(--bd-muted);
    font-size: 0.95rem;
    pointer-events: none;
    z-index: 1;
  }

  .eip-input {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--bd-border);
    border-radius: 12px;
    padding: 0.72rem 2.6rem 0.72rem 2.6rem;
    color: var(--bd-text);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.92rem;
    outline: none;
    transition: border-color 0.2s, background 0.2s;
    box-sizing: border-box;
  }
  .eip-input.no-prefix {
    padding-left: 1rem;
  }
  .eip-input:focus {
    border-color: rgba(78,227,196,0.4);
    background: rgba(78,227,196,0.04);
  }
  .eip-input::placeholder { color: rgba(138,155,191,0.4); }

  .eip-pencil-icon {
    position: absolute;
    right: 0.9rem;
    color: var(--bd-muted);
    font-size: 0.85rem;
    pointer-events: none;
  }

  .eip-eye-btn {
    position: absolute;
    right: 0.75rem;
    background: none;
    border: none;
    color: var(--bd-muted);
    cursor: pointer;
    padding: 0;
    font-size: 1rem;
    line-height: 1;
    transition: color 0.15s;
    z-index: 1;
  }
  .eip-eye-btn:hover { color: var(--bd-teal); }

  /* ── Força da senha ── */
  .eip-strength-bar {
    height: 4px;
    background: rgba(255,255,255,0.06);
    border-radius: 99px;
    overflow: hidden;
    margin-top: 0.5rem;
  }
  .eip-strength-fill {
    height: 100%;
    border-radius: 99px;
    transition: width 0.35s ease, background 0.35s ease;
  }
  .eip-strength-label {
    font-size: 0.7rem;
    margin-top: 0.3rem;
    font-weight: 500;
    min-height: 1rem;
  }

  /* ── Divider ── */
  .eip-divider {
    border: none;
    border-top: 1px solid var(--bd-border);
    margin: 1.5rem 0;
  }

  /* ── Toast ── */
  .eip-toast {
    border-radius: 10px;
    padding: 0.65rem 1rem;
    font-size: 0.82rem;
    margin-bottom: 1rem;
    text-align: center;
  }
  .eip-toast.success {
    background: rgba(78,227,160,0.1);
    border: 1px solid rgba(78,227,160,0.25);
    color: var(--bd-green);
  }
  .eip-toast.error {
    background: rgba(240,106,106,0.1);
    border: 1px solid rgba(240,106,106,0.25);
    color: #f06a6a;
  }

  /* ── Botões ── */
  .eip-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 1.2rem;
    border-radius: 12px;
    font-size: 0.88rem;
    font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    border: none;
    transition: opacity 0.18s, transform 0.15s;
  }
  .eip-btn:hover  { opacity: 0.88; transform: translateY(-1px); }
  .eip-btn:active { transform: translateY(0); }

  .eip-btn-primary {
    background: rgba(78,227,196,0.12);
    border: 1px solid rgba(78,227,196,0.3);
    color: var(--bd-teal);
    flex: 1;
  }
  .eip-btn-ghost {
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--bd-border);
    color: var(--bd-muted);
  }
`;

/* ── Helpers ── */
function calcStrength(val) {
  let score = 0;
  if (val.length >= 8)           score++;
  if (/[A-Z]/.test(val))         score++;
  if (/[0-9]/.test(val))         score++;
  if (/[^A-Za-z0-9]/.test(val))  score++;
  const map = [
    { pct: "0%",   color: "transparent", text: "" },
    { pct: "25%",  color: "#f06a6a",     text: "Fraca" },
    { pct: "50%",  color: "#f4c864",     text: "Razoável" },
    { pct: "75%",  color: "#4ee3c4",     text: "Boa" },
    { pct: "100%", color: "#4ee3a0",     text: "Forte" },
  ];
  return map[score];
}

/* ── Componente ── */
export default function EditarInfoPessoal() {
  const navigate = useNavigate();
  const { usuario, salvarUsuario } = useFinance();
  const avatarInputRef = useRef(null);

  const [nome,          setNome]          = useState(usuario?.nome   ?? "Usuário");
  const [email,         setEmail]         = useState(usuario?.email  ?? "");
  const [celular,       setCelular]       = useState(usuario?.celular ?? "");
  const [avatarSrc,     setAvatarSrc]     = useState(
    usuario?.avatar ??
    `https://ui-avatars.com/api/?name=${encodeURIComponent(usuario?.nome ?? "Usuário")}&background=4ee3c4&color=0d1525&size=200&bold=true`
  );

  const [senhaAtual,    setSenhaAtual]    = useState("");
  const [novaSenha,     setNovaSenha]     = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [showSenhaAtual,    setShowSenhaAtual]    = useState(false);
  const [showNovaSenha,     setShowNovaSenha]     = useState(false);
  const [showConfirmar,     setShowConfirmar]     = useState(false);

  const [toast,   setToast]   = useState({ msg: "", type: "" });
  const strength = calcStrength(novaSenha);

  /* ── Preview avatar ── */
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarSrc(ev.target.result);
    reader.readAsDataURL(file);
  };

  /* ── Salvar ── */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (novaSenha && novaSenha !== confirmarSenha) {
      setToast({ msg: "As senhas não coincidem.", type: "error" });
      return;
    }
    salvarUsuario({ nome, email, celular, avatar: avatarSrc });
    setToast({ msg: "Alterações salvas com sucesso!", type: "success" });
    setTimeout(() => setToast({ msg: "", type: "" }), 3000);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="eip-wrapper">

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
          <button className="eip-back-btn" onClick={() => navigate("/perfil")}>
            <i className="bi bi-arrow-left" />
          </button>
          <div>
            <p className="eip-greeting">Configurações / Perfil</p>
            <h1 className="eip-title">Dados Pessoais</h1>
          </div>
        </div>

        <div className="row g-4 align-items-start">

          {/* ── Coluna esquerda: Avatar ── */}
          <div className="col-12 col-lg-4">
            <div className="eip-card text-center">
              <p className="eip-section-title">Foto de Perfil</p>

              <div className="eip-avatar-wrap">
                <img src={avatarSrc} alt="Avatar" className="eip-avatar-img" />
                <div className="eip-avatar-edit" onClick={() => avatarInputRef.current.click()}>
                  <i className="bi bi-pencil-fill" />
                </div>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleAvatarChange}
                />
              </div>

              <p className="eip-avatar-hint">JPG, PNG ou GIF · Máx. 2 MB</p>

              <label className="eip-label">Nome exibido</label>
              <div className="eip-input-wrap">
                <input
                  className="eip-input no-prefix"
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Seu nome"
                  style={{ paddingRight: "2.4rem" }}
                />
                <i className="bi bi-pencil eip-pencil-icon" />
              </div>
            </div>
          </div>

          {/* ── Coluna direita: Formulário ── */}
          <div className="col-12 col-lg-8">
            <div className="eip-card">
              <p className="eip-section-title">Informações da Conta</p>

              <form onSubmit={handleSubmit}>

                {/* E-mail */}
                <label className="eip-label">E-mail</label>
                <div className="eip-input-wrap">
                  <i className="bi bi-envelope eip-prefix-icon" />
                  <input
                    className="eip-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    style={{ paddingRight: "2.4rem" }}
                  />
                  <i className="bi bi-pencil eip-pencil-icon" />
                </div>

                {/* Celular */}
                <label className="eip-label">Celular</label>
                <div className="eip-input-wrap">
                  <i className="bi bi-phone eip-prefix-icon" />
                  <input
                    className="eip-input"
                    type="tel"
                    value={celular}
                    onChange={(e) => setCelular(e.target.value)}
                    placeholder="(00) 00000-0000"
                    style={{ paddingRight: "2.4rem" }}
                  />
                  <i className="bi bi-pencil eip-pencil-icon" />
                </div>

                <hr className="eip-divider" />
                <p className="eip-section-title">Segurança</p>

                {/* Senha atual */}
                <label className="eip-label">Senha Atual</label>
                <div className="eip-input-wrap">
                  <i className="bi bi-lock eip-prefix-icon" />
                  <input
                    className="eip-input"
                    type={showSenhaAtual ? "text" : "password"}
                    value={senhaAtual}
                    onChange={(e) => setSenhaAtual(e.target.value)}
                    placeholder="••••••••"
                  />
                  <button type="button" className="eip-eye-btn" onClick={() => setShowSenhaAtual(p => !p)}>
                    <i className={`bi ${showSenhaAtual ? "bi-eye-slash" : "bi-eye"}`} />
                  </button>
                </div>

                {/* Nova senha */}
                <label className="eip-label">Nova Senha</label>
                <div className="eip-input-wrap" style={{ marginBottom: "0.4rem" }}>
                  <i className="bi bi-lock-fill eip-prefix-icon" />
                  <input
                    className="eip-input"
                    type={showNovaSenha ? "text" : "password"}
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    placeholder="••••••••"
                  />
                  <button type="button" className="eip-eye-btn" onClick={() => setShowNovaSenha(p => !p)}>
                    <i className={`bi ${showNovaSenha ? "bi-eye-slash" : "bi-eye"}`} />
                  </button>
                </div>
                {novaSenha && (
                  <>
                    <div className="eip-strength-bar">
                      <div className="eip-strength-fill" style={{ width: strength.pct, background: strength.color }} />
                    </div>
                    <p className="eip-strength-label" style={{ color: strength.color }}>{strength.text}</p>
                  </>
                )}
                <div style={{ marginBottom: "1rem" }} />

                {/* Confirmar nova senha */}
                <label className="eip-label">Confirmar Nova Senha</label>
                <div className="eip-input-wrap">
                  <i className="bi bi-shield-check eip-prefix-icon" />
                  <input
                    className="eip-input"
                    type={showConfirmar ? "text" : "password"}
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    placeholder="••••••••"
                  />
                  <button type="button" className="eip-eye-btn" onClick={() => setShowConfirmar(p => !p)}>
                    <i className={`bi ${showConfirmar ? "bi-eye-slash" : "bi-eye"}`} />
                  </button>
                </div>

                {/* Toast */}
                {toast.msg && (
                  <div className={`eip-toast ${toast.type}`}>{toast.msg}</div>
                )}

                {/* Ações */}
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button type="button" className="eip-btn eip-btn-ghost" onClick={() => navigate("/perfil")}>
                    Cancelar
                  </button>
                  <button type="submit" className="eip-btn eip-btn-primary">
                    <i className="bi bi-check-lg" style={{ marginRight: "0.3rem" }} />
                    Salvar Alterações
                  </button>
                </div>

              </form>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
