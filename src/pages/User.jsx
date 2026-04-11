import { useNavigate } from "react-router-dom";

export default function User({ usuario }) {
  const navigate = useNavigate();

  const nome = usuario?.nome ?? "Usuário";
  const saldo = usuario?.saldo ?? 0;
  const avatar = usuario?.avatar ??
    `https://ui-avatars.com/api/?name=${encodeURIComponent(nome)}&background=4ee3c4&color=0d1525&size=200&bold=true`;

  const saldoFormatado = saldo.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <>
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
