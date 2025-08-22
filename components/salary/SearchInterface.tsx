"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import type { SalaryFilter } from "@/lib/types/salary";

interface SearchInterfaceProps {
  onSearch: (query: string) => void;
  onFilter: (filters: SalaryFilter) => void;
  onSort: (sortBy: string) => void;
  availableGolongan: string[];
  availableKementerian: string[];
  availableKategori: string[];
}

export function SearchInterface({
  onSearch,
  onFilter,
  onSort,
  availableGolongan,
  availableKementerian,
  availableKategori,
}: SearchInterfaceProps) {
  const t = useTranslations("browse");
  const tCommon = useTranslations("common");

  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<SalaryFilter>({});
  const [selectedGolongan, setSelectedGolongan] = useState<string[]>([]);
  const [selectedKementerian, setSelectedKementerian] = useState<string[]>([]);
  const [selectedKategori, setSelectedKategori] = useState<string[]>([]);
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
  };

  const applyFilters = () => {
    const filters: SalaryFilter = {
      ...(selectedGolongan.length > 0 && { golongan: selectedGolongan }),
      ...(selectedKementerian.length > 0 && {
        kementerian: selectedKementerian,
      }),
      ...(selectedKategori.length > 0 && { kategori: selectedKategori }),
      ...((salaryMin || salaryMax) && {
        salaryRange: {
          min: salaryMin ? parseInt(salaryMin) : 0,
          max: salaryMax ? parseInt(salaryMax) : Infinity,
        },
      }),
    };

    setActiveFilters(filters);
    onFilter(filters);
  };

  const clearFilters = () => {
    setSelectedGolongan([]);
    setSelectedKementerian([]);
    setSelectedKategori([]);
    setSalaryMin("");
    setSalaryMax("");
    setActiveFilters({});
    onFilter({});
  };

  const removeFilter = (type: string, value?: string) => {
    if (type === "golongan" && value) {
      const newGolongan = selectedGolongan.filter((g) => g !== value);
      setSelectedGolongan(newGolongan);
    } else if (type === "kementerian" && value) {
      const newKementerian = selectedKementerian.filter((k) => k !== value);
      setSelectedKementerian(newKementerian);
    } else if (type === "kategori" && value) {
      const newKategori = selectedKategori.filter((k) => k !== value);
      setSelectedKategori(newKategori);
    } else if (type === "salaryRange") {
      setSalaryMin("");
      setSalaryMax("");
    }

    // Reapply filters after removal
    setTimeout(applyFilters, 0);
  };

  const hasActiveFilters =
    selectedGolongan.length > 0 ||
    selectedKementerian.length > 0 ||
    selectedKategori.length > 0 ||
    salaryMin ||
    salaryMax;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder={t("search")}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant={showFilters ? "default" : "outline"}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="w-4 h-4 mr-2" />
          {tCommon("filter")}
        </Button>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {selectedGolongan.map((golongan) => (
            <Badge
              key={golongan}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {golongan}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => removeFilter("golongan", golongan)}
              />
            </Badge>
          ))}
          {selectedKementerian.map((kementerian) => (
            <Badge
              key={kementerian}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {kementerian}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => removeFilter("kementerian", kementerian)}
              />
            </Badge>
          ))}
          {selectedKategori.map((kategori) => (
            <Badge
              key={kategori}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {kategori}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => removeFilter("kategori", kategori)}
              />
            </Badge>
          ))}
          {(salaryMin || salaryMax) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {salaryMin && `Min: ${parseInt(salaryMin).toLocaleString()}`}
              {salaryMin && salaryMax && " - "}
              {salaryMax && `Max: ${parseInt(salaryMax).toLocaleString()}`}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => removeFilter("salaryRange")}
              />
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear All
          </Button>
        </div>
      )}

      {/* Filter Panel */}
      {showFilters && (
        <div className="p-4 border rounded-lg bg-muted/50 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Golongan Filter */}
            <div className="space-y-2">
              <Label>{t("filters.golongan")}</Label>
              <Select
                onValueChange={(value) => {
                  if (!selectedGolongan.includes(value)) {
                    setSelectedGolongan([...selectedGolongan, value]);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Grade..." />
                </SelectTrigger>
                <SelectContent>
                  {availableGolongan
                    .filter((g) => !selectedGolongan.includes(g))
                    .map((golongan) => (
                      <SelectItem key={golongan} value={golongan}>
                        {golongan}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Kementerian Filter */}
            <div className="space-y-2">
              <Label>{t("filters.kementerian")}</Label>
              <Select
                onValueChange={(value) => {
                  if (!selectedKementerian.includes(value)) {
                    setSelectedKementerian([...selectedKementerian, value]);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Ministry..." />
                </SelectTrigger>
                <SelectContent>
                  {availableKementerian
                    .filter((k) => !selectedKementerian.includes(k))
                    .map((kementerian) => (
                      <SelectItem key={kementerian} value={kementerian}>
                        {kementerian}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Kategori Filter */}
            <div className="space-y-2">
              <Label>{t("filters.kategori")}</Label>
              <Select
                onValueChange={(value) => {
                  if (!selectedKategori.includes(value)) {
                    setSelectedKategori([...selectedKategori, value]);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Category..." />
                </SelectTrigger>
                <SelectContent>
                  {availableKategori
                    .filter((k) => !selectedKategori.includes(k))
                    .map((kategori) => (
                      <SelectItem key={kategori} value={kategori}>
                        {kategori}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort */}
            <div className="space-y-2">
              <Label>{t("sortBy")}</Label>
              <Select onValueChange={onSort}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="salaryHigh">
                    {t("sortOptions.salaryHigh")}
                  </SelectItem>
                  <SelectItem value="salaryLow">
                    {t("sortOptions.salaryLow")}
                  </SelectItem>
                  <SelectItem value="golongan">
                    {t("sortOptions.golongan")}
                  </SelectItem>
                  <SelectItem value="alphabetical">
                    {t("sortOptions.alphabetical")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Salary Range */}
          <div className="space-y-2">
            <Label>{t("filters.salaryRange")}</Label>
            <div className="flex gap-2 items-center">
              <Input
                placeholder="Min salary..."
                type="number"
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
                className="flex-1"
              />
              <span className="text-muted-foreground">to</span>
              <Input
                placeholder="Max salary..."
                type="number"
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={clearFilters}>
              Clear
            </Button>
            <Button onClick={applyFilters}>Apply Filters</Button>
          </div>
        </div>
      )}
    </div>
  );
}
