import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number,
  locale: string = "id-ID",
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(number: number, locale: string = "id-ID"): string {
  return new Intl.NumberFormat(locale).format(number);
}

export function calculateSalary(
  gajiPokok: number,
  tunjanganKinerja: number = 0,
  tunjanganLain: number = 0,
) {
  const totalBruto = gajiPokok + tunjanganKinerja + tunjanganLain;

  // Estimasi potongan (PPh21, asuransi, dll)
  const pph21 = totalBruto > 4500000 ? totalBruto * 0.05 : 0;
  const asuransi = totalBruto * 0.01;
  const totalPotongan = pph21 + asuransi;

  return {
    gajiPokok,
    tunjanganKinerja,
    tunjanganLainnya: tunjanganLain,
    totalBruto,
    potongan: {
      pph21,
      asuransi,
      lainnya: 0,
      total: totalPotongan,
    },
    totalNetto: totalBruto - totalPotongan,
  };
}
