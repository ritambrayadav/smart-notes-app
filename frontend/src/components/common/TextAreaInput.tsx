import React from "react";

interface TextAreaInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

const TextAreaInput: React.FC<TextAreaInputProps> = ({
  value,
  onChange,
  placeholder,
  className = "",
  required = false,
}) => (
  <textarea
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    required={required}
    className={`w-full p-2 border rounded ${className}`}
  />
);

export default TextAreaInput;
