import { REGIONS } from "@/constants/regions";
import { SelectChangeEvent } from "@mui/material";
import Select from "./Select";

type Props = {
  city: string;
  district: string;
  onChangeCity: (event: SelectChangeEvent) => void;
  onChangeDistrict: (event: SelectChangeEvent) => void;
};

export default function AddressSelectGroup({
  city,
  district,
  onChangeCity,
  onChangeDistrict,
}: Props) {
  return (
    <div className="flex flex-col w-full">
      <label className="mb-3 text-xs font-normal text-text-secondary">
        시군구
      </label>
      <div className="flex gap-3">
        <Select
          id="city"
          value={city}
          onChange={onChangeCity}
          options={Object.keys(REGIONS)}
        />
        <Select
          id="district"
          value={district}
          onChange={onChangeDistrict}
          options={REGIONS[city] ?? []}
        />
      </div>
    </div>
  );
}
