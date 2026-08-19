import { motion, type Variants } from "framer-motion";
import { ChevronsUpDown, Eye, EyeOff, Loader2, PenBox } from "lucide-react";
import React, {
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";
import type {
  ButtonProps,
  FilesUploadProps,
  InputCheckProps,
  InputOtpProps,
  InputProps,
  SelectProps,
  TextareaProps,
} from "../../types/ui.types";
import clsx from "clsx";
import { Img } from "./Img";
// import { hero } from "../../assets";

const shimmerVariants: Variants = {
  initial: { backgroundPosition: "-200% 0" },
  animate: {
    backgroundPosition: "200% 0",
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

export const Input = ({
  css = "",
  error = "",
  label = "",
  description = "",
  id = "",
  isLoading = false,
  Icon,
  Ico = "",
  type = "text",
  ...props
}: InputProps) => {
  const [inputType, setInputType] =
    useState<React.HTMLInputTypeAttribute>(type);
  return (
    <motion.div
      className={`${css} text-md flex flex-col gap-2 w-full max-w-md`}
    >
      {label && (
        <label htmlFor={id} className="text-sm cursor-pointer w-full">
          {label}
        </label>
      )}
      {description && <p className="text-sm">{description}</p>}
      <div className="flex flex-col gap-2">
        {isLoading ? (
          <motion.div
            className={`h-10 rounded-md ${
              error ? "border-red-500" : "border-gray-300 dark:border-gray-700"
            }`}
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            style={{
              background: `
                linear-gradient(
                  90deg,
                  rgba(241, 241, 241, 0.8) 25%,
                  rgba(255, 255, 255, 0.9) 50%,
                  rgba(241, 241, 241, 0.8) 75%
                )
              `,
              backgroundSize: "400% 100%",
            }}
          />
        ) : (
          <div className="relative w-full">
            {Icon && (
              <Icon
                className={`absolute left-4 top-1/2 -translate-y-1/2 ${error ? "text-red-500" : "text-gray-400"}`}
                size={20}
              />
            )}
            {Ico.length > 0 && (
              <span
                className={`absolute left-2 top-1/2 -translate-y-1/2 ${error ? "text-red-500" : "text-gray-400"}`}
              >
                {Ico}
              </span>
            )}
            <input
              id={id}
              type={inputType}
              className={`w-full ${Icon ? "pl-12" : Ico ? "pl-13" : "pl-4"} ${type === "password" ? "pr-12" : "pr-4"} py-4 rounded-2xl border focus:outline-none focus:border-[#033720] transition-colors  ${error ? "border-red-500" : "border-gray-200"}`}
              {...props}
            />
            {type === "password" &&
              (inputType === "password" ? (
                <Eye
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    setInputType("text");
                  }}
                  size={20}
                />
              ) : (
                <EyeOff
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    setInputType("password");
                  }}
                  size={20}
                />
              ))}
          </div>
        )}
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    </motion.div>
  );
};

/**
 * Saisie OTP à 6 cases, numérique, avec navigation clavier et
 * support du collage (paste) du code complet reçu par SMS/email.
 */
