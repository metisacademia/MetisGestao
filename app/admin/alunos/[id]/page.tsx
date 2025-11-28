import { notFound } from 'next/navigation';
import AlunoDetalheContent from './detail-content';
import { getAlunoDetalhes } from '@/lib/aluno-details';

export default async function AlunoDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const detalhes = await getAlunoDetalhes(id);

  if (!detalhes) {
    notFound();
  }

  return <AlunoDetalheContent detalhes={detalhes} />;
}
