'use client';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSelection } from "@/contexts/SelectionContext";
import { useKnowledgeBaseOperations } from "@/lib/api/hooks";
import { Resource } from "@/lib/api/types";
import { useState } from "react";
import { toast } from "sonner";

interface CreateKnowledgeBaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  connectionId: string;
  selectedResources: Resource[];
}

const CreateKnowledgeBaseModal = ({
  isOpen,
  onClose,
  connectionId,
  selectedResources,
}: CreateKnowledgeBaseModalProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const { createKnowledgeBase, syncKnowledgeBase } = useKnowledgeBaseOperations();
  const { clearSelection } = useSelection();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      toast("Error", {
        description: "Please enter a name for the knowledge base",
      });
      return;
    }

    try {
      setIsCreating(true);

      // Extract resource IDs from selected resources
      const resourceIds = selectedResources.map(resource => resource.resource_id);

      // Create the knowledge base
      const knowledgeBase = await createKnowledgeBase(
        connectionId,
        resourceIds,
        name,
        description
      );

      if (knowledgeBase) {
        // Trigger sync to start indexing
        await syncKnowledgeBase(knowledgeBase.knowledge_base_id);

        toast("Success", {
          description: "Knowledge base created successfully",
        });

        // Reset form and close modal
        setName("");
        setDescription("");
        clearSelection();
        onClose();
      }
    } catch (error) {
      console.error("Failed to create knowledge base:", error);
      toast("Error", {
        description: "Failed to create knowledge base. Please try again.",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Knowledge Base</DialogTitle>
            <DialogDescription>
              Create a new knowledge base with {selectedResources.length} selected resources.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter knowledge base name"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                required
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isCreating}
            >
              {isCreating ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateKnowledgeBaseModal;
