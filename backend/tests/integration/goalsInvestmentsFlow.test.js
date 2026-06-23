/**
 * ============================================================
 *  Bolso Direito v2 — Testes de Integração: Metas & Investimentos
 *  Valida: criar meta, aportar, resgatar, deletar meta
 *           criar investimento, aportar, deletar investimento
 * ============================================================
 */

const request = require('supertest');
const db = require('../setup');

process.env.JWT_SECRET = 'test-jwt-secret-bolsodireito';
process.env.JWT_EXPIRES_IN = '1h';
process.env.NODE_ENV = 'test';
process.env.FRONTEND_URL = 'http://localhost:5173';

const app = require('../../src/app');

const testUser = {
  nome: 'Teste Metas',
  email: `metas${Date.now()}@bolsodireito.com`,
  senha: 'SenhaSegura123!',
};

let authToken = '';
let goalId = '';
let investmentId = '';

beforeAll(async () => {
  await db.connect();
  // Registrar e logar para obter token
  const res = await request(app)
    .post('/api/users/register')
    .send(testUser)
    .expect(201);
  authToken = res.body.token;

  // Depositar saldo inicial para os testes
  await request(app)
    .post('/api/transactions')
    .set('Authorization', `Bearer ${authToken}`)
    .send({ tipo: 'ganho', nome: 'Salário Teste', valor: 10000, data: '2026-06-01' })
    .expect(201);
});

afterAll(async () => {
  await db.closeDatabase();
});

// ─── METAS ──────────────────────────────────────────────────

describe('POST /api/goals — criar meta', () => {
  it('deve criar uma meta financeira', async () => {
    const res = await request(app)
      .post('/api/goals')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        nome: 'Viagem Europa',
        valorAlvo: 20000,
        prazo: '2027-12-31',
        aporteInicial: 500,
      })
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data.nome).toBe('Viagem Europa');
    expect(res.body.data.valorAtual).toBe(500);
    goalId = res.body.data._id;
  });
});

describe('POST /api/goals/:id/contribute — aportar na meta', () => {
  it('deve aportar valor na meta usando {valor}', async () => {
    expect(goalId).toBeTruthy();
    const res = await request(app)
      .post(`/api/goals/${goalId}/contribute`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ valor: 1000 })
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data.valorAtual).toBe(1500);
  });

  it('deve rejeitar aporte com valor inválido', async () => {
    const res = await request(app)
      .post(`/api/goals/${goalId}/contribute`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({});
    expect([400, 500]).toContain(res.status);
  });
});

describe('POST /api/goals/:id/redeem — resgatar da meta', () => {
  it('deve resgatar valor da meta', async () => {
    expect(goalId).toBeTruthy();
    const res = await request(app)
      .post(`/api/goals/${goalId}/redeem`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ valor: 200 })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.valorAtual).toBe(1300);
  });

  it('deve rejeitar resgate acima do disponível', async () => {
    const res = await request(app)
      .post(`/api/goals/${goalId}/redeem`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ valor: 99999 })
      .expect(400);

    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('excede');
  });
});

describe('DELETE /api/goals/:id — excluir meta', () => {
  it('deve excluir a meta e devolver saldo restante', async () => {
    const res = await request(app)
      .delete(`/api/goals/${goalId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);
  });
});

// ─── INVESTIMENTOS ──────────────────────────────────────────

describe('POST /api/investments — criar investimento', () => {
  it('deve criar um investimento', async () => {
    const res = await request(app)
      .post('/api/investments')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        nome: 'Tesouro Direto Teste',
        tipo: 'renda-fixa',
        valorInicial: 1000,
        taxaMensal: 0.01,
        dataInicio: '2026-01-01',
      })
      .expect(201);

    expect(res.body.success).toBe(true);
    investmentId = res.body.data._id;
  });
});

describe('POST /api/investments/:id/aportes — aportar investimento', () => {
  it('deve aportar no investimento usando {valor, data}', async () => {
    expect(investmentId).toBeTruthy();
    const res = await request(app)
      .post(`/api/investments/${investmentId}/aportes`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ valor: 500, data: '2026-06-15' })
      .expect(201);

    expect(res.body.success).toBe(true);
  });
});

describe('DELETE /api/investments/:id — excluir investimento', () => {
  it('deve excluir o investimento', async () => {
    const res = await request(app)
      .delete(`/api/investments/${investmentId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);
  });
});

// ─── CATEGORIAS ─────────────────────────────────────────────

describe('GET /api/categories — listar categorias', () => {
  it('deve retornar categorias do usuário (com seed)', async () => {
    const res = await request(app)
      .get('/api/categories')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});

describe('POST /api/categories — criar categoria', () => {
  it('deve criar uma nova categoria', async () => {
    const res = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ nome: 'Academia', cor: '#ff6b6b', icone: 'bi-bicycle' })
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data.nome).toBe('Academia');
  });

  it('deve rejeitar categoria com nome duplicado', async () => {
    const res = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ nome: 'Academia', cor: '#000', icone: 'bi-tag' });

    expect([400, 409]).toContain(res.status);
    expect(res.body.success).toBe(false);
  });
});

// ─── ISOLAMENTO DE DADOS (IDOR) ──────────────────────────────

describe('IDOR — outro usuário não acessa dados alheios', () => {
  let otherToken = '';
  let sharedGoalId = '';

  it('setup: criar meta com o usuário original', async () => {
    const res = await request(app)
      .post('/api/goals')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ nome: 'Meta Privada', valorAlvo: 5000, prazo: '2028-01-01' })
      .expect(201);
    sharedGoalId = res.body.data._id;
  });

  it('setup: registrar segundo usuário', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({ nome: 'Invasor', email: `invasor${Date.now()}@test.com`, senha: 'SenhaSegura123!' })
      .expect(201);
    otherToken = res.body.token;
  });

  it('segundo usuário NÃO deve conseguir ver a meta do primeiro', async () => {
    const res = await request(app)
      .get(`/api/goals/${sharedGoalId}`)
      .set('Authorization', `Bearer ${otherToken}`);

    expect([403, 404]).toContain(res.status);
  });

  it('segundo usuário NÃO deve conseguir aportar na meta do primeiro', async () => {
    const res = await request(app)
      .post(`/api/goals/${sharedGoalId}/contribute`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ valor: 100 });

    expect([403, 404]).toContain(res.status);
  });
});
