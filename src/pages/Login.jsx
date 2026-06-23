import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../validation/schemas";
import { useAppDispatch } from "../store/hooks";
import { login as loginAction } from "../store/slices/userSlice";
import { mostrarToastTemporario } from "../store/slices/uiSlice";
import { api } from "../services/api";

export default function Login({ onLogin }) {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  // ── Captura token do callback Google OAuth ──
  useEffect(() => {
    const token = searchParams.get("token");
    const nome = searchParams.get("nome");
    const email = searchParams.get("email");
    const error = searchParams.get("error");

    if (error) {
      dispatch(mostrarToastTemporario("Falha no login com Google. Tente novamente.", "error"));
      return;
    }

    if (token) {
      localStorage.setItem("token", token);
      const userData = { nome: nome || "Usuário", email: email || "" };
      dispatch(loginAction(userData));
      if (typeof onLogin === "function") onLogin(userData);
      dispatch(mostrarToastTemporario("Login com Google realizado!", "success"));
      navigate("/", { replace: true });
    }
  }, [searchParams, dispatch, navigate, onLogin]);

  const onSubmit = async (data) => {
    setLoading(true);
    setApiError("");

    try {
      const response = await api.post("/users/login", {
        email: data.username,
        senha: data.password,
      });

      // Salva o token no localStorage
      localStorage.setItem("token", response.token);

      // Dispatch para o Redux
      const userData = response.data;
      dispatch(loginAction(userData));
      if (typeof onLogin === "function") onLogin(userData);

      dispatch(mostrarToastTemporario("Login realizado com sucesso!", "success"));
    } catch (error) {
      setApiError(error.message || "Credenciais inválidas.");
      dispatch(mostrarToastTemporario(error.message || "Erro ao fazer login.", "error"));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google";
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

          {(errors.username || errors.password || apiError) && (
            <div className="login-error">
              {apiError || errors.username?.message || errors.password?.message}
            </div>
          )}

          <div className="login-field">
            <label className="login-label" htmlFor="bd-username">Usuário</label>
            <input
              id="bd-username"
              className="login-input"
              type="text"
              placeholder="seu@email.com"
              {...register("username")}
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
              {...register("password")}
              autoComplete="current-password"
            />
          </div>

          <div className="login-forgot">
            <a href="#">Esqueceu a senha?</a>
          </div>

          <button
            className="btn-entrar"
            onClick={handleSubmit(onSubmit)}
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
            <button className="btn-secondary" onClick={handleGoogleLogin}>
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
