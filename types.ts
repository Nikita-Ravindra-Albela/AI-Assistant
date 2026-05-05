export type UserRole = 'admin' | 'analyst' | 'viewer';
export type AppMode = 'dark' | 'light';

export interface TableSchema {
  tableName: string;
  rowCount: number;
  columns: Column[];
}

export type ColumnRole = 'identifier' | 'metric_additive' | 'metric_ratio' | 'dimension' | 'time' | 'unknown';

export interface Column {
  name: string;
  type: string;
  role?: ColumnRole; // New: Semantic Role
}

export interface QueryResult {
  columns: string[];
  rows: any[];
  executionTimeMs?: number;
  error?: string;
}

export interface LineageEvent {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  description: string;
  versionId: string;
  codeSnapshot?: string;
}

export interface OutlierResult {
  column: string;
  method: string;
  count: number;
  boundary: { min: number; max: number };
  rows: any[];
}

export interface ConnectionConfig {
  type: string;
  name?: string;
  [key: string]: any;
}

export interface DataProfile {
  column: string;
  type: string;
  count: number;
  missing: number;
  missing_pct: number;
  unique: number;
  min?: number | string;
  max?: number | string;
  mean?: number;
  std_dev?: number;
  skewness?: number;
  samples: any[];
  issues: string[]; 
}

export type IssueCategory = 'Schema Issue' | 'Missing Data' | 'Duplicate Data' | 'Value Quality' | 'Categorical Issue' | 'Temporal Issue' | 'Analytical Issue' | 'Business Logic' | 'Mixed Formatting' | 'Invalid Data' | 'Inconsistent Data' | 'Format Errors' | 'Referential Issues' | 'Logical Violations';

export type IssueSeverity = 'low' | 'medium' | 'high';
export type Fixability = 'auto' | 'review' | 'manual';

export interface QualityIssue {
  id: string;
  column: string;
  category: IssueCategory;
  subcategory?: string; // e.g. "Column Type Mismatch"
  severity: IssueSeverity;
  description: string;
  affected_rows: number;
  affected_pct: number;
  confidence?: number; // 0-1
  fixability?: Fixability;
  risk?: string;
  suggested_actions: CleaningAction[];
  evidence_data?: any[]; // For tabular view
  evidence_columns?: { key: string; label: string; width?: string }[];
}

export interface CleaningAction {
  id: string;
  label: string;
  type: 'impute' | 'drop' | 'cast' | 'standardize' | 'custom';
  params?: any;
  impact_description: string;
}

export interface CleaningCell {
  id: string;
  type: 'cleaning';
  issue?: QualityIssue;
  action?: CleaningAction;
  status: 'draft' | 'planning' | 'executing' | 'done' | 'reverted' | 'error';
  logic_applied?: string;
  affected_rows?: number;
  preview_before?: any[];
  preview_after?: any[];
  timestamp: string;
}

export interface DataQualityScorecard {
  completeness: number;
  validity: number;
  consistency: number;
  uniqueness: number;
}

export interface DataSnapshot {
  id: string;
  version: string;
  timestamp: string;
  derived_from?: string;
  rows: any[];
  schema: Column[];
  scorecard: DataQualityScorecard;
  changes: string[]; 
}

export interface LLMResponse {
  issues: QualityIssue[];
  normalization: NormalizationPlan;
  generatedCode?: string; 
}

export interface NormalizationPlan {
    originalTable: string;
    newTables: any[];
    migrationSql: string;
}

export type ValidationSeverity = 'info' | 'warning' | 'error';
export type ValidationLayer = 'structural' | 'statistical' | 'logical' | 'analytical';

export interface ValidationRule {
  id: string;
  name: string;
  layer: ValidationLayer;
  severity: ValidationSeverity;
  expression: string;
  description: string;
  active: boolean;
}

export interface ValidationResult {
  ruleId: string;
  status: 'pass' | 'fail' | 'warning';
  violationCount: number;
  violationPct: number;
  sampleViolations: any[];
}

export interface ValidationOverride {
  ruleId: string;
  reason: string;
  timestamp: string;
  user: string;
}

export interface ValidationRun {
  id: string;
  timestamp: string;
  tableName: string;
  layerResults: Record<ValidationLayer, ValidationResult[]>;
  score: {
      passRate: number;
      criticalFailures: number;
      warnings: number;
  };
}

