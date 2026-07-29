
import type { Imgrops } from "../../types/ui.types";
import type { SyntheticEvent } from "react";
export const Img = ({ src = "", onError, ...props }: Imgrops) => {
  const handleError = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    // e.currentTarget.src = imgnotfound;
    // e.target.src = imgnotfound;
  };
  return (
    <img
      src={src}
      onError={onError ?? handleError}
      loading={`lazy`}
      {...props}
    />
  );
};
