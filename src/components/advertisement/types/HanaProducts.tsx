export interface HanaAdCardProps {
  name: string;
  interestRate: number;
  maxInterestRate: number;
  maxAmount: number;
}

export interface HanaProductListItemProps extends HanaAdCardProps {
  order: number;
  logoUrl?: string;
  onClick?: () => void;
}
