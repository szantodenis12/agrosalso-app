'use client';
import { Reception } from '@/types';
import { cn } from '@/lib/utils';

export function ReceptionPDF({ reception, className }: { reception: Reception, className?: string }) {
  return (
    <div id="reception-content" className={cn("bg-neutral-100 p-10 print:p-0 print:bg-white", className)}>
      <div className="max-w-[210mm] mx-auto bg-white shadow-2xl min-h-[297mm] p-[20mm] print:m-0 print:shadow-none relative border border-neutral-200 print:border-none flex flex-col text-[11pt] leading-[1.3] text-neutral-900" style={{ fontFamily: 'Arial, sans-serif' }}>
        
        <div className="text-center mb-8">
          <h1 className="font-extrabold text-[14pt] uppercase underline decoration-1 underline-offset-4">
            Proces-verbal de receptie, predare-primire si punere în functiune utilaj
          </h1>
          <p className="font-bold text-[12pt] mt-1">NR.{reception.number}/{reception.date}</p>
        </div>

        <div className="space-y-4 text-justify">
          <p>
            a produselor ce fac obiectul contractului <span className="font-bold underline">NR.{reception.contract.number}/{reception.contract.date}</span> încheiat între :
          </p>

          <ul className="list-disc pl-5 space-y-2">
            <li>
              delegatul furnizorului <span className="font-bold uppercase">{reception.delegat.furnizor}</span> reprezentant al <span className="font-bold uppercase underline">SC AGRO SALSO SRL</span>, C.U.I. {reception.emitent.cui}, {reception.emitent.regCom}, sediul {reception.emitent.address.toUpperCase()}
            </li>
            <li className="leading-tight">
              delegatul beneficiarului <span className="font-bold uppercase underline">{reception.delegat.beneficiar}</span>, reprezentant al <span className="font-bold uppercase underline">{reception.beneficiar.name}</span>, <span className="italic">reprezentată prin {reception.beneficiar.representative}</span>, cu sediul în {reception.beneficiar.address.toUpperCase()}, <span className="italic">înregistrată sub nr.{reception.beneficiar.regCom}, C.U.I {reception.beneficiar.cui}</span>
            </li>
          </ul>

          <p className="pt-2">
            Prezentul proces-verbal face parte integrantă din contractul nr.{reception.contract.number}/{reception.contract.date}, și s-a încheiat în 2 exemplare originale.
          </p>

          <p>
            Produsele predate, respectiv primite și recepționate, sunt conform FC. <span className="font-bold italic">Seria {reception.factura.series} nr.{reception.factura.number} din data de {reception.factura.date}</span>, și sunt în stare de funcțiune, fără defecțiuni, stare constatată de către beneficiar.
          </p>

          <p>
            Prin prezenta azi {reception.date}, s-au predat beneficiarului și s-au pus în funcțiune următoarele produse :
          </p>
        </div>

        {/* Table */}
        <div className="mt-4 border border-black overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-black text-[10pt] uppercase font-bold italic">
                <th className="border-r border-black p-2 text-center w-[60%]">Produs</th>
                <th className="border-r border-black p-2 text-center w-[15%]">Nr. bucăți produse</th>
                <th className="p-2 text-center">VALOARE CU TVA</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-black font-bold uppercase text-[10pt]">
                <td className="border-r border-black p-2">
                  <p>{reception.obiect.name}</p>
                  <p className="mt-1">{reception.productName} SERIA {reception.obiect.serialNumber}</p>
                </td>
                <td className="border-r border-black p-2 text-center">{reception.obiect.quantity}</td>
                <td className="p-2 text-center">{reception.obiect.totalPriceWithVat}</td>
              </tr>
              {/* Spacer rows */}
              {[...Array(8)].map((_, i) => (
                <tr key={i} className="border-b border-black h-8">
                  <td className="border-r border-black" />
                  <td className="border-r border-black" />
                  <td />
                </tr>
              ))}
              <tr className="font-bold text-[10pt] uppercase">
                <td className="border-r border-black p-2 text-left">VALOARE TOTALA</td>
                <td className="border-r border-black" />
                <td className="p-2 text-center">{reception.obiect.totalPriceWithVat}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-auto pt-16 grid grid-cols-2 text-center font-bold">
          <div>
            <p className="uppercase mb-8">FURNIZOR</p>
            <p className="uppercase italic text-[12pt]">{reception.emitent.name}</p>
          </div>
          <div>
            <p className="uppercase mb-8">BENEFICIAR</p>
            <p className="uppercase text-[12pt]">{reception.beneficiar.name}</p>
            <p className="uppercase text-[11pt]">{reception.beneficiar.representative}</p>
          </div>
        </div>

      </div>
    </div>
  );
}
