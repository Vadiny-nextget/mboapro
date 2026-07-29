
export default function GlobalSuspenseFallback() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-(--bg-page)">
      <div className="spinner spinner--lg" />
    </div>
  );
}