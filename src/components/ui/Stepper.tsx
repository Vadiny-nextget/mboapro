type StepperProps = {
  index: number;
  cmp: React.JSX.Element[];
  className?: string;
};

export function Stepper({ index, cmp, className = "" }: StepperProps) {
  return (
    <div className="w-full p-5 flex flex-col gap-5">
      <div className="flex gap-2 items-center justify-between relative w-full overflow-hidden z-0">
        <div className={`absolute h-1 left-0 right-0 bg-gray-500 -z-10`}>
          <div
            className={`absolute h-1 bg-primary-500! -z-10`}
            style={{ width: `${(100 * index) / (cmp.length - 1)}%` }}
          />
        </div>
        {[...Array(cmp.length)].map((_, idx) => (
          <span
            key={idx}
            className={`rounded-full border border-gray-500 flex justify-center items-center size-8 z-10 text-black ${idx < index ? "bg-primary-500! border-primary-500! text-white!" : idx === index ? "border-primary-500! border-2 font-black text-lg bg-white" : "bg-white"} `}
          >
            {idx + 1}
          </span>
        ))}
      </div>
      <div className={className}>{cmp[index]}</div>
    </div>
  );
}
