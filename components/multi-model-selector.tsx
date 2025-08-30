'use client';

import { startTransition, useMemo, useOptimistic, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { CheckCircleFillIcon, ChevronDownIcon } from './icons';
import { toast } from 'sonner';
import type { ChatModel } from '@/lib/ai/models';

const MAX_SELECTIONS = 3;

export function MultiModelSelector({
  selectedModelIds,
  onSelectionChange,
  availableChatModels,
  maxSelections = MAX_SELECTIONS,
  className,
}: {
  selectedModelIds: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  availableChatModels: ChatModel[];
  maxSelections?: number;
} & Omit<React.ComponentProps<typeof Button>, 'onSelect'>) {
  const [open, setOpen] = useState(false);

  // Optimistic state for instant UI feedback
  const [optimisticModelIds, setOptimisticModelIds] =
    useOptimistic(selectedModelIds);

  const handleSelect = (id: string) => {
    const isSelected = optimisticModelIds.includes(id);
    let newSelectedIds: string[];

    if (isSelected) {
      // Deselect the model
      newSelectedIds = optimisticModelIds.filter((modelId) => modelId !== id);
    } else {
      // Select the model, checking the limit
      if (optimisticModelIds.length >= maxSelections) {
        toast.error(`You can select a maximum of ${maxSelections} models.`);
        return; // Don't close the dropdown
      }
      newSelectedIds = [...optimisticModelIds, id];
    }

    startTransition(() => {
      setOptimisticModelIds(newSelectedIds);
      onSelectionChange(newSelectedIds);
    });
  };

  const triggerText = useMemo(() => {
    const count = optimisticModelIds.length;
    if (count === 0) return 'Select Models';
    if (count === 1) return '1 Model Selected';
    return `${count} Models Selected`;
  }, [optimisticModelIds.length]);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        asChild
        className={cn(
          'w-fit data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
          className,
        )}
      >
        <Button
          data-testid="multi-model-selector"
          variant="outline"
          className="md:px-2 md:h-[34px]"
        >
          {triggerText}
          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[300px]">
        {availableChatModels.map((chatModel) => {
          const { id } = chatModel;
          const isSelected = optimisticModelIds.includes(id);

          return (
            <DropdownMenuItem
              key={id}
              data-testid={`model-selector-item-${id}`}
              onSelect={(e) => {
                e.preventDefault(); // Keep menu open after selection
                handleSelect(id);
              }}
              data-active={isSelected}
              className="gap-4 group/item flex flex-row justify-between items-center w-full"
            >
              <div className="flex flex-col gap-1 items-start">
                <div>{chatModel.name}</div>
                <div className="text-xs text-muted-foreground">
                  {chatModel.description}
                </div>
              </div>

              <div
                className={cn('text-foreground opacity-0', {
                  'opacity-100': isSelected,
                })}
              >
                <CheckCircleFillIcon />
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
