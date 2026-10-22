export const COUNTRIES = [
  {
    code: "KH",
    dial: "855",
    flag: "🇰🇭",
    name: "Cambodia",
  },
  {
    code: "TH",
    dial: "66",
    flag: "🇹🇭",
    name: "Thailand",
  },
  {
    code: "VN",
    dial: "84",
    flag: "🇻🇳",
    name: "Vietnam",
  },
  {
    code: "LA",
    dial: "856",
    flag: "🇱🇦",
    name: "Laos",
  },
  {
    code: "MM",
    dial: "95",
    flag: "🇲🇲",
    name: "Myanmar",
  },
  {
    code: "SG",
    dial: "65",
    flag: "🇸🇬",
    name: "Singapore",
  },
  {
    code: "MY",
    dial: "60",
    flag: "🇲🇾",
    name: "Malaysia",
  },
  {
    code: "ID",
    dial: "62",
    flag: "🇮🇩",
    name: "Indonesia",
  },
  {
    code: "PH",
    dial: "63",
    flag: "🇵🇭",
    name: "Philippines",
  },
  {
    code: "CN",
    dial: "86",
    flag: "🇨🇳",
    name: "China",
  },
  {
    code: "JP",
    dial: "81",
    flag: "🇯🇵",
    name: "Japan",
  },
  {
    code: "KR",
    dial: "82",
    flag: "🇰🇷",
    name: "South Korea",
  },
  {
    code: "IN",
    dial: "91",
    flag: "🇮🇳",
    name: "India",
  },
  {
    code: "AU",
    dial: "61",
    flag: "🇦🇺",
    name: "Australia",
  },
  {
    code: "GB",
    dial: "44",
    flag: "🇬🇧",
    name: "United Kingdom",
  },
  {
    code: "US",
    dial: "1",
    flag: "🇺🇸",
    name: "United States",
  },
  {
    code: "FR",
    dial: "33",
    flag: "🇫🇷",
    name: "France",
  },
  {
    code: "DE",
    dial: "49",
    flag: "🇩🇪",
    name: "Germany",
  },
];

export const DEFAULT_COUNTRY = COUNTRIES[0];

export const countryByCode = (code) =>
  COUNTRIES.find((country) => country.code === code) || DEFAULT_COUNTRY;

const digitsOnly = (value) => (value || "").replace(/\D/g, "");

export function toE164(country, number) {
  const dial = country.dial;
  let digits = digitsOnly(number);
  if (digits.startsWith(dial) && digits.length > dial.length + 5) {
    digits = digits.slice(dial.length);
  }
  digits = digits.replace(/^0+/, "");
  if (digits) {
    return `+${dial}${digits}`;
  } else {
    return "";
  }
}

export function isValidPhone(country, number) {
  const national = toE164(country, number).slice(country.dial.length + 1);
  return national.length >= 6 && national.length <= 14;
}
