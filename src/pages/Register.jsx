import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
