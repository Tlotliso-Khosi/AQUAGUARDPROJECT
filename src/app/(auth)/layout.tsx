import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication - AquaGuardAI",
  description: "Login or sign up to access your AquaGuardAI dashboard",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen relative overflow-hidden">
      {/* Background gradient - similar to hero section */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A3622] via-[#0A3622] to-[#072718] md:hidden"></div>

      {/* Image Section */}
      <div className="hidden md:flex md:w-1/2 relative">
        <Image
          src="/images/hero-4.webp"
          alt="Smart farm automation"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay with content */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A3622]/90 via-[#0A3622]/80 to-[#0A3622]/70 flex flex-col justify-between p-10">
          <div>
            <Link href="/" className="text-white font-bold text-2xl flex items-center gap-2">
              <Image src="/logo.svg" alt="AquaGuardAI Logo" width={100} height={100} />
              AquaGuardAI
            </Link>
          </div>
          <div className="max-w-md">
            <div className="inline-block mb-6">
              <span className="text-[#9EFF00] text-sm font-medium bg-[#1A4733] px-4 py-2 rounded-full">
                Smart Farming Solutions
              </span>
            </div>
            <blockquote className="border-l-4 border-primary pl-4 mb-6">
              <p className="text-white text-lg font-light italic">
                &ldquo;AquaGuardAI has revolutionized how we manage our farm resources.
                Our crop yield increased by 35% while reducing water usage by 40%.&rdquo;
              </p>
            </blockquote>
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-[#1A4733] flex items-center justify-center mr-3">
                <span className="text-primary font-bold">TM</span>
              </div>
              <div>
                <p className="text-white font-semibold">Thabo Molapo</p>
                <p className="text-white/80 text-sm">Farm Owner, Ha Abia</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-[#1A4733]">
            <p className="text-[#9EFF00] text-sm">
              Empowering <span className="font-bold">50+ farms</span> across Lesotho
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-6 py-12 lg:px-8 bg-transparent relative z-10">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex flex-col items-center">
            <Link href="/" className="md:hidden mb-8">
              <span className="text-primary font-bold text-2xl">AquaGuardAI</span>
            </Link>
            <div className="inline-block md:hidden mb-6">
              <span className="text-[#9EFF00] text-sm font-medium bg-[#1A4733] px-4 py-2 rounded-full">
                Smart Farming Solutions
              </span>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
} 