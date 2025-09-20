"use client";
import React from "react";
import { AnalysisResult } from "../types/analysis";
import Link from "next/link";

export default function Recoms({ analysis }: { analysis: AnalysisResult | null }) {
  if (!analysis) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No analysis available yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Face Shape Analysis */}
      <div className="bg-card border border-card-border rounded-2xl p-6 fade-in">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">🔍</span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Your Face Shape: <span className="text-accent">{analysis.face_shape}</span>
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {analysis.explanation_face_shape}
            </p>
          </div>
        </div>
      </div>

      {/* Recommended Glasses */}
      <div className="bg-card border border-card-border rounded-2xl p-6 fade-in">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">👓</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Recommended Glasses Styles
            </h3>
            <p className="text-muted-foreground text-sm">
              These styles will complement your face shape beautifully
            </p>
          </div>
        </div>

        <div className="grid gap-4">
          {analysis.recommended_styles.map((item, index) => (
            <div 
              key={index}
              className="bg-muted/30 rounded-xl p-4 border border-card-border hover:bg-muted/50 transition-colors duration-200"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <Link href={item.link} target="_blank">
                    <h4 className="font-medium text-foreground mb-2 flex items-center gap-2 hover:underline">
                      <span className="w-2 h-2 bg-accent rounded-full"></span>
                      {item.style}
                      <span className="text-xs">↗</span>
                    </h4>
                  </Link>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.reason}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Celebrity Matches */}
      <div className="bg-card border border-card-border rounded-2xl p-6 fade-in">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">⭐</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Celebrity Face Shape Matches
            </h3>
            <p className="text-muted-foreground text-sm">
              You share a similar face shape with these celebrities
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {analysis.celebrities.map((celeb, index) => (
            <span 
              key={index}
              className="inline-flex items-center gap-2 bg-muted/50 text-foreground px-3 py-2 rounded-lg text-sm font-medium border border-card-border"
            >
              <span className="text-xs">🌟</span>
              {celeb}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}