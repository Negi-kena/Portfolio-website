import { useRef, useState } from "react";
import { FileText, UploadCloud, X } from "lucide-react";
import { uploadFile } from "../../api/endpoints";
import { resolveAssetUrl } from "../../api/client";

export function ImageUploadField({
  value,
  onChange,
  label = "image",
  accept = "image/jpeg,image/png,image/webp,image/avif,image/gif",
}: {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  accept?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (file: File) => {
    setUploading(true);
    setError("");
    try {
      const res = await uploadFile(file);
      onChange(res.url);
    } catch {
      setError("Upload failed. Try a smaller image or a different file type.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="mb-1 block font-mono text-xs text-paper-faint">{label}</label>
      {value ? (
        <div className="relative w-fit">
          {accept === "application/pdf" ? (
            <a
              href={resolveAssetUrl(value)}
              target="_blank"
              rel="noreferrer"
              className="flex h-32 w-56 items-center justify-center gap-2 rounded-md border border-navy-600 bg-navy-800 px-4 text-sm text-sea-400 hover:border-sea-400"
            >
              <FileText size={20} /> Open resume PDF
            </a>
          ) : (
            <img src={resolveAssetUrl(value)} alt="Uploaded asset preview" className="h-32 rounded-md border border-navy-600 object-cover" />
          )}
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label={`Remove uploaded ${label}`}
            className="absolute -right-2 -top-2 rounded-full bg-navy-950 p-1 text-paper-dim hover:text-red-400 focus-visible:outline-2 focus-visible:outline-sea-400"
          >
            <X size={14} aria-hidden="true" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex h-32 w-full max-w-xs items-center justify-center gap-2 rounded-md border border-dashed border-navy-600 text-sm text-paper-faint hover:border-sea-400 hover:text-paper"
        >
          <UploadCloud size={16} /> {uploading ? "Uploading…" : "Click to upload"}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
