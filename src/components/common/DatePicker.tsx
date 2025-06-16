import { DatePicker as MuiDatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { colors } from "./input/styles";
import { ko } from "date-fns/locale/ko";

type Props = {
  date: Date | null;
  onChange: (value: Date | null) => void;
};

export default function DatePicker({ date, onChange }: Props) {
  return (
    <div className="w-full">
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ko}>
        <MuiDatePicker
          label="생년월일"
          value={date}
          onChange={onChange}
          slotProps={{
            textField: {
              variant: "standard",
              fullWidth: true,
              readOnly: true,
              sx: {
                "& .MuiPickersInputBase-root": {
                  borderRadius: "0.5rem",
                  height: "36px",
                  "&:hover:before": {
                    borderBottom: `1px solid ${colors.hanasilver}`, // hover 시 border
                  },
                  "&:before": {
                    borderBottom: `1px solid ${colors.hanasilver}`, // 비활성화 시
                  },
                  "&:after": {
                    borderBottom: `2px solid ${colors.hanagreen.normal}`, // 포커스 시
                  },
                },
              },
            },
            day: {
              sx: {
                "&..Mui-focused": {
                  backgroundColor: colors.hanagreen.normal,
                },
                "&.Mui-selected": {
                  backgroundColor: colors.hanagreen.normal, // 원하는 배경색
                  color: "#fff", // 텍스트 색도 함께 바꾸기
                  "&:hover": {
                    backgroundColor: colors.hanagreen.normal,
                  },
                },
              },
            },
          }}
        />
      </LocalizationProvider>
    </div>
  );
}
