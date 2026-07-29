

export const isEmail = (email: string) => {
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    String(email)?.toLowerCase()
  );
};

export const isPhone = (phone: string) => {
  return /^[2368]\d{8}$/.test(
    String(phone)?.toLowerCase().replaceAll(" ","").replaceAll(".","").replaceAll("-","")
  );
};

export const isNumber = (value: string) => {
  return /^[0-9]+$/.test(String(value)?.toLowerCase());
};
export const isContainsLetterAndNumber = (value: string): boolean => {
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/.test(String(value));
};

export const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 9);
  if (digits.length <= 3) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  if (digits.length <= 7)
    return `${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5)}`;
  return `${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 7)} ${digits.slice(7)}`;
};


export const formatPrice = (value: string) => {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export const getDate = (dateAsString?: string) => {
  // 2025-09-24T09:30:00.557Z
  const timeAsString = new Date(
    new Date(dateAsString ?? "").getTime() + 60 * 60 * 1000,
  ).toISOString();

  const d = timeAsString.split("T")[0].split("-")[2];
  const m = timeAsString.split("T")[0].split("-")[1];
  const y = timeAsString.split("T")[0].split("-")[0];
  const hh = timeAsString.split("T")[1].split(":")[0];
  const min = timeAsString.split("T")[1].split(":")[1];

  return { d, m, y, hh, min };
};

export const formatDate = (timeAsString?: string) => {
  const { d, m, y } = getDate(timeAsString);
  return `${d}/${m}/${y}`;
};
export const formatDateWithHour = (timeAsString?: string) => {
  const { d, m, y, hh, min } = getDate(timeAsString);
  return `${d}/${m}/${y} à ${hh}:${min}`;
};

