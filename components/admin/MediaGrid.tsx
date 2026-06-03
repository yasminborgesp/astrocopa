"use client";

import { useState } from "react";
import Image from "next/image";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2, GripVertical, Eye, EyeOff, Loader2 } from "lucide-react";
import { deleteMedia, toggleMediaActive, reorderMedia } from "@/services/media";
import type { Media } from "@/types";

interface MediaGridProps {
  media: Media[];
  onUpdate: () => void;
}

interface SortableItemProps {
  item: Media;
  onDelete: (id: string, path: string) => void;
  onToggle: (id: string, active: boolean) => void;
  loading: boolean;
}

function SortableItem({ item, onDelete, onToggle, loading }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group rounded-2xl overflow-hidden border"
      {...attributes}
    >
      <div
        className="relative"
        style={{
          aspectRatio: "16/9",
          background: "#f0f0f0",
          borderColor: item.active ? "#0dff51" : "#014b3d20",
          border: `2px solid ${item.active ? "#0dff51" : "#014b3d20"}`,
          borderRadius: "1rem",
        }}
      >
        <Image
          src={item.image_url}
          alt="Mídia"
          fill
          className="object-cover rounded-xl"
          sizes="(max-width: 768px) 100vw, 33vw"
        />

        {/* Overlay ativo */}
        {!item.active && (
          <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
            <span className="text-white font-sora font-bold text-xs uppercase tracking-widest">
              Inativa
            </span>
          </div>
        )}

        {/* Drag handle */}
        <div
          {...listeners}
          className="absolute top-2 left-2 cursor-grab active:cursor-grabbing p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: "rgba(1,75,61,0.8)" }}
        >
          <GripVertical size={16} color="white" />
        </div>

        {/* Ações */}
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onToggle(item.id, !item.active)}
            disabled={loading}
            className="p-1.5 rounded-lg"
            style={{ background: "rgba(1,75,61,0.8)" }}
            title={item.active ? "Desativar" : "Ativar"}
          >
            {item.active
              ? <Eye size={16} color="white" />
              : <EyeOff size={16} color="white" />
            }
          </button>
          <button
            onClick={() => onDelete(item.id, item.storage_path)}
            disabled={loading}
            className="p-1.5 rounded-lg"
            style={{ background: "rgba(239,68,68,0.85)" }}
            title="Excluir"
          >
            {loading
              ? <Loader2 size={16} color="white" className="animate-spin" />
              : <Trash2 size={16} color="white" />
            }
          </button>
        </div>

        {/* Número de ordem */}
        <div
          className="absolute bottom-2 left-2 px-2 py-0.5 rounded-lg"
          style={{ background: "rgba(1,75,61,0.8)" }}
        >
          <span className="font-sora font-bold text-xs text-white">
            #{item.display_order + 1}
          </span>
        </div>
      </div>
    </div>
  );
}

export function MediaGrid({ media, onUpdate }: MediaGridProps) {
  const [items, setItems] = useState<Media[]>(media);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Sincroniza quando prop mudar (ex: realtime)
  if (JSON.stringify(items.map((i) => i.id)) !== JSON.stringify(media.map((i) => i.id))) {
    setItems(media);
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    const newOrder = arrayMove(items, oldIndex, newIndex);

    const reordered = newOrder.map((item, idx) => ({ ...item, display_order: idx }));
    setItems(reordered);

    await reorderMedia(reordered.map((i) => ({ id: i.id, display_order: i.display_order })));
    onUpdate();
  }

  async function handleDelete(id: string, path: string) {
    if (!confirm("Excluir esta imagem?")) return;
    setLoadingId(id);
    await deleteMedia(id, path);
    setLoadingId(null);
    onUpdate();
  }

  async function handleToggle(id: string, active: boolean) {
    setLoadingId(id);
    await toggleMediaActive(id, active);
    setLoadingId(null);
    onUpdate();
  }

  if (items.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-20 rounded-2xl border-2 border-dashed"
        style={{ borderColor: "#014b3d20" }}
      >
        <p className="font-sora font-semibold text-sm" style={{ color: "#014b3d", opacity: 0.5 }}>
          Nenhuma imagem. Faça upload acima.
        </p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items.map((i) => i.id)} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <SortableItem
              key={item.id}
              item={item}
              onDelete={handleDelete}
              onToggle={handleToggle}
              loading={loadingId === item.id}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
