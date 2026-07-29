// import { forwardRef } from 'react';
// import type { ButtonHTMLAttributes, ReactNode } from 'react';
// import clsx from 'clsx';
// import { Loader2 } from 'lucide-react';

// type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
// type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

// interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
//   variant?: ButtonVariant;
//   size?: ButtonSize;
//   isLoading?: boolean;
//   leftIcon?: ReactNode;
//   rightIcon?: ReactNode;
//   fullWidth?: boolean;
// }

// const variantStyles: Record<ButtonVariant, string> = {
//   primary:
//     'bg-primary-500 text-on-primary hover:bg-primary-600 active:bg-primary-700 shadow-sm',
//   secondary:
//     'bg-accent-500 text-gray-900 hover:bg-accent-600 active:bg-accent-700 shadow-sm',
//   outline:
//     'border border-strong text-primary bg-transparent hover:bg-surface-alt',
//   ghost:
//     'bg-transparent text-secondary hover:bg-surface-alt hover:text-primary',
//   danger:
//     'bg-danger text-white hover:brightness-95 active:brightness-90 shadow-sm',
// };

// const sizeStyles: Record<ButtonSize, string> = {
//   sm: 'h-8 px-3 text-sm gap-1.5 rounded-md',
//   md: 'h-10 px-4 text-sm gap-2 rounded-md',
//   lg: 'h-12 px-6 text-base gap-2 rounded-lg',
//   icon: 'h-10 w-10 rounded-md justify-center',
// };

// /**
//  * Bouton générique du design system MboaPro.
//  * Usage :
//  *   <Button variant="primary" leftIcon={<Plus size={16} />}>Publier une mission</Button>
//  */
// const Button = forwardRef<HTMLButtonElement, ButtonProps>(
//   (
//     {
//       variant = 'primary',
//       size = 'md',
//       isLoading = false,
//       leftIcon,
//       rightIcon,
//       fullWidth = false,
//       disabled,
//       className,
//       children,
//       ...rest
//     },
//     ref
//   ) => {
//     return (
//       <button
//         ref={ref}
//         disabled={disabled || isLoading}
//         className={clsx(
//           'inline-flex items-center font-semibold transition-all duration-150',
//           'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500',
//           'disabled:cursor-not-allowed disabled:opacity-50',
//           variantStyles[variant],
//           sizeStyles[size],
//           fullWidth && 'w-full',
//           !disabled && !isLoading && 'active:scale-[0.98]',
//           className
//         )}
//         {...rest}
//       >
//         {isLoading ? (
//           <Loader2 size={16} className="animate-spin" />
//         ) : (
//           leftIcon
//         )}
//         {size !== 'icon' && children}
//         {!isLoading && rightIcon}
//       </button>
//     );
//   }
// );

// Button.displayName = 'Button';
// export default Button;