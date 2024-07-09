import type { TextFieldProps } from "@mui/material/TextField";
import TextField from "@mui/material/TextField";
import type { FieldValues, UseControllerProps } from "react-hook-form";
import { Controller } from "react-hook-form";

export type RhfTextFieldProps<T extends FieldValues> = TextFieldProps &
  UseControllerProps<T>;

const RhfTextField = <T extends FieldValues>(props: RhfTextFieldProps<T>) => {
  const { name, control } = props;
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          {...props}
          {...field}
          error={fieldState.invalid}
          helperText={fieldState.error?.message || " "}
        />
      )}
    />
  );
};

export default RhfTextField;
