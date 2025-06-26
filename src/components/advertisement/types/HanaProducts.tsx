export interface HanaAdCardProps {
  name: string;
  interestRate: string;
  period: string;
  subjectUrl: string;
}

export interface HanaProductListItemProps {
  order: number;
  name: string;
  interestRate: number;
  maxInterestRate: number;
  period: string;
  logoUrl?: string;
  onClick?: () => void;
}
