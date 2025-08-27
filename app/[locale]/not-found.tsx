import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Home } from "lucide-react";

interface NotFoundProps {
  params: {
    locale: string;
  };
}

export default function LocalizedNotFound({ params }: NotFoundProps) {
  const isIndonesian = params?.locale === "id";
  
  const content = {
    title: isIndonesian ? "Halaman Tidak Ditemukan" : "Page Not Found",
    description: isIndonesian 
      ? "Halaman yang Anda cari tidak dapat ditemukan."
      : "The page you are looking for could not be found.",
    goHome: isIndonesian ? "Kembali ke Beranda" : "Go to Homepage",
    browseData: isIndonesian ? "Jelajahi Data" : "Browse Data",
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Error Display */}
        <div className="space-y-4">
          <h1 className="text-8xl font-bold text-blue-600">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800">
            {content.title}
          </h2>
          <p className="text-gray-600">
            {content.description}
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <Link href={`/${params?.locale || 'id'}`}>
            <Button className="w-full flex items-center justify-center gap-2">
              <Home className="w-4 h-4" />
              {content.goHome}
            </Button>
          </Link>
          
          <Link href={`/${params?.locale || 'id'}/browse`}>
            <Button variant="outline" className="w-full">
              {content.browseData}
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