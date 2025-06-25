export interface HanaAdCardProps {
  name: string;
  interestRate: string;
  period: string;
  subjectUrl: string;
}

export interface HanaProductListItemProps extends HanaAdCardProps {
  order: number;
  logoUrl?: string;
  onClick?: () => void;
}
