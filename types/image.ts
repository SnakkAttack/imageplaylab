export type ModuleId =
  | "basics"
  | "noise"
  | "filtering"
  | "edges"
  | "threshold"
  | "histogram"
  | "morphology"
  | "metrics";

export interface ImageState {
  original: ImageData | null;
  processed: ImageData | null;
  width: number;
  height: number;
  fileName: string;
  fileSize: number;
  fileType: string;
}

export interface SliderParam {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit?: string;
  description: string;
}

export interface SelectParam {
  key: string;
  label: string;
  options: { value: string; label: string }[];
  defaultValue: string;
  description: string;
}

export type ParamDef = SliderParam | SelectParam;

export interface OperationDef {
  id: string;
  label: string;
  params: ParamDef[];
}

export interface ModuleDef {
  id: ModuleId;
  label: string;
  icon: string;
  shortDescription: string;
  operations: OperationDef[];
  explanation: ModuleExplanation;
}

export interface ModuleExplanation {
  title: string;
  plainEnglish: string;
  technical: string;
  parameters: string;
  lookFor: string;
  useCases: string;
}

export type OperationParams = Record<string, number | string>;

export interface ActiveOperation {
  moduleId: ModuleId;
  operationId: string;
  params: OperationParams;
}

export interface ImageMetrics {
  mse: number;
  psnr: number;
  ssim?: number;
}

export interface HistogramData {
  red: number[];
  green: number[];
  blue: number[];
  luminance: number[];
}