export interface ProposedPlan {
  intent: string;
  rationale: string;
  proposed_steps: ExecutionOperation[];
  assumptions: string[];
  risks: string[];
}

export interface TraeRecord {
  session_id: string;
  cell_id: string;
  timestamp: string;
  user_prompt: string;
  ai_rationale: string;
  proposed_steps: ExecutionOperation[];
  user_edits?: any[];
  approved_by_user: boolean;
  executed_queries: string[];
  validation_results: any;
  outputs_generated: string[];
}

export type EDAScope = 'univariate' | 'bivariate' | 'multivariate';
export type EDAIntent = 'distribution' | 'magnitude' | 'comparison' | 'trend' | 'relationship' | 'outliers' | 'summary';

export interface EdaConfig {
  analysis_type: 'univariate' | 'bivariate' | 'correlation' | 'distribution' | 'grouped' | 'outlier' | 'time_series';
  columns: string[];
  params?: Record<string, any>;
  chart_type?: string;
  observations?: string[];
  explanation?: { // New: Explanation Block
      xAxis: string;
      yAxis: string;
      aggregation: string;
      rationale: string;
      confidence: 'High' | 'Medium' | 'Low';
  };
}

export interface ChartProposal {
  scope?: EDAScope;
  intent?: EDAIntent;
  chartType: 'bar' | 'line' | 'scatter' | 'box' | 'heatmap' | 'histogram' | 'density' | 'kpi' | 'table';
  xAxis: {
    column: string | null;
    role: ColumnRole | 'none';
  };
  yAxis: {
    column: string | null;
    role: ColumnRole | 'frequency' | 'value' | 'none';
    aggregation: 'sum' | 'mean' | 'count' | 'distinct' | 'none' | 'min' | 'max' | 'median';
  };
  rationale: string;
  confidence: 'low' | 'medium' | 'high';
  requiresConfirmation: true;
}

export interface AIUnderstanding {
  domainGuess: string;
  rows: number;
  columns: number;
  keyIdentifiers: string[];
  timeFields: string[];
  targetVariable: string;
  concerns: string[];
  confidence: 'Low' | 'Medium' | 'High';
  userConfirmed: boolean;
}

export interface LineageEntry {
  id: string;
  timestamp: string;
  type: 'ai_action' | 'user_correction' | 'system_update';
  description: string;
  rationale?: string;
  changes?: string[];
  assumptions?: string[];
  userApproved?: boolean;
  correctionNote?: string;
}

export interface NotebookCell {
  id: string;
  type: 'ingest' | 'clean' | 'eda' | 'validation' | 'sql' | 'export' | 'profiling' | 'quality_check' | 'cleaning_plan' | 'cleaning_step' | 'eda_context' | 'eda_menu' | 'eda_univariate' | 'eda_bivariate' | 'eda_correlation' | 'eda_distribution' | 'eda_grouped' | 'eda_outlier';
  input?: string; 
  plan?: ProposedPlan;
  status: 'draft' | 'suggested' | 'approved' | 'executing' | 'done' | 'error' | 'stale';
  dependencies?: string[]; // IDs of cells this depends on
  output?: any;
  timestamp: string;
  eda_config?: EdaConfig;
  chartProposal?: ChartProposal; // New: Chart Proposal
  aiUnderstanding?: AIUnderstanding; // New: AI's interpretation
  lineageId?: string; // New: Link to lineage log
}

export interface ProfilingOutput {
    total_rows: number;
    total_columns: number;
    columns: DataProfile[];
}

export interface QualitySummaryOutput {
    issues: QualityIssue[];
}

export interface CleaningPlanOutput {
    proposed_actions: CleaningAction[];
}

export interface SemanticLayer {
  metrics: Record<string, string>; // name -> definition
  dimensions: Record<string, string[]>; // name -> values
  synonyms: Record<string, string[]>; // term -> [synonyms]
}

export interface DatasetVersion {
  version: string;
  derived_from: string | null;
  changes: string[];
  dataset: Dataset;
}

export interface ExecutionOperation {
  step_id: number;
  type: string;
  description: string;
  params?: any;
  name?: string;
  code?: string;
}

export interface Dataset {
  name: string;
  rows: any[];
  columns: Column[];
  rowCount: number;
}
