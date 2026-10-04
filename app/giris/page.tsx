import type { Metadata } from "next";
import { LoginForm } from "@/components/login-form";
import { Logo } from "@/components/logo";
import { card } from "@/components/ui";

export const metadata: Metadata = {
  title: "Giriş",
  robots: { index: false, follow: false },
};

export default function Login() {
  return (
    <main id="icerik" className="flex flex-1 items-center justify-center px-4 py-12">
      <div className={`${card} w-full max-w-sm p-6`}>
        <Logo />
        <h1 className="mt-6 text-xl font-semibold">Panele giriş</h1>
        <p className="mt-1 text-sm text-muted">
          Panel yalnızca sahibine açık. Sunucuda <code className="tnum">KOVAN_ADMIN_KEY</code> olarak kayıtlı anahtarı
          girin.
        </p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
