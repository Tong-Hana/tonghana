import { Checkbox, FormControlLabel } from "@mui/material";
import { colors } from "./input/styles";

type Props = {
  id: string;
  label: string;
  checked: boolean;
  onChange: () => void;
};

export default function LabelWithCheckBox({
  id,
  label,
  checked,
  onChange,
}: Props) {
  return (
    <FormControlLabel
      className="text-text-primary text-sm font-medium"
      control={
        <Checkbox
          id={id}
          checked={checked}
          onChange={onChange}
          sx={{
            "&.Mui-checked": {
              color: colors.hanagreen.normal, // 체크된 상태의 색상
            },
          }}
        />
      }
      label={label}
    />
  );
}
