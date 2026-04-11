import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


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
            <button className="btn-secondary"onClick={() => navigate("/registro")}>
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
