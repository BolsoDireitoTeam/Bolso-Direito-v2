#!/bin/bash
git add .
git commit -m "refactor: migrar gerenciamento de estado global para Redux Toolkit" -m "- Substituir FinanceContext e useFinance por Redux Toolkit" -m "- Criar store com slices dedicados: finance, metas, investimentos, user, ui" -m "- Migrar todos os componentes e páginas para usar useAppSelector e useAppDispatch" -m "- Implementar middleware de sincronização cross-slice (metas/investimentos -> saldo)" -m "- Remover hooks e provedores de contexto legados"
