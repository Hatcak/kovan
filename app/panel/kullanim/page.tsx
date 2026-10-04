import type { Metadata } from "next";
import { connection } from "next/server";
import { CallTable } from "@/components/call-table";
import { ws } from "@/lib/store";

export const metadata: Metadata = { title: "Kullanım" };

export default async function Usage() {
  await connection();
  const { log } = ws();
  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">Kullanım</h1>
      <p className="mt-2 text-muted">
        Son <span className="tnum">500</span> çağrı. Başarısız çağrılar ücretlendirilmez; düşülen kredi iade edilir.
      </p>
      <div className="mt-6">
        <CallTable rows={log} empty="Henüz çağrı yok." />
      </div>
    </>
  );
}
