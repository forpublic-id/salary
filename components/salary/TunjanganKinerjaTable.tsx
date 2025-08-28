"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { ArrowUpDown, ExternalLink, FileText } from "lucide-react";

interface MinistryStats {
  kementerian: string;
  kode: string;
  median: number;
  lowest: number;
  highest: number;
  average: number;
  count: number;
  regulations: string[];
}

interface TunjanganKinerjaTableProps {
  data: MinistryStats[];
  locale: string;
}

type SortField = "kementerian" | "median" | "lowest" | "highest" | "average";
type SortDirection = "asc" | "desc";

export function TunjanganKinerjaTable({
  data,
  locale,
}: TunjanganKinerjaTableProps) {
  const t = useTranslations("tunjanganKinerja");
  const [sortField, setSortField] = useState<SortField>("median");
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
      setSortDirection("desc");
    }
  };

  const sortedData = [...data].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    if (sortField === "kementerian") {
      aValue = a.kementerian;
      bValue = b.kementerian;
    } else {
      aValue = a[sortField];
      bValue = b[sortField];
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

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <SortableHeader field="kementerian">
                  {t("table.ministry")}
                </SortableHeader>
                <SortableHeader field="median">
                  {t("table.median")}
                </SortableHeader>
                <SortableHeader field="lowest">
                  {t("table.lowest")}
                </SortableHeader>
                <SortableHeader field="highest">
                  {t("table.highest")}
                </SortableHeader>
                <SortableHeader field="average">
                  {t("table.average")}
                </SortableHeader>
                <TableHead>{t("table.regulations")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((ministry) => (
                <TableRow key={ministry.kode} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    <Link
                      href={`/${locale}/tunjangan-kinerja/${ministry.kode.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
                      className="block space-y-1 hover:text-blue-600 transition-colors"
                    >
                      <div className="font-semibold text-gray-900 hover:text-blue-600">
                        {ministry.kementerian}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {ministry.kode}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {ministry.count} {t("table.positions")}
                        </span>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell className="font-semibold text-blue-600">
                    {formatCurrency(ministry.median)}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {formatCurrency(ministry.lowest)}
                  </TableCell>
                  <TableCell className="text-green-600 font-semibold">
                    {formatCurrency(ministry.highest)}
                  </TableCell>
                  <TableCell className="text-gray-900">
                    {formatCurrency(ministry.average)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {ministry.regulations.map((regulation, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs justify-start"
                        >
                          <FileText className="h-3 w-3 mr-1" />
                          {regulation}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Button>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
