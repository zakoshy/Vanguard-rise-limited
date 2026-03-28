
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Upload, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  onUploadSuccess: (url: string) => void;
  defaultValue?: string;
}

export function ImageUpload({ onUploadSuccess, defaultValue }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(defaultValue || null);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local preview
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);

    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '');

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();
      if (data.secure_url) {
        onUploadSuccess(data.secure_url);
        toast({
          title: "Upload Successful",
          description: "Image has been uploaded to Cloudinary.",
        });
      } else {
        throw new Error(data.error?.message || 'Upload failed');
      }
    } catch (error: any) {
      console.error('Cloudinary Upload Error:', error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: error.message || "Could not upload image to Cloudinary.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Label>Image Upload (Cloudinary)</Label>
      <div className="flex flex-col items-center gap-4 p-4 border-2 border-dashed rounded-lg border-muted-foreground/25 bg-secondary/10">
        {preview ? (
          <div className="relative w-full aspect-video rounded-md overflow-hidden bg-muted">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center text-muted-foreground">
            <Upload className="h-10 w-10 mb-2 opacity-20" />
            <p className="text-sm">Click below to upload a file</p>
          </div>
        )}
        
        <Input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          disabled={isUploading}
          className="cursor-pointer"
        />
        
        {!isUploading && preview && (
           <p className="text-xs text-green-600 flex items-center gap-1">
             <CheckCircle2 className="h-3 w-3" /> Ready to save
           </p>
        )}
      </div>
    </div>
  );
}
