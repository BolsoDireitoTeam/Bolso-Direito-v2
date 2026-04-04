import { useState } from "react";

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
    margin-bottom: 2.2rem;
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
    transform: rotate(0deg);
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
    margin-bottom: 1.2rem;
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

  .login-forgot {
    text-align: right;
    margin-top: -0.6rem;
    margin-bottom: 1.8rem;
  }

  .login-forgot a {
    font-size: 0.75rem;
    color: var(--bd-muted);
    text-decoration: none;
    transition: color 0.2s;
  }

  .login-forgot a:hover {
    color: var(--bd-teal);
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
    margin-bottom: 1rem;
  }

  .btn-entrar:hover {
    background: rgba(78,227,196,0.2);
    box-shadow: 0 0 18px rgba(78,227,196,0.12);
  }

  .btn-entrar:active {
    transform: scale(0.98);
  }

  .login-divider {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
    color: var(--bd-muted);
    font-size: 0.72rem;
    letter-spacing: 0.05em;
  }

  .login-divider::before,
  .login-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--bd-border);
  }

  .btn-secondary-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.7rem;
  }

  .btn-secondary {
    padding: 0.7rem 0.5rem;
    background: transparent;
    border: 1px solid var(--bd-border);
    border-radius: 12px;
    color: var(--bd-muted);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.82rem;
    cursor: pointer;
    transition: border-color 0.2s, color 0.2s, background 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
  }

  .btn-secondary:hover {
    border-color: rgba(255,255,255,0.2);
    color: var(--bd-text);
    background: rgba(255,255,255,0.04);
  }

  .btn-secondary svg {
    width: 15px;
    height: 15px;
    flex-shrink: 0;
  }

  .login-error {
    background: rgba(240,106,106,0.1);
    border: 1px solid rgba(240,106,106,0.25);
    border-radius: 10px;
    color: #f06a6a;
    font-size: 0.8rem;
    padding: 0.6rem 0.9rem;
    margin-bottom: 1.2rem;
    text-align: center;
    animation: fadeUp 0.2s ease both;
  }
`;

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e?.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Preencha usuário e senha.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (typeof onLogin === "function") onLogin({ username });
    }, 800);
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
            <p className="login-subtitle">Controle financeiro pessoal</p>
          </div>

          {error && <div className="login-error">{error}</div>}

          <div className="login-field">
            <label className="login-label" htmlFor="bd-username">Usuário</label>
            <input
              id="bd-username"
              className="login-input"
              type="text"
              placeholder="seu@email.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              autoComplete="username"
            />
          </div>

          <div className="login-field">
            <label className="login-label" htmlFor="bd-password">Senha</label>
            <input
              id="bd-password"
              className="login-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              autoComplete="current-password"
            />
          </div>

          <div className="login-forgot">
            <a href="#">Esqueceu a senha?</a>
          </div>

          <button
            className="btn-entrar"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <div className="login-divider">ou</div>

          <div className="btn-secondary-row">
            <button className="btn-secondary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              Criar conta
            </button>
            <button className="btn-secondary">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M21.35 11.1H12v2.98h5.35c-.53 2.45-2.68 4.07-5.35 4.07a6.15 6.15 0 110-12.3c1.56 0 2.97.59 4.04 1.54l2.13-2.13A10.15 10.15 0 0012 2.9C6.97 2.9 2.9 6.97 2.9 12S6.97 21.1 12 21.1c5.3 0 9.1-3.72 9.1-9a9.7 9.7 0 00-.75-3z"/>
              </svg>
              Login Google
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
