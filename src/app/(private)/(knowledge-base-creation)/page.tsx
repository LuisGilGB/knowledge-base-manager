import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'TestackAI - Create your Knowledge Base',
  description: 'Integrate with external providers to create knowledge bases for your AI workflows.',
};

const KnowledgeBaseCreationPage = () => {
  return (
    <div className="flex flex-col items-center gap-y-4 h-full max-w-md mx-auto text-center text-pretty">
      <h2 className="text-2xl font-bold">Welcome to TestackAI</h2>
      <p>Select a connection to start creating a new knowledge base</p>
    </div>
  );
};

export default KnowledgeBaseCreationPage;
