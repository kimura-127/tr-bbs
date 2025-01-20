'use client';

import { Button } from '@/components/ui/button';
import { ImagePlus, X } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface ImageUploadProps {
  onChange: (files: File[]) => void;
  value: string[];
  disabled?: boolean;
  reset?: boolean;
}

export function ImageUpload({
  onChange,
  value,
  disabled,
  reset,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string[]>(value || []);

  // resetがtrueの時にプレビューをリセット
  useEffect(() => {
    if (reset) {
      setPreview([]);
    }
  }, [reset]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // プレビューURLを作成
      const urls = acceptedFiles.map((file) => URL.createObjectURL(file));
      setPreview((prev) => [...prev, ...urls]);
      onChange(acceptedFiles);
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    maxFiles: 4,
    disabled,
  });

  const removeImage = (index: number) => {
    const newPreview = [...preview];
    newPreview.splice(index, 1);
    setPreview(newPreview);
    // NOTE: 親コンポーネントの状態も更新
    onChange([]);
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
          transition-colors
          ${isDragActive ? 'border-primary' : 'border-gray-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-2">
          <ImagePlus className="h-8 w-8 text-gray-500" />
          <p className="text-sm text-gray-500">
            ドラッグ＆ドロップ、またはクリックして画像をアップロード
          </p>
          <p className="text-xs text-gray-400">
            JPG, PNG形式 / 1枚5MB以内 / 最大4枚まで
          </p>
        </div>
      </div>

      {preview.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {preview.map((url, index) => (
            <div key={url} className="relative group">
              <div className="aspect-square relative">
                <Image
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="object-cover rounded-lg"
                  fill
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6 hidden group-hover:flex"
                onClick={() => removeImage(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
