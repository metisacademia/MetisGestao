export type Periodo = '1m' | '3m' | '6m' | '12m' | 'all';

/**
 * Calcula a data de início baseado no período selecionado
 * @param periodo - Período selecionado ('1m', '3m', '6m', '12m', 'all')
 * @returns Data de início ou null se 'all'
 */
export function calcularDataInicio(periodo: Periodo): Date | null {
  if (periodo === 'all') return null;

  const agora = new Date();
  const meses = periodo === '1m' ? 1 :
                periodo === '3m' ? 3 :
                periodo === '6m' ? 6 : 12;

  return new Date(agora.getFullYear(), agora.getMonth() - meses, 1);
}

/**
 * Formata o período em texto legível
 * @param periodo - Período selecionado
 * @returns Texto formatado (ex: "nos últimos 6 meses")
 */
export function formatarPeriodoTexto(periodo: Periodo): string {
  const map: Record<Periodo, string> = {
    '1m': 'no último mês',
    '3m': 'nos últimos 3 meses',
    '6m': 'nos últimos 6 meses',
    '12m': 'no último ano',
    'all': 'em todo o histórico'
  };
  return map[periodo];
}

/**
 * Constrói a cláusula WHERE do Prisma para filtrar por período
 * @param dataInicio - Data de início calculada
 * @returns Objeto para usar no where do Prisma
 */
export function buildPeriodoWhereClause(dataInicio: Date | null) {
  if (!dataInicio) return {};

  return {
    OR: [
      { ano_referencia: { gt: dataInicio.getFullYear() } },
      {
        ano_referencia: dataInicio.getFullYear(),
        mes_referencia: { gte: dataInicio.getMonth() + 1 }
      }
    ]
  };
}

/**
 * Retorna o número de meses do período
 * @param periodo - Período selecionado
 * @param totalMeses - Total de meses disponíveis (usado para 'all')
 * @returns Número de meses
 */
export function getPeriodoMeses(periodo: Periodo, totalMeses?: number): number {
  if (periodo === 'all') return totalMeses || 12;

  return periodo === '1m' ? 1 :
         periodo === '3m' ? 3 :
         periodo === '6m' ? 6 : 12;
}
