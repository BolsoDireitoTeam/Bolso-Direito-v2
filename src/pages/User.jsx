import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  .user-wrapper {
    font-family: 'DM Sans', sans-serif;
  }

  .greeting {
    font-size: 0.8rem;
    color: var(--bd-muted);
    letter-spacing: 0.04em;
    text-transform: uppercase;
    margin-bottom: 0.15rem;
  }

  .user-title {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: clamp(1.4rem, 4vw, 2rem);
    color: var(--bd-text);
    line-height: 1.1;
    margin-bottom: 1.5rem;
  }

  .profile-card {
    background: var(--bd-card);
    border: 1px solid var(--bd-border);
    border-radius: 20px;
    padding: 2rem 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.75rem;
    max-width: 420px;
  }

  .profile-avatar-img {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    border: 3px solid rgba(78,227,196,0.35);
    object-fit: cover;
  }

  .profile-name {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 1.35rem;
    color: var(--bd-text);
  }

  .profile-balance-label {
    font-size: 0.72rem;
    color: var(--bd-muted);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 0.25rem;
  }

  .profile-balance-value {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 1.6rem;
    color: var(--bd-teal);
    line-height: 1;
    margin: 0;
  }

  .btn-bd {
    display: block;
    width: 100%;
    padding: 0.8rem 1.2rem;
    border-radius: 12px;
    font-size: 0.9rem;
    font-weight: 500;
    text-align: center;
    cursor: pointer;
    transition: opacity 0.18s, transform 0.15s;
    border: none;
    font-family: 'DM Sans', sans-serif;
  }

  .btn-bd:hover  { opacity: 0.88; transform: translateY(-1px); }
  .btn-bd:active { transform: translateY(0); }

  .btn-bd-primary {
    background: rgba(78,227,196,0.12);
    border: 1px solid rgba(78,227,196,0.28);
    color: var(--bd-teal);
  }

  .btn-bd-primary:hover {
    background: rgba(78,227,196,0.18);
    color: var(--bd-teal);
  }

  .btn-bd-secondary {
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--bd-border);
    color: var(--bd-text);
  }

  .btn-bd-secondary:hover {
    background: rgba(255,255,255,0.08);
    color: var(--bd-text);
  }
`;

export default function User({ usuario }) {
  const navigate = useNavigate();

  const nome   = usuario?.nome   ?? "Usuário";
  const saldo  = usuario?.saldo  ?? 0;
  const avatar = usuario?.avatar ??
    `https://ui-avatars.com/api/?name=${encodeURIComponent(nome)}&background=4ee3c4&color=0d1525&size=200&bold=true`;

  const saldoFormatado = saldo.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <>
      <style>{styles}</style>
      <div className="user-wrapper">

        <p className="greeting">Configurações</p>
        <h1 className="user-title">Perfil</h1>

        <div className="profile-card">

          <img
            src={avatar}
            alt="Foto de Perfil"
            className="profile-avatar-img"
          />

          <div className="profile-name">{nome}</div>

          <div>
            <p className="profile-balance-label">Saldo Disponível</p>
            <p className="profile-balance-value">{saldoFormatado}</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%", marginTop: "0.5rem" }}>
            <button
              className="btn-bd btn-bd-primary"
              onClick={() => navigate("/editar-dados-cadastrais")}
            >
              Atualizar Dados Cadastrais
            </button>
            <button
              className="btn-bd btn-bd-secondary"
              onClick={() => navigate("/editar-dados-financeiros")}
            >
              Atualizar Dados Financeiros
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
