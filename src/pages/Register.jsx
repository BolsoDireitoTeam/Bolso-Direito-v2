import { useState } from "react";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --bd-bg: #0d1525;
    --bd-surface: #111c30;
    --bd-card: #15243d;
    --bd-border: rgba(255,255,255,0.08);
    --bd-teal: #4ee3c4;
    --bd-green: #4ee3a0;
    --bd-muted: #8a9bbf;
    --bd-text: #e8edf7;
    --bd-red: #f06a6a;
  }

  .login-wrapper {
    min-height: 100svh;
    background: var(--bd-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    font-family: 'DM Sans', sans-serif;
  }

  .login-card {
    width: 100%;
    max-width: 400px;
    background: var(--bd-card);
    border: 1px solid var(--bd-border);
    border-radius: 20px;
    padding: clamp(2rem, 5vw, 2.8rem) clamp(1.5rem, 5vw, 2.5rem);
    box-shadow: 0 24px 64px rgba(0,0,0,0.45);
    animation: fadeUp 0.45s ease both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .login-logo-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.65rem;
    margin-bottom: 2rem;
  }

  .login-diamond {
    width: 42px;
    height: 42px;
    background: #1a4d2e;
    border: 2px solid #2d7a4a;
    border-radius: 6px;
    transform: rotate(45deg);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 0 6px rgba(78,227,160,0.06);
  }

  .login-diamond-inner {
    width: 18px;
    height: 18px;
    background: var(--bd-green);
    border-radius: 3px;
  }

  .login-title {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: clamp(1.4rem, 5vw, 1.7rem);
    letter-spacing: 0.12em;
    color: var(--bd-text);
    text-transform: uppercase;
    margin: 0;
  }

  .login-subtitle {
    font-size: 0.8rem;
    color: var(--bd-muted);
    margin: 0;
    letter-spacing: 0.04em;
  }

  .login-field {
    margin-bottom: 1rem;
  }

  .login-label {
    display: block;
    font-size: 0.78rem;
    color: var(--bd-muted);
    margin-bottom: 0.45rem;
    letter-spacing: 0.03em;
  }

  .login-input {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--bd-border);
    border-radius: 12px;
    padding: 0.75rem 1rem;
    color: var(--bd-text);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    outline: none;
    transition: border-color 0.2s, background 0.2s;
    box-sizing: border-box;
  }

  .login-input:focus {
    border-color: rgba(78,227,196,0.4);
    background: rgba(78,227,196,0.04);
  }

  .login-input::placeholder {
    color: rgba(138,155,191,0.4);
  }

  .login-input.input-error {
    border-color: rgba(240,106,106,0.45);
  }

  .field-error {
    font-size: 0.72rem;
    color: var(--bd-red);
    margin-top: 0.35rem;
    display: block;
  }

  .btn-entrar {
    width: 100%;
    padding: 0.8rem;
    background: rgba(78,227,196,0.12);
    border: 1px solid rgba(78,227,196,0.35);
    border-radius: 12px;
    color: var(--bd-teal);
    font-family: 'Syne', sans-serif;
    font-weight: 600;
    font-size: 0.95rem;
    letter-spacing: 0.05em;
    cursor: pointer;
    transition: background 0.2s, box-shadow 0.2s, transform 0.1s;
    margin-top: 0.5rem;
    margin-bottom: 1.2rem;
  }

  .btn-entrar:hover {
    background: rgba(78,227,196,0.2);
    box-shadow: 0 0 18px rgba(78,227,196,0.12);
  }

  .btn-entrar:active {
    transform: scale(0.98);
  }

  .btn-entrar:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .login-error {
    background: rgba(240,106,106,0.1);
    border: 1px solid rgba(240,106,106,0.25);
    border-radius: 10px;
    color: var(--bd-red);
    font-size: 0.8rem;
    padding: 0.6rem 0.9rem;
    margin-bottom: 1.2rem;
    text-align: center;
    animation: fadeUp 0.2s ease both;
  }

  .login-footer {
    text-align: center;
    font-size: 0.78rem;
    color: var(--bd-muted);
  }

  .login-footer a {
    color: var(--bd-teal);
    text-decoration: none;
    font-weight: 500;
    transition: opacity 0.2s;
  }

  .login-footer a:hover {
    opacity: 0.75;
  }

  .password-strength {
    margin-top: 0.5rem;
    display: flex;
    gap: 4px;
  }

  .strength-bar {
    flex: 1;
    height: 3px;
    border-radius: 2px;
    background: rgba(255,255,255,0.08);
    transition: background 0.3s;
  }

  .strength-bar.active-weak   { background: var(--bd-red); }
  .strength-bar.active-medium { background: #f4c864; }
  .strength-bar.active-strong { background: var(--bd-green); }

  .strength-label {
    font-size: 0.7rem;
    margin-top: 0.3rem;
    color: var(--bd-muted);
  }
`;

function getPasswordStrength(password) {
  if (password.length === 0) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return 1;
  if (score <= 2) return 2;
  return 3;
}

const strengthLabel = ["", "Fraca", "Média", "Forte"];
const strengthClass = ["", "active-weak", "active-medium", "active-strong"];

export default function Register({ onLogin }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState("");
  const [loading, setLoading] = useState(false);

  const strength = getPasswordStrength(form.password);

  const set = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    setErrors(prev => ({ ...prev, [field]: "" }));
    setGlobalError("");
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Informe seu nome.";
    if (!form.email.trim()) newErrors.email = "Informe seu e-mail.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "E-mail inválido.";
    if (!form.password) newErrors.password = "Crie uma senha.";
    else if (form.password.length < 6) newErrors.password = "Mínimo 6 caracteres.";
    if (!form.confirm) newErrors.confirm = "Confirme sua senha.";
    else if (form.confirm !== form.password) newErrors.confirm = "As senhas não coincidem.";
    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (typeof onLogin === "function") onLogin({ username: form.name });
      navigate("/");
    }, 900);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="login-wrapper">
        <div className="login-card">

          <div className="login-logo-wrap">
            <div className="login-diamond">
              <div className="login-diamond-inner" />
            </div>
            <h1 className="login-title">Bolso Direito</h1>
            <p className="login-subtitle">Crie sua conta grátis</p>
          </div>

          {globalError && <div className="login-error">{globalError}</div>}

          <div className="login-field">
            <label className="login-label" htmlFor="reg-name">Nome</label>
            <input
              id="reg-name"
              className={`login-input${errors.name ? " input-error" : ""}`}
              type="text"
              placeholder="Seu nome completo"
              value={form.name}
              onChange={set("name")}
              autoComplete="name"
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          <div className="login-field">
            <label className="login-label" htmlFor="reg-email">E-mail</label>
            <input
              id="reg-email"
              className={`login-input${errors.email ? " input-error" : ""}`}
              type="email"
              placeholder="seu@email.com"
              value={form.email}
              onChange={set("email")}
              autoComplete="email"
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="login-field">
            <label className="login-label" htmlFor="reg-password">Senha</label>
            <input
              id="reg-password"
              className={`login-input${errors.password ? " input-error" : ""}`}
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={form.password}
              onChange={set("password")}
              autoComplete="new-password"
            />
            {form.password.length > 0 && (
              <>
                <div className="password-strength">
                  {[1, 2, 3].map(i => (
                    <div
                      key={i}
                      className={`strength-bar${strength >= i ? ` ${strengthClass[strength]}` : ""}`}
                    />
                  ))}
                </div>
                <span className="strength-label">Força: {strengthLabel[strength]}</span>
              </>
            )}
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <div className="login-field">
            <label className="login-label" htmlFor="reg-confirm">Confirmar senha</label>
            <input
              id="reg-confirm"
              className={`login-input${errors.confirm ? " input-error" : ""}`}
              type="password"
              placeholder="Repita a senha"
              value={form.confirm}
              onChange={set("confirm")}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              autoComplete="new-password"
            />
            {errors.confirm && <span className="field-error">{errors.confirm}</span>}
          </div>

          <button
            className="btn-entrar"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Criando conta..." : "Criar conta"}
          </button>

          <div className="login-footer">
            Já tem conta?{" "}
            <a href="#" onClick={(e) => { e.preventDefault(); navigate("/login"); }}>
              Entrar
            </a>
          </div>

        </div>
      </div>
    </>
  );
}
