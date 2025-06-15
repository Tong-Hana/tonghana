import {
  FormControl,
  MenuItem,
  Select as MuiSelect,
  SelectChangeEvent,
} from "@mui/material";
import { colors } from "./input/styles";

type Props = {
  id: string;
  value: string;
  onChange: (event: SelectChangeEvent) => void;
  options: string[];
};

export default function Select({ id, value, onChange, options }: Props) {
  return (
    <FormControl
      className="w-32"
      variant="standard"
      sx={{
        borderRadius: "0.5rem",
        "& .MuiInput-underline:before": {
          borderBottomColor: colors.hanasilver, // 기본
        },
        "& .MuiInput-underline:hover:before": {
          borderBottomColor: "black", // hover 시
        },
        "& .MuiInput-underline:after": {
          borderBottomColor: colors.hanagreen.normal, // 활성화(포커스) 시
        },
      }}
    >
      <MuiSelect id={id} value={value} onChange={onChange}>
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </MuiSelect>
    </FormControl>
  );
}
