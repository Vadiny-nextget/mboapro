
import type React from "react";

export type Theme = "light" | "dark" | "system" | "default";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  className?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  backgroundColor?: string;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  css?: string;
  label?: React.ReactNode;
  description?: string;
  isLoading?: boolean;
  Icon?: React.ElementType;
  Ico?: string;
}

export interface InputOtpProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export interface SelectProps {
  items: SelectItemsProps[];
  name?: string;
  error?: string;
  label?: React.ReactNode;
  id?: string;
  disabled?: boolean;
  className?: string;
  value?: string | number | readonly string[];
  title?: string;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
}

export interface SelectItemsProps {
  name?: string;
  id?: string;
  disabled?: boolean;
  className?: string;
  value?: string | number | readonly string[];
  title?: string;
  selected?: boolean;
}

export interface InputCheckProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  css?: string;
  inverse?: boolean;
}

export interface SwitchProps {
  name?: string;
  id?: string;
  disabled?: boolean;
  checked: boolean;
  className?: string;
  label?: string;
  value?: string;
  title?: string;
  inverse?: boolean;
  onChange?(checked: boolean): void;
}

export interface FilesUploadProps {
  label?: string;
  className?: string;
  allowedTypes?: string[];
  fileUrl?: string;
  capture?: "user" | "environment" | boolean;
  maxSize?: number;
  minFiles?: number;
  maxFiles?: number;
  required?: boolean;
  multiple?: boolean;
  onFilesChange?: (files: File[] | File) => void;
}
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  css?: string;
  label?: React.ReactNode;
}

export interface Imgrops extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  onError?: React.ChangeEventHandler<HTMLImageElement>;
}
