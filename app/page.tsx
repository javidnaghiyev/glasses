"use client";
import { useState, useEffect } from "react";
import ImageInput from "../components/image_input";
import Recoms from "../components/recoms";
import ThemeToggle from "../components/theme_toggle";
import { AnalysisResult } from "../types/analysis";

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch analysis from API
  const analyzeImage = async (base64: string) => {
    setImage(base64);
   
    setLoading(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: JSON.stringify({ image: base64 }),
        headers: { 'Content-Type': 'application/json' }
      });
     
      const data = await response.json();
      console.log(data);
      
      setAnalysis(JSON.parse(data));
    } catch (error) {
      console.error('Error analyzing image:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetAnalysis = () => {
    setImage(null);
    setAnalysis(null);
    setLoading(false);
  };
 
  return (
    <>
    <head>
      <link rel="icon" href="/favicon.ico" />
    </head>
    <div className="min-h-screen bg-background transition-colors duration-200">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              👓 Face & Frames
            </h1>
            <p className="text-muted-foreground text-lg">
              Find the perfect glasses for your face shape
            </p>
          </div>
          <ThemeToggle />
        </header>

        {/* Main Content */}
        <main className="space-y-8">
          <div className="fade-in">
            <ImageInput onImageSelected={analyzeImage} />
          </div>

          {loading && (
            <div className="text-center py-12 fade-in">
              <div className="inline-flex items-center gap-3 bg-card border border-card-border rounded-xl px-6 py-4">
                <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                <p className="text-foreground font-medium">Analyzing your face shape...</p>
              </div>
            </div>
          )}

          {!loading && analysis && (
            <div className="fade-in">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-foreground">Your Results</h2>
                <button
                  onClick={resetAnalysis}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground border border-card-border rounded-lg hover:bg-muted transition-colors duration-200"
                >
                  Try Another Photo
                </button>
              </div>
              <Recoms analysis={analysis} />
            </div>
          )}

          {!loading && !analysis && !image && (
            <div className="text-center py-16 fade-in">
              <div className="text-6xl mb-4">📸</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Ready to find your perfect frames?
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Upload a clear photo of your face and we&apos;ll analyze your face shape to recommend the best glasses styles for you.
              </p>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-card-border text-center">
          <p className="text-muted-foreground text-sm">
            AI-powered face analysis for better glasses recommendations
          </p>
        </footer>
      </div>
    </div>
    </>
  );
}