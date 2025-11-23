
export enum ImageSize {
  _1K = '1K',
  _2K = '2K',
  _4K = '4K'
}

export type Language = 'en' | 'pt';

export interface Step {
  stepNumber: number;
  instruction: string;
}

export interface Recipe {
  id: string; // Generated UUID or timestamp
  title: string;
  ingredients: string[];
  steps: Step[];
  thumbnailUrl?: string;
  prepTime?: string;
  cuisine?: string;
}

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type MeasurementSystem = 'Metric' | 'Imperial';

export interface UserProfile {
  name: string;
  skillLevel: SkillLevel;
  measurementSystem: MeasurementSystem;
  allergies: string[];
  appliances: string[];
  dietaryRestrictions: string;
  favoriteCuisines: string[];
  favoriteRegions: string[];
  soundEnabled: boolean;
  hapticEnabled: boolean;
}

export type View = 'home' | 'results' | 'cooking' | 'library' | 'profile';

export interface AppState {
  currentView: View;
  ingredientsInput: string;
  recipes: Recipe[];
  selectedRecipe: Recipe | null;
  library: Recipe[];
  profile: UserProfile;
  isDarkMode: boolean;
  isLoading: boolean;
  imageSize: ImageSize;
  language: Language;
}
