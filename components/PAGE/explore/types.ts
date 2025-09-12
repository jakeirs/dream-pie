export interface FeatureCardData {
  id: string;
  title: string;
  description: string;
  icon: string;
  variant: 'info' | 'success' | 'warning' | 'danger';
  details?: string[];
}

export interface ExploreAnimationsType {
  values: {
    scale: any;
    rotate: any;
  };
  animationCounter: number;
  handleStarAnimation: () => void;
  resetAnimations: () => void;
}

export interface FeatureCardsType {
  activeCard: string | null;
  handleCardPress: (cardId: string) => void;
}

export interface ExplorePageProps {
  className?: string;
}

export interface InteractiveStarProps {
  animations: ExploreAnimationsType;
}

export interface FeatureShowcaseProps {
  cards: FeatureCardsType;
  features: FeatureCardData[];
}
