"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import Image from "next/image";

interface MultiImageUploadProps {
  onFilesChange: (files: File[]) => void;
}

export function MultiImageUpload({ onFilesChange }: MultiImageUploadProps) {
  const [previews, setPreviews] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setPreviews(files.map((file) => URL.createObjectURL(file)));
    onFilesChange(files);
  };

  return (
    <div className="space-y-3">
      <Input type="file" accept="image/*" multiple onChange={handleChange} />

      {/* Preview */}
      <div className="grid grid-cols-3 gap-3">
        {previews.map((src, index) => (
          <Image
            key={index}
            src={src}
            alt={`preview-${index}`}
            className="h-24 w-full object-cover rounded-md border"
            width={96}
            height={96}
          />
        ))}
      </div>
    </div>
  );
}
