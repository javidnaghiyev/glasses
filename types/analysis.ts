export interface AnalysisResult {
  celebrities: string[];
  explanation_face_shape: string;
  face_shape: string;
  recommended_styles: {
    link: string;
    reason: string;
    style: string;
  }[];
}
