import { CategoryRatios } from "@/app/types/profiles";

export interface ProfileCardProps {
  id: number;
  name: string;
  age: number;
  job: string;
  location: string;
  description: string;
  imageUrl: string;
  target: string;
  totalAsset: string;
  carCost: string;
  houseCost: string;
  portfolioRatios: CategoryRatios;
  debtPercent: string;
  portfolioType: string;
  investorType: string;
  showDetail?: boolean;
  modalView?: boolean;
}
