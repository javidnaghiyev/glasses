"use client";
import { useState, useRef, useEffect } from "react";

interface ImageInputProps {
  onImageSelected: (base64: string) => void;
}

export default function ImageInput({ onImageSelected }: ImageInputProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return;

    setImageUrl(URL.createObjectURL(file));

    const base64 = await convertToBase64(file);
    const cleanedBase64 = base64.split(",")[1];
    onImageSelected(cleanedBase64);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await handleFile(file);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      await handleFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const openCameraDialog = async () => {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
      cameraInputRef.current?.click();
    } else {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(mediaStream);
        setIsCameraOpen(true);
      } catch (err) {
        console.error("Camera access denied:", err);
        alert("Unable to access camera");
      }
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const base64 = canvas.toDataURL("image/jpeg");
    setImageUrl(base64);
    const cleanedBase64 = base64.split(",")[1];
    onImageSelected(cleanedBase64);

    stopCamera();
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  };

  // ✅ Attach video stream manually (TypeScript safe)
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Cleanup camera on unmount
  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="w-full">
      <div
        className={`
          relative bg-card border-2 border-dashed rounded-2xl transition-all duration-200 overflow-hidden
          ${isDragging ? "border-accent bg-accent/5 scale-[1.02]" : "border-card-border hover:border-accent/50"}
          ${imageUrl ? "p-4 min-h-[400px]" : "p-12 min-h-[300px]"}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="flex flex-col items-center justify-center gap-6 h-full">
          {/* Camera View */}
          {isCameraOpen ? (
            <div className="flex flex-col items-center gap-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="rounded-xl shadow-lg max-h-80"
              />
              <div className="flex gap-3">
                <button
                  onClick={capturePhoto}
                  className="bg-success hover:bg-success text-white px-6 py-3 rounded-xl font-medium transition-all hover:scale-105"
                >
                  Capture
                </button>
                <button
                  onClick={stopCamera}
                  className="bg-muted text-foreground px-6 py-3 rounded-xl font-medium transition-all hover:scale-105"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : imageUrl ? (
            <div className="relative w-full max-w-md">
              <img
                src={imageUrl}
                alt="Uploaded preview"
                className="w-full h-auto rounded-xl shadow-lg object-cover max-h-80"
              />
              <div className="absolute -top-2 -right-2">
                <button
                  onClick={() => {
                    setImageUrl(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="w-8 h-8 bg-card border border-card-border rounded-full flex items-center justify-center shadow-lg hover:bg-muted transition-colors duration-200"
                >
                  <span className="text-foreground text-sm">×</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-6xl mb-4 text-muted-foreground">
                {isDragging ? "📎" : "🖼️"}
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {isDragging ? "Drop your photo here" : "Upload your photo"}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-sm">
                Choose a clear, well-lit photo where your face is fully visible for the best results
              </p>
            </div>
          )}

          {!isCameraOpen && (
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={openFileDialog}
                className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-medium px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105"
              >
                <span className="text-lg">📁</span>
                {imageUrl ? "Choose from Files" : "Browse Files"}
              </button>
              <button
                onClick={openCameraDialog}
                className="inline-flex items-center gap-2 bg-success hover:bg-success text-white font-medium px-6 py-3 rounded-xl transition-all duration-200 hover:scale-105"
              >
                <span className="text-lg">📷</span>
                {imageUrl ? "Take New Photo" : "Take Photo"}
              </button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="user"
            className="hidden"
            onChange={handleFileChange}
          />

          {!imageUrl && !isCameraOpen && (
            <p className="text-xs text-muted-foreground mt-2">
              Supported formats: JPG, PNG, WebP • Max size: 10MB
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
