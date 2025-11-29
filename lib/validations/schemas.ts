import { z } from 'zod';

// ===== USUARIO SCHEMAS =====
export const createUsuarioSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').max(200, 'Nome muito longo'),
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  perfil: z.enum(['ADMIN', 'COORDENADOR', 'MODERADOR', 'ALUNO'], {
    message: 'Perfil inválido'
  }),
  alunoId: z.string().uuid('ID do aluno inválido').optional(),
}).refine((data) => {
  // If perfil is ALUNO, alunoId is required
  if (data.perfil === 'ALUNO' && !data.alunoId) {
    return false;
  }
  return true;
}, {
  message: 'alunoId é obrigatório quando perfil é ALUNO',
  path: ['alunoId'],
});

export const updateUsuarioSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').max(200, 'Nome muito longo').optional(),
  email: z.string().email('Email inválido').optional(),
  perfil: z.enum(['ADMIN', 'COORDENADOR', 'MODERADOR', 'ALUNO']).optional(),
});

// ===== TURMA SCHEMAS =====
export const createTurmaSchema = z.object({
  nome_turma: z.string().min(1, 'Nome da turma é obrigatório').max(200, 'Nome muito longo'),
  dia_semana: z.string().min(1, 'Dia da semana é obrigatório'),
  horario: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Horário inválido (use formato HH:mm)'),
  turno: z.enum(['MANHA', 'TARDE', 'NOITE'], {
    message: 'Turno inválido'
  }),
  moderadorId: z.string().uuid('ID do moderador inválido'),
  capacidade_maxima: z.number().int().positive('Capacidade deve ser positiva').optional().nullable(),
  data_inicio: z.string().nullable().optional(),
  data_fim: z.string().nullable().optional(),
  status: z.enum(['ABERTA', 'EM_ANDAMENTO', 'CONCLUIDA']).optional(),
  local: z.string().max(500, 'Local muito longo').optional().nullable(),
});

export const updateTurmaSchema = createTurmaSchema.partial();

// ===== ALUNO SCHEMAS =====
export const createAlunoSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').max(200, 'Nome muito longo'),
  turmaId: z.string().uuid('ID da turma inválido'),
  data_nascimento: z.string().optional().nullable(),
  observacoes: z.string().max(1000, 'Observações muito longas').optional().nullable(),
});

export const updateAlunoSchema = createAlunoSchema.partial().omit({ turmaId: true }).extend({
  turmaId: z.string().uuid('ID da turma inválido').optional(),
});

// ===== DOMINIO COGNITIVO SCHEMAS =====
export const createDominioSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório').max(200, 'Nome muito longo'),
  descricao: z.string().max(1000, 'Descrição muito longa').optional().nullable(),
  pontuacao_maxima: z.number().positive('Pontuação máxima deve ser positiva').optional(),
});

export const updateDominioSchema = createDominioSchema.partial();

// ===== TEMPLATE SCHEMAS =====
export const createTemplateSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório').max(200, 'Nome muito longo'),
  mes_referencia: z.number().int().min(1, 'Mês inválido').max(12, 'Mês inválido'),
  ano_referencia: z.number().int().min(2000, 'Ano inválido').max(2100, 'Ano inválido'),
  observacoes: z.string().max(1000, 'Observações muito longas').optional().nullable(),
});

export const updateTemplateSchema = createTemplateSchema.partial();

// ===== TEMPLATE ITEM SCHEMAS =====
export const createItemSchema = z.object({
  dominioId: z.string().uuid('Domínio inválido'),
  codigo_item: z.string().min(1, 'Código é obrigatório').max(50, 'Código muito longo'),
  titulo: z.string().min(1, 'Título é obrigatório').max(200, 'Título muito longo'),
  descricao: z.string().optional(),
  tipo_resposta: z.enum(['NUMERO', 'SIM_NAO', 'OPCAO_UNICA', 'ESCALA', 'TEXTO'], {
    message: 'Tipo de resposta inválido'
  }),
  ordem: z.number().int('Ordem deve ser um número inteiro').min(0, 'Ordem deve ser positiva'),
  config_opcoes: z.string().optional(),
  regra_pontuacao: z.string().min(1, 'Regra de pontuação é obrigatória'),
});

export const updateItemSchema = createItemSchema.partial();

// ===== TYPE EXPORTS =====
export type CreateUsuarioInput = z.infer<typeof createUsuarioSchema>;
export type UpdateUsuarioInput = z.infer<typeof updateUsuarioSchema>;
export type CreateTurmaInput = z.infer<typeof createTurmaSchema>;
export type UpdateTurmaInput = z.infer<typeof updateTurmaSchema>;
export type CreateAlunoInput = z.infer<typeof createAlunoSchema>;
export type UpdateAlunoInput = z.infer<typeof updateAlunoSchema>;
export type CreateDominioInput = z.infer<typeof createDominioSchema>;
export type UpdateDominioInput = z.infer<typeof updateDominioSchema>;
export type CreateTemplateInput = z.infer<typeof createTemplateSchema>;
export type UpdateTemplateInput = z.infer<typeof updateTemplateSchema>;
export type CreateItemInput = z.infer<typeof createItemSchema>;
export type UpdateItemInput = z.infer<typeof updateItemSchema>;
