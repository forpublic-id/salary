"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ArrowUpDown, Award } from "lucide-react";
import type { TunjanganKinerja } from "@/lib/types/salary";

interface MinistryDetailTableProps {
  data: TunjanganKinerja[];
  locale: string;
}

type SortField = "jabatan" | "nominal" | "kategori";
type SortDirection = "asc" | "desc";

export function MinistryDetailTable({
  data,
  locale,
}: MinistryDetailTableProps) {
  const t = useTranslations("tunjanganKinerja");
  const [sortField, setSortField] = useState<SortField>("nominal");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(locale === "id" ? "id-ID" : "en-US", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection(field === "nominal" ? "desc" : "asc");
    }
  };

  const sortedData = [...data].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    if (sortField === "jabatan") {
      aValue = a.jabatan[locale as "id" | "en"];
      bValue = b.jabatan[locale as "id" | "en"];
    } else if (sortField === "nominal") {
      aValue = a.nominal;
      bValue = b.nominal;
    } else {
      aValue = a.kategori;
      bValue = b.kategori;
    }

    if (typeof aValue === "string") {
      const comparison = aValue.localeCompare(bValue as string);
      return sortDirection === "asc" ? comparison : -comparison;
    } else {
      const comparison = aValue - (bValue as number);
      return sortDirection === "asc" ? comparison : -comparison;
    }
  });

  const SortableHeader = ({
    field,
    children,
  }: {
    field: SortField;
    children: React.ReactNode;
  }) => (
    <TableHead
      className="cursor-pointer hover:bg-gray-50 select-none"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-2">
        {children}
        <ArrowUpDown className="h-4 w-4" />
      </div>
    </TableHead>
  );

  const getCategoryColor = (kategori: string) => {
    switch (kategori) {
      case "struktural":
        return "bg-blue-100 text-blue-800";
      case "fungsional":
        return "bg-green-100 text-green-800";
      case "pelaksana":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryIcon = (kategori: string) => {
    switch (kategori) {
      case "struktural":
        return "🏢";
      case "fungsional":
        return "🔬";
      case "pelaksana":
        return "⚙️";
      default:
        return "📋";
    }
  };

  // Add ranking based on sorted nominal (highest first)
  const rankedData = sortedData.map((item, index) => ({
    ...item,
    rank:
      data.length > 1
        ? sortField === "nominal" && sortDirection === "desc"
          ? index + 1
          : null
        : null,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          {t("detail.positionBreakdown")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16 text-center">
                  {t("detail.rank")}
                </TableHead>
                <SortableHeader field="jabatan">
                  {t("detail.position")}
                </SortableHeader>
                <SortableHeader field="kategori">
                  {t("detail.category")}
                </SortableHeader>
                <TableHead>{t("detail.eligibleGrades")}</TableHead>
                <SortableHeader field="nominal">
                  {t("detail.allowanceAmount")}
                </SortableHeader>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rankedData.map((position, index) => (
                <TableRow key={position.id} className="hover:bg-gray-50">
                  <TableCell className="text-center font-mono text-lg">
                    {position.rank ? (
                      <div className="flex items-center justify-center">
                        {position.rank <= 3 && (
                          <span className="mr-1">
                            {position.rank === 1
                              ? "🥇"
                              : position.rank === 2
                                ? "🥈"
                                : "🥉"}
                          </span>
                        )}
                        <span
                          className={
                            position.rank <= 3
                              ? "font-bold text-yellow-600"
                              : "text-gray-600"
                          }
                        >
                          {position.rank}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>

                  <TableCell className="font-medium">
                    <div className="space-y-1">
                      <div className="font-semibold text-gray-900">
                        {position.jabatan[locale as "id" | "en"]}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {position.id}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge
                      className={`${getCategoryColor(position.kategori)} border-0`}
                    >
                      <span className="mr-1">
                        {getCategoryIcon(position.kategori)}
                      </span>
                      {locale === "id"
                        ? position.kategori === "struktural"
                          ? "Struktural"
                          : position.kategori === "fungsional"
                            ? "Fungsional"
                            : "Pelaksana"
                        : position.kategori === "struktural"
                          ? "Structural"
                          : position.kategori === "fungsional"
                            ? "Functional"
                            : "Implementing"}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {position.golongan.map((grade) => (
                        <Badge
                          key={grade}
                          variant="outline"
                          className="text-xs"
                        >
                          {grade}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>

                  <TableCell className="font-semibold">
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">
                        {formatCurrency(position.nominal)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {t("detail.monthly")}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Summary footer */}
        <div className="border-t bg-gray-50 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-gray-600">
                {t("detail.totalPositions")}
              </div>
              <div className="text-lg font-bold">{data.length}</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-600">
                {t("detail.averageAllowance")}
              </div>
              <div className="text-lg font-bold text-green-600">
                {formatCurrency(
                  Math.round(
                    data.reduce((sum, pos) => sum + pos.nominal, 0) /
                      data.length,
                  ),
                )}
              </div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-600">
                {t("detail.allowanceRange")}
              </div>
              <div className="text-sm">
                <div className="text-green-600 font-medium">
                  {formatCurrency(Math.min(...data.map((pos) => pos.nominal)))}
                </div>
                <div className="text-xs text-gray-500">to</div>
                <div className="text-blue-600 font-medium">
                  {formatCurrency(Math.max(...data.map((pos) => pos.nominal)))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
