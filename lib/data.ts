import type {
  SalaryGolongan,
  TunjanganKinerja,
  OfficialSalary,
} from "./types/salary";

export async function getGolonganData(): Promise<{
  golongan: SalaryGolongan[];
}> {
  const response = await fetch("/data/salary/pns/golongan.json");
  if (!response.ok) {
    throw new Error("Failed to fetch golongan data");
  }
  return response.json();
}

export async function getTunjanganKinerjaData(): Promise<{
  tunjanganKinerja: TunjanganKinerja[];
}> {
  const response = await fetch("/data/salary/pns/tunjangan-kinerja.json");
  if (!response.ok) {
    throw new Error("Failed to fetch tunjangan kinerja data");
  }
  return response.json();
}

export async function getOfficialSalaryData(): Promise<{
  officials: OfficialSalary[];
}> {
  const response = await fetch("/data/salary/officials/nasional.json");
  if (!response.ok) {
    throw new Error("Failed to fetch official salary data");
  }
  return response.json();
}

export function findGolonganById(
  data: SalaryGolongan[],
  id: string,
): SalaryGolongan | undefined {
  return data.find((item) => item.id === id);
}

export function filterTunjanganByKementerian(
  data: TunjanganKinerja[],
  kementerian: string,
): TunjanganKinerja[] {
  return data.filter((item) => item.kementerian.id === kementerian);
}

export function getTunjanganByGolonganAndJabatan(
  data: TunjanganKinerja[],
  golongan: string,
  jabatan: string,
): TunjanganKinerja | undefined {
  return data.find(
    (item) => item.golongan.includes(golongan) && item.jabatan.id === jabatan,
  );
}
