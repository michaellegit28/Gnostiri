import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import { getCurrentUser } from "@/lib/server-auth";
import PrintCertificateButton from "@/components/PrintCertificateButton";

export const dynamic = "force-dynamic";

export default async function CertificatePage({ params }: { params: { certificateId: string } }) {
  const user = await getCurrentUser(); if (!user) notFound();
  const certificate = await prisma.certificate.findFirst({ where: { id: params.certificateId, userId: user.id, domain: "university" }, include: { course: true } });
  if (!certificate) notFound();
  return <main className="min-h-screen bg-slate-950 p-6 text-slate-100 print:bg-white"><div className="mx-auto max-w-4xl border-8 border-double border-amber-500 bg-[#FDFBF7] p-8 text-center text-slate-900 md:mt-12 md:p-16 print:mt-0"><p className="text-sm uppercase tracking-[0.3em] text-amber-700">Gnostiri · Certificate of Completion</p><h1 className="mt-10 font-serif text-4xl font-bold md:text-5xl">This certifies that</h1><p className="mt-8 text-3xl font-semibold">{user.name || user.email}</p><p className="mx-auto mt-6 max-w-2xl text-lg">has completed the course</p><h2 className="mt-3 font-serif text-3xl font-bold text-amber-800">{certificate.course.title}</h2><p className="mt-10 text-slate-600">Issued {certificate.issuedAt.toLocaleDateString("en", { year: "numeric", month: "long", day: "numeric" })}</p><PrintCertificateButton /></div></main>;
}
