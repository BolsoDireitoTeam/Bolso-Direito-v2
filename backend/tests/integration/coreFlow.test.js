/**
 * ============================================================
 *  Bolso Direito v2 — Testes de Integração (E2E API)
 *  Valida o fluxo crítico: Register → Login → Criar Transação
 *  → Listar Transações → Importar Batch → Deletar Transação
 *  
 *  Usa MongoMemoryServer para isolamento total do banco dev.
 * ============================================================
 */

const request = require('supertest');
const db = require('../setup');

// Configurar variáveis de ambiente para testes ANTES de importar o app
process.env.JWT_SECRET = 'test-jwt-secret-bolsodireito';
process.env.JWT_EXPIRES_IN = '1h';
process.env.NODE_ENV = 'test';
process.env.FRONTEND_URL = 'http://localhost:5173';

// Importar app DEPOIS de configurar env
const app = require('../../src/app');

// Dados de teste
const testUser = {
  nome: 'Teste Integração',
  email: 'teste@bolsodireito.com',
  senha: 'SenhaSegura123!',
};

let authToken = '';
let transactionId = '';

// ─── Lifecycle ──────────────────────────────────────────────

beforeAll(async () => {
  await db.connect();
});

afterAll(async () => {
  await db.closeDatabase();
});

// ─── 1. REGISTRO ────────────────────────────────────────────

describe('POST /api/users/register', () => {
  it('deve criar um novo usuário e retornar JWT', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send(testUser)
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.data).toBeDefined();
    expect(res.body.data.nome).toBe(testUser.nome);
    expect(res.body.data.email).toBe(testUser.email);
    expect(res.body.data.senha).toBeUndefined();

    // Salvar token para os próximos testes
    authToken = res.body.token;
  });

  it('deve rejeitar registro com email duplicado', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send(testUser);

    expect([400, 500]).toContain(res.status);
    expect(res.body.success).toBe(false);
  });
});

// ─── 2. VERIFICAR TOKEN DO REGISTRO ─────────────────────────

describe('Verificar token JWT do registro', () => {
  it('deve aceitar o token do registro em rotas protegidas', async () => {
    expect(authToken).toBeTruthy();

    const res = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.nome).toBe(testUser.nome);
  });
});

// ─── 3. LOGIN ───────────────────────────────────────────────

describe('POST /api/users/login', () => {
  it('deve autenticar com credenciais válidas e retornar JWT', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: testUser.email, senha: testUser.senha })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.data.nome).toBe(testUser.nome);

    authToken = res.body.token;
  });

  it('deve rejeitar credenciais inválidas', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: testUser.email, senha: 'senhaErrada' })
      .expect(401);

    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('inválidas');
  });

  it('deve rejeitar login sem senha', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: testUser.email })
      .expect(400);

    expect(res.body.success).toBe(false);
  });
});

// ─── 4. ESTADO FINANCEIRO ────────────────────────────────────

describe('GET /api/users/full-state', () => {
  it('deve retornar o estado financeiro completo', async () => {
    const res = await request(app)
      .get('/api/users/full-state')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('saldo');
    expect(res.body.data).toHaveProperty('transacoes');
    expect(res.body.data).toHaveProperty('estado');
    expect(res.body.data).toHaveProperty('configuracoes');
  });
});

// ─── 5. CRIAR TRANSAÇÃO ─────────────────────────────────────

describe('POST /api/transactions', () => {
  it('deve criar uma transação com Bearer Token', async () => {
    const res = await request(app)
      .post('/api/transactions')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        tipo: 'gasto',
        subtipo: 'debito',
        nome: 'Supermercado Teste',
        valor: 150.50,
        categoria: 'Alimentação',
        data: '2026-06-15',
      })
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.nome).toBe('Supermercado Teste');
    expect(res.body.data.valor).toBe(150.50);

    transactionId = res.body.data._id;
  });

  it('deve rejeitar requisição sem token', async () => {
    const res = await request(app)
      .post('/api/transactions')
      .send({ tipo: 'gasto', nome: 'Sem Token', valor: 10 })
      .expect(401);

    expect(res.body.success).toBe(false);
  });
});

// ─── 6. LISTAR TRANSAÇÕES ────────────────────────────────────

describe('GET /api/transactions', () => {
  it('deve retornar a lista de transações do usuário', async () => {
    const res = await request(app)
      .get('/api/transactions')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
  });
});

// ─── 7. IMPORTAR BATCH ──────────────────────────────────────

describe('POST /api/transactions/import-batch', () => {
  it('deve importar transações em lote', async () => {
    const res = await request(app)
      .post('/api/transactions/import-batch')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        transacoes: [
          { tipo: 'ganho', nome: 'Salário Teste', valor: 5000, data: '2026-06-01' },
          { tipo: 'gasto', subtipo: 'debito', nome: 'Uber', valor: 25, categoria: 'Transporte', data: '2026-06-10' },
          { tipo: 'gasto', subtipo: 'credito', nome: 'Amazon', valor: 300, categoria: 'Compras', data: '2026-06-12', parcelas: 3 },
        ],
      })
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data.importadas).toBeGreaterThanOrEqual(3);
  });

  it('deve rejeitar batch com array vazio', async () => {
    const res = await request(app)
      .post('/api/transactions/import-batch')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ transacoes: [] })
      .expect(400);

    expect(res.body.success).toBe(false);
  });
});

// ─── 8. DELETAR TRANSAÇÃO ────────────────────────────────────

describe('DELETE /api/transactions/:id', () => {
  it('deve deletar a transação criada', async () => {
    expect(transactionId).toBeTruthy();

    const res = await request(app)
      .delete(`/api/transactions/${transactionId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(res.body.success).toBe(true);
  });
});

// ─── 9. HEALTH CHECK ─────────────────────────────────────────

describe('GET /health', () => {
  it('deve retornar status OK', async () => {
    const res = await request(app)
      .get('/health')
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Server is running');
  });
});
