"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { SalaryCharts } from "@/components/salary/SalaryCharts";
import { PageWrapper } from "@/components/layout/PageLayout";
import type { SalaryGolongan, TunjanganKinerja } from "@/lib/types/salary";

interface AnalysisPageClientProps {
  locale: string;
}

export default function AnalysisPageClient({
  locale,
}: AnalysisPageClientProps) {
  const t = useTranslations("analysis");
  const tCommon = useTranslations("common");

  const [golonganData, setGolonganData] = useState<SalaryGolongan[]>([]);
  const [tunjanganData, setTunjanganData] = useState<TunjanganKinerja[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [golonganRes, tunjanganRes] = await Promise.all([
          fetch("/data/salary/pns/golongan.json"),
          fetch("/data/salary/pns/tunjangan-kinerja.json"),
        ]);

        const golonganData = await golonganRes.json();
        const tunjanganData = await tunjanganRes.json();

        setGolonganData(golonganData.golongan);
        setTunjanganData(tunjanganData.tunjanganKinerja);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <PageWrapper title={tCommon("loading")} subtitle="">
        <div className="text-center">
          <div className="text-lg">{tCommon("loading")}</div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title={t("title")} subtitle={t("subtitle")}>
      <SalaryCharts
        golonganData={golonganData}
        tunjanganData={tunjanganData}
        locale={locale}
      />
    </PageWrapper>
  );
}