export function InputOtp({
  length = 6,
  value,
  onChange,
  error,
  disabled,
}: InputOtpProps) {
  const [digits, setDigits] = useState<string[]>(Array(length).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!value) {
      setDigits(Array(length).fill(""));
    }
  }, [value, length]);

  const emitChange = (next: string[]) => {
    setDigits(next);
    onChange(next.join(""));
  };

  const handleChange = (index: number, raw: string) => {
    const char = raw.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = char;
    emitChange(next);
    if (char && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);
    if (!pasted) return;
    const next = Array(length)
      .fill("")
      .map((_, i) => pasted[i] || "");
    emitChange(next);
    inputsRef.current[Math.min(pasted.length, length - 1)]?.focus();
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between gap-2">
        {digits.map((digit, index) => (
          <motion.input
            key={index}
            ref={(el) => (inputsRef.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            disabled={disabled}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            whileFocus={{ scale: 1.05 }}
            className={clsx(
              "h-14 w-9 rounded-xl border text-center text-xl font-bold text-primary outline-none transition-colors sm:w-12",
              "focus:border-primary-500 bg-surface",
              error ? "border-danger" : "border-subtle",
            )}
          />
        ))}
      </div>
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}

export const InputTel = ({
  css = "",
  error = "",
  label = "",
  description = "",
  id = "",
  isLoading = false,
  Ico = "",
  pays = "",
  ...props
}: InputProps & { pays?: string }) => {
  return (
    <motion.div
      className={`${css} text-md flex flex-col gap-2 w-full max-w-md`}
    >
      {label && (
        <label htmlFor={id} className="text-sm cursor-pointer w-full">
          {label}
        </label>
      )}
      {description && <p className="text-sm">{description}</p>}
      <div className="flex flex-col gap-2">
        {isLoading ? (
          <motion.div
            className={`h-10 rounded-md ${
              error ? "border-red-500" : "border-gray-300 dark:border-gray-700"
            }`}
            variants={shimmerVariants}
            initial="initial"
            animate="animate"
            style={{
              background: `
                linear-gradient(
                  90deg,
                  rgba(241, 241, 241, 0.8) 25%,
                  rgba(255, 255, 255, 0.9) 50%,
                  rgba(241, 241, 241, 0.8) 75%
                )
              `,
              backgroundSize: "400% 100%",
            }}
          />
        ) : (
          <div className="relative w-full flex gap-2 items-center">
            <div className="absolute left-2 flex gap-2 items-center">
              {pays && (
                <Img
                  className="object-contain w-8"
                  alt={pays ?? ""}
                  src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${pays}.svg`}
                />
              )}
              {Ico.length > 0 && <span className="text-gray-400">{Ico}</span>}
            </div>
            <input
              id={id}
              placeholder="Entrez votre numéro de téléphone"
              className={`w-full pl-21 py-4 rounded-2xl border focus:outline-none focus:border-[#033720] transition-colors  ${error ? "border-red-500" : "border-gray-200 dark:border-gray-700"}`}
              {...props}
            />
          </div>
        )}
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    </motion.div>
  );
};

export const InputCheck = ({
  type = "checkbox",
  id,
  description = "",
  className = "",
  css = "",
  label = "",
  title = "",
  inverse = false,
  ...props
}: InputCheckProps) => {
  return (
    <motion.label
      whileFocus={{ scale: 1.05 }}
      className={`${css} text-md flex flex-col gap-2 cursor-pointer w-full`}
      title={title}
      htmlFor={id}
    >
      <motion.span
        className={`flex gap-2 w-full select-none items-start ${
          inverse ? "flex-row" : "flex-row-reverse"
        }`}
      >
        <span className="w-full">{label}</span>
        <input
          type={type}
          id={id}
          className={
            className +
            " outline-none border-none size-4 mt-0.5 outline-0 ring-0 border-0 focus-visible:ring-0 focus-visible:border-none accent-primary-500"
          }
          {...props}
        />
      </motion.span>
      {description && <p className="opacity-60 italic">{description}</p>}
    </motion.label>
  );
};

export const SelectCountry = ({
  name = "",
  error = "",
  id = "",
  label = "",
  className = "",
  disabled = false,
  value = "",
  title = "",
  items = [],
  onChange,
}: SelectProps) => {
  return (
    <motion.div
      className={`${className} text-md flex flex-col gap-2 w-full max-w-md`}
    >
      {label && (
        <label
          htmlFor={id.replaceAll(" ", "_").replaceAll("'", "")}
          className="text-sm cursor-pointer w-full"
        >
          {label}
        </label>
      )}
      <div className="relative w-full flex gap-2 items-center cursor-pointer">
        <Img
          className="object-contain w-10 absolute left-2"
          alt={items.find((it) => it.value === value)?.name ?? ""}
          src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${value}.svg`}
        />
        <select
          id={id.replaceAll(" ", "_").replaceAll("'", "")}
          name={name}
          disabled={disabled}
          onChange={onChange}
          value={value}
          className="py-4 pl-14 pr-6 rounded-2xl border border-gray-200 focus:outline-none focus:border-[#033720] transition-colors cursor-pointer appearance-none w-full"
        >
          {title && (
            <option value="" disabled>
              {title}
            </option>
          )}
          {items.map((sc, idx) => (
            <option value={sc.value} key={idx} selected={sc.value === value}>
              {sc.name}
            </option>
          ))}
        </select>
        <ChevronsUpDown className="size-4 absolute right-2" />
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </motion.div>
  );
};

export const Select = ({
  name = "",
  id = "",
  className = "",
  disabled = false,
  title = "",
  items = [],
  onChange,
}: SelectProps) => {
  return (
    <motion.div
      whileFocus={{ scale: 1.05 }}
      className={`${className} input-hindra text-md flex gap-2 items-center relative`}
      title={title}
    >
      <motion.select
        id={id}
        name={name}
        className={
          "w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#033720] transition-colors cursor-pointer appearance-none"
        }
        disabled={disabled}
        onChange={onChange}
      >
        {items.map((item, idx) => (
          <motion.option
            key={idx}
            value={item.value}
            id={item?.id}
            disabled={item?.disabled}
            className={`${item.className} cursor-pointer bg-background text-foreground`}
            selected={item?.selected}
          >
            {item.name}
          </motion.option>
        ))}
      </motion.select>
      <ChevronsUpDown className="size-4 absolute right-1" />
    </motion.div>
  );
};

export const InputSelect = ({
  name = "",
  error = "",
  id = "",
  className = "",
  disabled = false,
  value = "",
  title = "",
  items = [],
  label,
  onChange,
}: SelectProps) => {
  return (
    <motion.div
      className={`${className} text-md flex flex-col gap-2 w-full max-w-md`}
    >
      {label && (
        <label
          htmlFor={id.replaceAll(" ", "_").replaceAll("'", "")}
          className="text-sm cursor-pointer w-full"
        >
          {label}
        </label>
      )}
      <div className="relative w-full">
        <select
          id={id.replaceAll(" ", "_").replaceAll("'", "")}
          name={name}
          disabled={disabled}
          onChange={onChange}
          value={value}
          className={`py-4 px-2 w-full rounded-2xl border focus:outline-none focus:border-[#033720] transition-colors appearance-none ${error ? "border-red-500" : "border-gray-200"} `}
        >
          {title && (
            <option value="" disabled>
              {title}
            </option>
          )}
          {items.map((sc, idx) => (
            <option
              value={sc.value}
              key={idx}
              selected={sc.value === value}
              className="bg-(--surface-glass)"
            >
              {sc.name}
            </option>
          ))}
        </select>

        <ChevronsUpDown className="size-4 absolute right-2.5 top-5 -translate-y-" />
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </motion.div>
  );
};
// flex flex-1 items-center justify-center gap-2 px-4 py-2 rounded-xl transition-all max-w-md
export const Button = ({
  loading = false,
  className = "",
  children = "",
  disabled = false,
  leftIcon,
  rightIcon,
  onClick,
  ...props
}: ButtonProps) => {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        onClick?.(e);
      }}
      className={`h-10 flex items-center justify-center px-4 text-sm gap-2 rounded-md bg-primary-500 text-on-primary hover:opacity-80 active:bg-primary-700 shadow-sm disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary-500 font-semibold transition-all duration-150 ${className} ${disabled || loading ? "opacity-60" : "hover:scale-105 active:scale-95 cursor-pointer"}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : leftIcon}
      {children}
      {!loading && rightIcon}

      {/* {isLoading ? ( */}
      {/* //           <Loader2 size={16} className="animate-spin" />
//         ) : (
//           leftIcon
//         )}
//         {size !== 'icon' && children}
//         {!isLoading && rightIcon} */}
    </button>
  );
};

export const InputFile = ({
  label = "Importer vos fichiers (PDF ou image, max 5 Mo)",
  className = "",
  capture,
  allowedTypes = ["image/jpeg", "image/png", "image/webp"], // "application/pdf"
  maxSize = 5, // 5MB
  required = false,
  onFilesChange,
}: FilesUploadProps) => {
  const [error, setError] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.item(0);
    setError("");
    if (selectedFile) {
      if (
        !allowedTypes.includes(selectedFile.type) ||
        selectedFile.size > maxSize * 1024 * 1024
      ) {
        let error = "";
        if (!allowedTypes.includes(selectedFile.type))
          error = "Format d'image non valide.";
        if (selectedFile?.size > maxSize * 1024 * 1024)
          error = "Taille d'image superieur a la limite.";
        setError(error);
      } else onFilesChange?.(selectedFile);
    }
  };

  return (
    <motion.div
      whileFocus={{ scale: 1.05 }}
      className={`${className} input-hindra w-fit text-md flex flex-col gap-2 shadow-md p-2`}
    >
      <motion.label className="" htmlFor="file-input">
        {label}
      </motion.label>
      <motion.input
        id="file-input"
        name="file-input"
        required={required}
        capture={capture}
        type="file"
        accept={allowedTypes.join(", ")}
        onChange={handleFileChange}
        className="w-full cursor-pointer border border-primary/25 text-sm py-1 px-2 text-foreground/65"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </motion.div>
  );
};

export const InputFiles = ({
  label = "Importer vos fichiers (PDF ou image, max 5 Mo)",
  capture,
  allowedTypes = ["image/jpeg", "image/png", "image/webp"], // "application/pdf"
  maxSize = 5, // 5MB
  minFiles = 0,
  maxFiles = 5,
  multiple = true,
  required = false,
  onFilesChange,
}: FilesUploadProps) => {
  const [error, setError] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const fileChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files
      ? Array.from(event.target.files)
      : [];
    if (selectedFiles.length > 0) {
      if (selectedFiles.length < minFiles || selectedFiles.length > maxFiles) {
        setError(
          `Veuillez sélectionner entre ${minFiles} et ${maxFiles} fichiers.`,
        );
        return;
      }

      const validFiles = selectedFiles.filter(
        (file) =>
          allowedTypes.includes(file.type) &&
          file.size <= maxSize * 1024 * 1024,
      );

      if (validFiles.length !== selectedFiles.length) {
        setError(
          "Certains fichiers ont été rejetés (format non valide ou taille dépassée). Veuillez vérifier votre sélection.",
        );
      } else {
        setError("");
      }
      const renamedFiles = validFiles.map((file, idx) => {
        const ext = file.name.split(".").pop();
        const name = `Fichier_${idx + 1}.${ext}`;
        return new File([file], name, { type: file.type });
      });

      onFilesChange?.(renamedFiles);
    }
    inputRef.current.value = null;
  };

  const editClicked = () => {
    inputRef?.current?.click();
  };

  return (
    <div className="flex flex-col gap-2 file w-full h-full border rounded-md shadow-md p-2">
      <div className="flex gap-4 justify-between w-full">
        <motion.label className="cursor-pointer" htmlFor="files-input">
          {label}
        </motion.label>
        <span role="button" className="cursor-pointer" onClick={editClicked}>
          <span className="sr-only">Click</span>
          <PenBox />
        </span>
      </div>
      <motion.input
        id="files-input"
        name="files-input"
        required={required}
        capture={capture}
        type="file"
        accept={allowedTypes.join(", ")}
        onChange={fileChanged}
        multiple={multiple}
        ref={inputRef}
        className="w-full cursor-pointer hidden"
      />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export const InputFilesUpload = ({
  label = "Importer vos fichiers (PDF ou image, max 5 Mo)",
  capture,
  allowedTypes = ["image/jpeg", "image/png", "image/webp"], // "application/pdf"
  maxSize = 5, // 5MB
  minFiles = 0,
  maxFiles = 5,
  multiple = true,
  required = false,
  onFilesChange,
}: FilesUploadProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const fileChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files
      ? Array.from(event.target.files)
      : [];
    if (selectedFiles.length > 0) {
      if (selectedFiles.length < minFiles || selectedFiles.length > maxFiles) {
        setError(
          `Veuillez sélectionner entre ${minFiles} et ${maxFiles} fichiers.`,
        );
        return;
      }

      const validFiles = selectedFiles.filter(
        (file) =>
          allowedTypes.includes(file.type) &&
          file.size <= maxSize * 1024 * 1024,
      );

      if (validFiles.length !== selectedFiles.length) {
        setError(
          "Certains fichiers ont été rejetés (format non valide ou taille dépassée). Veuillez vérifier votre sélection.",
        );
      } else {
        setError("");
      }
      const renamedFiles = validFiles.map((file, idx) => {
        const ext = file.name.split(".").pop();
        const name = `Fichier_${idx + 1}.${ext}`;
        return new File([file], name, { type: file.type });
      });

      setFiles(renamedFiles);
      onFilesChange?.(renamedFiles);
    }
    inputRef.current.value = null;
  };

  const editClicked = () => {
    inputRef?.current?.click();
  };

  return (
    <div className="flex flex-col gap-2 file w-full h-full border rounded-md shadow-md p-2">
      <div className="flex gap-4 justify-between w-full active:scale-95">
        <motion.label className="cursor-pointer w-full" htmlFor="files-upload">
          {label}
        </motion.label>
        <span role="button" className="cursor-pointer" onClick={editClicked}>
          <span className="sr-only">Click</span>
          <PenBox />
        </span>
      </div>
      <motion.input
        id="files-upload"
        name="files-upload"
        required={required}
        capture={capture}
        type="file"
        accept={allowedTypes.join(", ")}
        onChange={fileChanged}
        multiple={multiple}
        ref={inputRef}
        className="w-full cursor-pointer hidden"
      />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {files.length > 0 && (
        <div className="px-2 pb-1">
          <p className="text-sm font-medium text-gray-700">
            Fichiers sélectionnés :
          </p>
          <div className="flex gap-2 flex-wrap items-center">
            {files.map((file, index) => (
              <a
                key={index}
                href={URL.createObjectURL(file)}
                target="_blank"
                rel="noreferrer"
                className="w-20 h-20 text-sm flex items-center justify-center rounded-md border border-gray-300 text-gray-500"
                title={file.name}
              >
                {file.type.startsWith("image") ? (
                  <Img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                ) : (
                  file.name
                )}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const InputFileUpload = ({
  label = "Importer votre fichier (PDF ou image, max 5 Mo)",
  capture,
  allowedTypes = ["image/jpeg", "image/png", "image/webp"], // "application/pdf"
  maxSize = 5, // 5MB
  required = false,
  fileUrl = "",
  onFilesChange,
}: FilesUploadProps) => {
  const [files, setFiles] = useState<File>();
  const [urlFile, setUrlFile] = useState<string>(fileUrl);
  const [error, setError] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const fileChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files
      ? Array.from(event.target.files)
      : [];
    if (selectedFiles.length > 0) {
      const validFiles = selectedFiles[0];

      if (
        !allowedTypes.includes(validFiles.type) ||
        validFiles.size > maxSize * 1024 * 1024
      ) {
        if (!allowedTypes.includes(validFiles.type))
          setError("Votre fichier a été rejeté (format non valide).");
        if (validFiles.size > maxSize * 1024 * 1024)
          setError("Votre fichier a été rejeté (taille dépassée).");
      } else {
        setError("");
        setFiles(validFiles);
        setUrlFile(URL.createObjectURL(validFiles));
        onFilesChange?.(validFiles);
      }
    }
    inputRef.current.value = null;
  };

  const editClicked = () => {
    inputRef?.current?.click();
  };

  return (
    <div className="flex flex-col gap-2 file w-full h-full border rounded-md shadow-md p-2">
      <div className="flex gap-4 justify-between w-full">
        <motion.label className="cursor-pointer" htmlFor="file-upload">
          {label}
        </motion.label>
        <span role="button" className="cursor-pointer" onClick={editClicked}>
          <span className="sr-only">Click</span>
          <PenBox />
        </span>
      </div>
      <motion.input
        id="file-upload"
        name="file-upload"
        required={required}
        capture={capture}
        type="file"
        accept={allowedTypes.join(", ")}
        onChange={fileChanged}
        ref={inputRef}
        className="w-full cursor-pointer hidden"
      />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {urlFile.length > 0 && (
        <div className="flex gap-2 flex-wrap items-center p-2">
          <a
            href={urlFile}
            target="_blank"
            rel="noreferrer"
            className="w-20 h-20 text-sm flex items-center justify-center rounded-md border border-gray-300 text-gray-500"
            title={files ? files.name : "Image de categorie"}
          >
            {files ? (
              files.type.startsWith("image") ? (
                <Img
                  src={urlFile}
                  alt={files.name}
                  className="w-20 h-20 object-contain rounded-md"
                />
              ) : (
                files.name
              )
            ) : (
              <Img
                src={urlFile}
                alt={"Image de categorie"}
                className="w-20 h-20 object-contain rounded-md"
              />
            )}
          </a>
        </div>
      )}
    </div>
  );
};

export const Textarea = ({
  css = "",
  error = "",
  label,
  id = "",
  ...props
}: TextareaProps) => {
  return (
    <motion.div
      className={`${css} text-md flex flex-col gap-2 w-full max-w-md`}
    >
      {label && (
        <label htmlFor={id} className="text-sm cursor-pointer w-full">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={`"w-full p-3 text-sm text-primary outline-none rounded-2xl border focus:outline-none focus:border-[#033720] transition-colors  ${error ? "border-red-500" : "border-gray-200"}`}
        {...props}
      />
      {error && <p className="text-sm text-danger">{error}</p>}
    </motion.div>
  );
};
