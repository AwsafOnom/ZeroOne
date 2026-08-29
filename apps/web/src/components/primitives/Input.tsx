import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cx } from "./utils";

const visibilityOffAsset = "/assets/icon-password-visible.svg";

interface BaseFieldProps {
  label?: ReactNode;
  error?: ReactNode;
  helperText?: ReactNode;
  isLoading?: boolean;
  className?: string;
}

interface PasswordFieldProps {
  passwordVisible?: boolean;
  onTogglePasswordVisibility?: () => void;
  visibilityToggleLabel?: string;
  visibilityIcon?: ReactNode;
}

type TextInputProps = BaseFieldProps &
  PasswordFieldProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, "className" | "size" | "type"> & {
    as?: "input";
    type?: InputHTMLAttributes<HTMLInputElement>["type"];
  };

type TextareaFieldProps = BaseFieldProps &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "className"> & {
    as: "textarea";
  };

type SelectFieldProps = BaseFieldProps &
  Omit<SelectHTMLAttributes<HTMLSelectElement>, "className"> & {
    as: "select";
    children: ReactNode;
  };

export type InputProps = TextInputProps | TextareaFieldProps | SelectFieldProps;

const controlClasses =
  "w-full rounded-sm border border-border-subtle bg-surface-default px-[var(--space-component-md)] py-[var(--space-component-sm)] font-body text-body text-text-form shadow-input transition-colors placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-[var(--border-width)] focus:ring-primary disabled:cursor-not-allowed disabled:bg-surface-muted disabled:opacity-60";

function FieldFrame({
  children,
  className,
  error,
  helperText,
  isLoading,
  label,
  id,
}: BaseFieldProps & { children: ReactNode; id?: string }) {
  return (
    <div className={cx("flex w-full flex-col gap-[var(--space-component-xs)]", className)}>
      {label && (
        <label className="font-body text-body-lg font-weight-body text-text-form" htmlFor={id}>
          {label}
        </label>
      )}
      {isLoading ? (
        <div
          aria-busy="true"
          aria-label={typeof label === "string" ? label : undefined}
          className="h-[var(--space-53-69)] w-full animate-pulse rounded-sm bg-surface-subtle"
        />
      ) : (
        children
      )}
      {error ? (
        <p className="font-body text-body-sm text-orange" role="alert">
          {error}
        </p>
      ) : (
        helperText && (
          <p className="font-body text-body-sm text-text-secondary">{helperText}</p>
        )
      )}
    </div>
  );
}

export function Input(props: InputProps) {
  if (props.as === "textarea") {
    const { as: _as, error, helperText, isLoading, label, className, ...textareaProps } = props;
    return (
      <FieldFrame
        className={className}
        error={error}
        helperText={helperText}
        id={textareaProps.id}
        isLoading={isLoading}
        label={label}
      >
        <textarea
          aria-invalid={Boolean(error) || undefined}
          className={cx(controlClasses, "min-h-[var(--space-128-856)] resize-y")}
          {...textareaProps}
        />
      </FieldFrame>
    );
  }

  if (props.as === "select") {
    const { as: _as, error, helperText, isLoading, label, className, children, ...selectProps } =
      props;
    return (
      <FieldFrame
        className={className}
        error={error}
        helperText={helperText}
        id={selectProps.id}
        isLoading={isLoading}
        label={label}
      >
        <select
          aria-invalid={Boolean(error) || undefined}
          className={cx(controlClasses, "appearance-auto")}
          {...selectProps}
        >
          {children}
        </select>
      </FieldFrame>
    );
  }

  const {
    as: _as,
    error,
    helperText,
    isLoading,
    label,
    className,
    passwordVisible = false,
    onTogglePasswordVisibility,
    visibilityToggleLabel,
    visibilityIcon,
    type = "text",
    ...inputProps
  } = props;
  const isPassword = type === "password";
  const resolvedType = isPassword && passwordVisible ? "text" : type;

  return (
    <FieldFrame
      className={className}
      error={error}
      helperText={helperText}
      id={inputProps.id}
      isLoading={isLoading}
      label={label}
    >
      <div className="relative w-full">
        <input
          aria-invalid={Boolean(error) || undefined}
          className={cx(controlClasses, isPassword && "pr-[var(--space-40)]")}
          type={resolvedType}
          {...inputProps}
        />
        {isPassword && onTogglePasswordVisibility && (
          <button
            aria-label={visibilityToggleLabel}
            className="absolute inset-y-0 right-0 flex w-[var(--space-40)] items-center justify-center text-primary"
            onClick={onTogglePasswordVisibility}
            type="button"
          >
            {visibilityIcon ?? (
              <img
                alt=""
                className="size-[var(--space-component-md)]"
                src={visibilityOffAsset}
              />
            )}
          </button>
        )}
      </div>
    </FieldFrame>
  );
}
