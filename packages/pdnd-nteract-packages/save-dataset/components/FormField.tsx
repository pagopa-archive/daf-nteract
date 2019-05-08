import React, { FunctionComponent, HTMLAttributes } from "react";
import {
  IFormGroupProps,
  IInputGroupProps,
  Intent,
  FormGroup,
  InputGroup,
  HTMLInputProps
} from "@blueprintjs/core";

const FormField: FunctionComponent<
  IFormGroupProps &
    IInputGroupProps &
    HTMLInputProps & {
      formGroupProps?: HTMLAttributes<HTMLElement>;
      inputGroupProps?: IInputGroupProps & HTMLInputProps;
    }
> = ({
  required = true,
  type = "text",
  labelFor,
  label = "Label",
  labelInfo = "*",
  helperText = null,
  placeholder = "Placeholder",
  leftIcon = null,
  intent = Intent.NONE,
  formGroupProps,
  inputGroupProps
}) => (
  <FormGroup
    labelFor={labelFor}
    label={label}
    labelInfo={labelInfo}
    helperText={helperText}
    {...formGroupProps}
  >
    {/* update with the possibility of specifing a custom children instead of the default InputGroup */}
    <InputGroup
      id={labelFor}
      name={labelFor}
      type={type}
      required={required}
      intent={intent}
      placeholder={placeholder}
      leftIcon={leftIcon}
      {...inputGroupProps}
    />
  </FormGroup>
);

export default FormField;
