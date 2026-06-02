// ============================================================
//  Bolso Direito v2 — validation/schemas.js
//  Schemas Yup centralizados para todos os formulários.
//  Utilizados com react-hook-form via @hookform/resolvers/yup
// ============================================================

import * as yup from 'yup'

// ── Login ────────────────────────────────────────────────────
export const loginSchema = yup.object({
  username: yup
    .string()
    .trim()
    .required('Informe o usuário.'),
  password: yup
    .string()
    .required('Informe a senha.'),
})

// ── Registro ─────────────────────────────────────────────────
export const registerSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required('Informe seu nome.'),
  email: yup
    .string()
    .trim()
    .email('E-mail inválido.')
    .required('Informe seu e-mail.'),
  password: yup
    .string()
    .min(6, 'Mínimo 6 caracteres.')
    .required('Crie uma senha.'),
  confirm: yup
    .string()
    .oneOf([yup.ref('password')], 'As senhas não coincidem.')
    .required('Confirme sua senha.'),
})

// ── Nova Meta ────────────────────────────────────────────────
export const novaMetaSchema = yup.object({
  nome: yup
    .string()
    .trim()
    .required('Dê um nome para sua meta.'),
  valorAlvo: yup
    .number()
    .typeError('Informe um valor numérico.')
    .positive('Informe um valor-alvo válido.')
    .required('Informe o valor-alvo.'),
  aporteInicial: yup
    .number()
    .typeError('Informe um valor numérico.')
    .min(0, 'Aporte não pode ser negativo.')
    .default(0),
})

// ── Novo Investimento ────────────────────────────────────────
export const novoInvestimentoSchema = yup.object({
  nome: yup
    .string()
    .trim()
    .required('Dê um nome ao investimento.'),
  tipo: yup
    .string()
    .required('Selecione o tipo de investimento.'),
  valor: yup
    .number()
    .typeError('Informe um valor numérico.')
    .positive('Informe um valor inicial válido.')
    .required('Informe o valor inicial.'),
  taxaMensal: yup
    .number()
    .typeError('Informe um valor numérico.')
    .min(0, 'Taxa não pode ser negativa.')
    .required('Informe a taxa mensal.'),
})

// ── Editar Info Pessoal ──────────────────────────────────────
export const editarInfoPessoalSchema = yup.object({
  nome: yup
    .string()
    .trim()
    .required('Informe seu nome.'),
  email: yup
    .string()
    .trim()
    .email('E-mail inválido.'),
  celular: yup
    .string()
    .trim(),
  novaSenha: yup
    .string()
    .nullable()
    .transform((value) => (value === '' ? null : value))
    .min(6, 'Mínimo 6 caracteres.'),
  confirmarSenha: yup
    .string()
    .nullable()
    .transform((value) => (value === '' ? null : value))
    .when('novaSenha', {
      is: (val) => val && val.length > 0,
      then: (schema) => schema
        .oneOf([yup.ref('novaSenha')], 'As senhas não coincidem.')
        .required('Confirme a nova senha.'),
    }),
})
