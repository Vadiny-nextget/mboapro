interface SocialAuthButtonsProps {
  onGoogleClick?: () => void;
  onLinkedinClick?: () => void;
}

export default function SocialAuthButtons({ onGoogleClick, onLinkedinClick }: SocialAuthButtonsProps) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-3 my-4">
        <hr className="flex-1 border-subtle" />
        <span className="text-xs font-medium tracking-wide text-muted">Ou continuer avec</span>
        <hr className="flex-1 border-subtle" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onGoogleClick}
          className="cursor-pointer flex items-center justify-center gap-2 rounded-md border border-subtle bg-(--bg-surface)/60 py-2.5 text-sm font-medium text-primary backdrop-blur-sm transition-colors hover:bg-(--bg-surface-alt)"
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Google
        </button>
        <button
          type="button"
          onClick={onLinkedinClick}
          className="cursor-pointer flex items-center justify-center gap-2 rounded-md border border-subtle bg-(--bg-surface)/60 py-2.5 text-sm font-medium text-primary backdrop-blur-sm transition-colors hover:bg-(--bg-surface-alt)"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A66C2">
            <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.45-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.59 0 4.25 2.36 4.25 5.44v6.3zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
          </svg>
          LinkedIn
        </button>
      </div>
    </div>
  );
}