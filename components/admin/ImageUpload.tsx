"use client";

import { useState, useCallback } from "react";
import { Upload, X, Check, AlertCircle, Loader2 } from "lucide-react";
import { uploadMedia } from "@/services/media";
import { FrameSelector } from "@/components/admin/FrameSelector";
import { formatFileSize, isValidImageType, MAX_FILE_SIZE } from "@/lib/utils";
import type { FrameTemplate } from "@/types";

// ─── Face Detection ──────────────────────────────────────────────────────────
// Usa a FaceDetector API nativa do Chrome (quando disponível)
// Fallback: "center 20%" para retratos (melhor que center center para rostos)
async function detectFacePosition(file: File): Promise<string> {
  try {
    // Checa se FaceDetector está disponível (Chrome 74+)
    if (!("FaceDetector" in window)) {
      // Fallback inteligente: imagens em portrait usam center 20% (área do rosto)
      const img = new window.Image();
      const url = URL.createObjectURL(file);
      await new Promise<void>((res) => { img.onload = () => res(); img.src = url; });
      URL.revokeObjectURL(url);
      return img.naturalHeight > img.naturalWidth ? "center 20%" : "center center";
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const detector = new (window as any).FaceDetector({ fastMode: true });
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    await new Promise<void>((res) => { img.onload = () => res(); img.src = url; });

    const faces = await detector.detect(img);
    URL.revokeObjectURL(url);

    if (!faces || faces.length === 0) return "center center";

    // Usa o rosto de maior área
    const face = faces.reduce((a: any, b: any) =>
      (a.boundingBox.width * a.boundingBox.height) > (b.boundingBox.width * b.boundingBox.height) ? a : b
    );

    const xPct = Math.round(((face.boundingBox.x + face.boundingBox.width  / 2) / img.naturalWidth)  * 100);
    const yPct = Math.round(((face.boundingBox.y + face.boundingBox.height / 2) / img.naturalHeight) * 100);

    return `${xPct}% ${yPct}%`;
  } catch {
    return "center center";
  }
}

interface ImageUploadProps {
  campaignId: string;
  onSuccess: () => void;
}

interface FileStatus {
  file: File;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
  preview: string;
}

export function ImageUpload({ campaignId, onSuccess }: ImageUploadProps) {
  const [files, setFiles] = useState<FileStatus[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFrame, setSelectedFrame] = useState<FrameTemplate>("none");

  function addFiles(newFiles: File[]) {
    const valid = newFiles
      .filter((f) => isValidImageType(f.type) && f.size <= MAX_FILE_SIZE)
      .map((file) => ({ file, status: "pending" as const, preview: URL.createObjectURL(file) }));

    const skipped = newFiles.length - valid.length;
    if (skipped > 0) alert(`${skipped} arquivo(s) ignorado(s). Use JPG, PNG ou WEBP até 20MB.`);
    setFiles((prev) => [...prev, ...valid]);
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(Array.from(e.dataTransfer.files));
  }, []);

  function removeFile(i: number) {
    setFiles((prev) => { URL.revokeObjectURL(prev[i].preview); return prev.filter((_, idx) => idx !== i); });
  }

  async function uploadAll() {
    for (let i = 0; i < files.length; i++) {
      if (files[i].status !== "pending") continue;
      setFiles((prev) => prev.map((f, idx) => idx === i ? { ...f, status: "uploading" } : f));
      const objectPosition = await detectFacePosition(files[i].file);
      const result = await uploadMedia(files[i].file, campaignId, selectedFrame, objectPosition);
      setFiles((prev) => prev.map((f, idx) => idx === i ? { ...f, status: result.success ? "success" : "error", error: result.error } : f));
    }
    onSuccess();
    setTimeout(() => setFiles((prev) => prev.filter((f) => f.status !== "success")), 2000);
  }

  // Pega a primeira preview disponível para o seletor de frame
  const firstPreview = files[0]?.preview;
  const hasPending = files.some((f) => f.status === "pending");
  const isUploading = files.some((f) => f.status === "uploading");

  return (
    <div className="space-y-5">
      {/* Dropzone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className="border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200"
        style={{
          borderColor: isDragging ? "#0dff51" : "#014b3d40",
          background: isDragging ? "rgba(13,255,81,0.08)" : "rgba(1,75,61,0.03)",
        }}
        onClick={() => document.getElementById("file-input")?.click()}
      >
        <input id="file-input" type="file" className="hidden" accept="image/jpeg,image/jpg,image/png,image/webp" multiple onChange={(e) => { if (e.target.files) addFiles(Array.from(e.target.files)); e.target.value = ""; }} />
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center justify-center rounded-2xl" style={{ width: 56, height: 56, background: "#0dff5120" }}>
            <Upload size={26} style={{ color: "#014b3d" }} />
          </div>
          <div>
            <p className="font-sora font-semibold text-sm" style={{ color: "#014b3d" }}>Arraste imagens ou clique para selecionar</p>
            <p className="font-sora text-xs mt-1" style={{ color: "#014b3d", opacity: 0.5 }}>JPG, PNG, WEBP · Máximo 20MB por arquivo</p>
          </div>
        </div>
      </div>

      {/* Seletor de frame — aparece assim que tem arquivos */}
      {files.length > 0 && (
        <>
          <FrameSelector
            selected={selectedFrame}
            onChange={setSelectedFrame}
            previewUrl={firstPreview}
          />

          {/* Fila de arquivos */}
          <div className="space-y-2">
            {files.map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl border"
                style={{ borderColor: f.status === "success" ? "#0dff51" : f.status === "error" ? "#ef444440" : "#014b3d20", background: "white" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={f.preview} alt="" className="rounded-lg object-cover shrink-0" style={{ width: 48, height: 48 }} />
                <div className="flex-1 min-w-0">
                  <p className="font-sora font-semibold text-sm truncate" style={{ color: "#014b3d" }}>{f.file.name}</p>
                  <p className="font-sora text-xs" style={{ color: "#014b3d", opacity: 0.5 }}>{formatFileSize(f.file.size)}</p>
                  {f.error && <p className="font-sora text-xs text-red-500">{f.error}</p>}
                </div>
                <div className="shrink-0">
                  {f.status === "uploading" && <Loader2 size={18} className="animate-spin" style={{ color: "#014b3d" }} />}
                  {f.status === "success"   && <Check size={18} style={{ color: "#0dff51" }} />}
                  {f.status === "error"     && <AlertCircle size={18} className="text-red-500" />}
                  {f.status === "pending"   && <button onClick={(e) => { e.stopPropagation(); removeFile(i); }}><X size={18} style={{ color: "#014b3d", opacity: 0.4 }} /></button>}
                </div>
              </div>
            ))}

            {hasPending && (
              <button
                onClick={uploadAll}
                disabled={isUploading}
                className="w-full py-3 rounded-xl font-sora font-bold text-sm transition-all disabled:opacity-50"
                style={{ background: "#0dff51", color: "#014b3d" }}
              >
                {isUploading ? "Enviando..." : `Enviar ${files.filter((f) => f.status === "pending").length} arquivo(s) com moldura "${selectedFrame}"`}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
