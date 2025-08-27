import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Error Display */}
        <div className="space-y-4">
          <h1 className="text-8xl font-bold text-blue-600">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-gray-600">
            Halaman yang Anda cari tidak dapat ditemukan.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <Link href="/id">
            <Button className="w-full flex items-center justify-center gap-2">
              <Home className="w-4 h-4" />
              Kembali ke Beranda
            </Button>
          </Link>
          
          <Link href="/id/browse">
            <Button variant="outline" className="w-full">
              Jelajahi Data
            </Button>
          </Link>
        </div>

        {/* Footer */}
        <div className="text-sm text-gray-500 pt-6">
          <span className="font-semibold">Public Salary</span> by{" "}
          <span className="font-semibold text-gray-800">ForPublic</span>
          <span className="text-red-600">.id</span>
        </div>
      </div>
    </div>
  );
}