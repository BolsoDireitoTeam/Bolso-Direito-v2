import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../validation/schemas";

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
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirm: "" },
  });

  const passwordValue = watch("password", "");
  const strength = getPasswordStrength(passwordValue);

  const onSubmit = (data) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (typeof onLogin === "function") onLogin({ username: data.name });
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

          <div className="login-field">
            <label className="login-label" htmlFor="reg-name">Nome</label>
            <input
              id="reg-name"
              className={`login-input${errors.name ? " input-error" : ""}`}
              type="text"
              placeholder="Seu nome completo"
              {...register("name")}
              autoComplete="name"
            />
            {errors.name && <span className="field-error">{errors.name.message}</span>}
          </div>

          <div className="login-field">
            <label className="login-label" htmlFor="reg-email">E-mail</label>
            <input
              id="reg-email"
              className={`login-input${errors.email ? " input-error" : ""}`}
              type="email"
              placeholder="seu@email.com"
              {...register("email")}
              autoComplete="email"
            />
            {errors.email && <span className="field-error">{errors.email.message}</span>}
          </div>

          <div className="login-field">
            <label className="login-label" htmlFor="reg-password">Senha</label>
            <input
              id="reg-password"
              className={`login-input${errors.password ? " input-error" : ""}`}
              type="password"
              placeholder="Mínimo 6 caracteres"
              {...register("password")}
              autoComplete="new-password"
            />
            {passwordValue.length > 0 && (
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
            {errors.password && <span className="field-error">{errors.password.message}</span>}
          </div>

          <div className="login-field">
            <label className="login-label" htmlFor="reg-confirm">Confirmar senha</label>
            <input
              id="reg-confirm"
              className={`login-input${errors.confirm ? " input-error" : ""}`}
              type="password"
              placeholder="Repita a senha"
              {...register("confirm")}
              autoComplete="new-password"
            />
            {errors.confirm && <span className="field-error">{errors.confirm.message}</span>}
          </div>

          <button
            className="btn-entrar"
            onClick={handleSubmit(onSubmit)}
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
