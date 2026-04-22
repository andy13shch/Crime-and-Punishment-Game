export type LocationId = 'room' | 'pawnshop' | 'tavern' | 'square' | 'sonia_room' | 'police_station' | 'luzhin_hotel' | 'svidrigailov_den' | 'bridge';

export interface Character {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  color: string;
}

export interface Ending {
  title: string;
  description: string;
  image: string;
  isGood: boolean;
}

export interface Choice {
  text: string;
  nextSceneId?: string;
  ending?: Ending;
  impact?: {
    guilt?: number;
    sanity?: number;
    money?: number;
    relationship?: { [charId: string]: number };
  };
  requiredReputation?: { charId: string; min: number };
  requiredMoney?: number;
  excludeIfVisited?: string[];
  onlyIfVisited?: string[];
  action?: () => void;
}

export interface Scene {
  id: string;
  locationId: LocationId;
  characterId?: string;
  text: string;
  choices: Choice[];
}

export interface GameState {
  guilt: number;
  sanity: number;
  money: number;
  currentLocation: LocationId;
  currentSceneId: string | null;
  relationships: { [charId: string]: number };
  inventory: string[];
  day: number;
  suspicion: number;
  visitCounts: { [sceneId: string]: number };
  showStartScreen: boolean;
  murderCommitted: boolean;
  sanityRescueHappened: boolean;
  isGameOver: boolean;
  ending: Ending | null;
}
