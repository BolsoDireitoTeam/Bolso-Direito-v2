import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from '../store/hooks'
import { selectConfiguracoes, selectSaldo, salvarConfiguracoes } from '../store/slices/financeSlice'
import { selectUsuario } from '../store/slices/userSlice'
import { mostrarToastTemporario } from '../store/slices/uiSlice'
import { moeda } from "../utils/format";

export default function User() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const configuracoes = useAppSelector(selectConfiguracoes);
  const saldo = useAppSelector(selectSaldo);
  const usuario = useAppSelector(selectUsuario);

  const nome = usuario?.nome ?? "Usuário";
  const avatar = usuario?.avatar ??
    `https://ui-avatars.com/api/?name=${encodeURIComponent(nome)}&background=4ee3c4&color=0d1525&size=200&bold=true`;

  const isPremium = configuracoes.plano === 'premium';

  const togglePlano = () => {
    const novoPlano = isPremium ? 'gratuito' : 'premium';
    dispatch(salvarConfiguracoes({ plano: novoPlano }));
    dispatch(mostrarToastTemporario(isPremium ? 'Plano alterado para Gratuito.' : 'Upgrade para PRO realizado! 🌟'));
  };

  return (
    <div className="user-wrapper">
      <p className="greeting">Configurações</p>
      <h2 className="user-title">Meu Perfil</h2>

      <div className="profile-card">
        <div className="position-relative">
          <img
            src={avatar}
            alt="Foto de Perfil"
            className="profile-avatar-img"
          />
          <div className={`plan-badge ${isPremium ? 'premium' : 'free'}`}>
            {isPremium ? <i className="bi bi-star-fill me-1"></i> : null}
            {isPremium ? 'PRO' : 'FREE'}
          </div>
        </div>

        <div className="profile-name">{nome}</div>

        <div className="mb-4">
          <p className="profile-balance-label">Saldo Disponível</p>
          <p className="profile-balance-value">{moeda(saldo)}</p>
        </div>

        <div className="d-flex flex-column gap-2 w-100">
          <button
            className="btn-bd-primary py-3"
            onClick={() => navigate("/editar-dados-cadastrais")}
          >
            <i className="bi bi-person-gear me-2"></i> Atualizar Dados Cadastrais
          </button>
          
          <button
            className="btn-bd-secondary py-3"
            onClick={() => navigate("/editar-dados-financeiros")}
          >
            <i className="bi bi-gear me-2"></i> Configurações Financeiras
          </button>

          <button
            className={`btn-bd-outline py-3 mt-2 ${isPremium ? 'text-muted' : 'text-teal'}`}
            style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)' }}
            onClick={togglePlano}
          >
            <i className={`bi bi-${isPremium ? 'arrow-down-circle' : 'patch-check'} me-2`}></i>
            {isPremium ? 'Reverter para Plano Gratuito' : 'Fazer Upgrade para PRO'}
          </button>
        </div>
      </div>

    </div>
  );
}
