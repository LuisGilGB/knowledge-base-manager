import { Metadata } from "next";
import KnowledgeBaseResourcesExplorer from "@/components/KnowledgeBaseResourcesExplorer";

export const metadata: Metadata = {
  title: 'TestackAI - Knowledge Base',
  description: 'Explore your knowledge base and manage its resources.',
};

const KnowledgeBasePage = async ({
  params,
}: {
  params: Promise<{ knowledgeBaseId: string }>
}) => {
  const { knowledgeBaseId } = await params;
  return (
    <main className="h-full flex flex-col gap-4 p-4 overflow-hidden">
      <h2 className="text-2xl font-bold">Knowledge Base Explorer</h2>
      <KnowledgeBaseResourcesExplorer knowledgeBaseId={knowledgeBaseId} className="flex-1 overflow-hidden" />
    </main>
  )
}

export default KnowledgeBasePage;
