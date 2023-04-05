import React from 'react';
import { FormGroup, ValidatedOptions } from '@patternfly/react-core';
import { useField } from 'formik';
import { BaseInputFieldProps } from './field-types';
import { getFieldId } from './field-utils';

import './BaseInputField.scss';

const BaseInputField: React.FC<
  BaseInputFieldProps & {
    children: (props) => React.ReactNode;
  }
> = ({
  label,
  labelIcon,
  helpText,
  required,
  children,
  name,
  onChange,
  helpTextInvalid,
  validated,
  dataTest,
  ...props
}) => {
  const [field, { touched, error }] = useField({ name, type: 'input' });
  const fieldId = getFieldId(name, 'input');
  const isValid = !(touched && error);
  const errorMessage = !isValid ? error : '';
  return (
    <FormGroup
      fieldId={fieldId}
      label={label}
      labelIcon={labelIcon}
      helperText={helpText}
      helperTextInvalid={errorMessage || helpTextInvalid}
      validated={!isValid ? ValidatedOptions.error : validated}
      isRequired={required}
      data-test={dataTest}
      className="hac-input-field"
    >
      {children({
        ...field,
        ...props,
        value: field.value ?? '',
        id: fieldId,
        label,
        validated: !isValid ? ValidatedOptions.error : validated,
        'aria-describedby': helpText ? `${fieldId}-helper` : undefined,
        onChange: (value, event) => {
          field.onChange(event);
          onChange && onChange(event);
        },
      })}
    </FormGroup>
  );
};

export default BaseInputField;
