export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export interface LevelDefinition {
  label: string;
  count: number;
}

export type LevelDefinitionsMap = Record<ContributionLevel, LevelDefinition>;

export interface ThemeOption {
  id: string;
  name: string;
  levels: [string, string, string, string, string];
  borderLevels: [string, string, string, string, string];
}

export interface Tracker {
  id: string;
  title: string;
  unitName: string;
  colorTheme: string;
  levelDefs: LevelDefinitionsMap;
  contributions: Record<string, ContributionLevel>;
}

export interface HeatmapGridProps {
  tracker: Tracker;
  onUpdateTracker: (updated: Tracker) => void;
  onDeleteTracker?: (id: string) => void;
  year?: number;
}

export interface HoveredCellInfo {
  dateStr: string;
  formattedDate: string;
  level: ContributionLevel;
  definition: LevelDefinition;
  x: number;
  y: number;
}
