'use client';
import { Warranty } from '@/types';
import { cn } from '@/lib/utils';

export function WarrantyPDF({ warranty, className }: { warranty: Warranty, className?: string }) {
  return (
    <div id="warranty-content" className={cn("bg-neutral-100 p-10 print:p-0 print:bg-white", className)}>
      <div className="max-w-[210mm] mx-auto bg-white shadow-2xl min-h-[297mm] p-[20mm] print:m-0 print:shadow-none relative border border-neutral-200 print:border-none flex flex-col text-[11pt] leading-[1.5] text-neutral-900" style={{ fontFamily: 'Arial, sans-serif' }}>
        
        {/* Header Header */}
        <div className="text-left mb-10 font-bold uppercase text-[9pt] space-y-1">
          <p>{warranty.emitent.name}</p>
          <p>{warranty.emitent.regCom}</p>
          <p>CUI {warranty.emitent.cui}</p>
          <p>{warranty.emitent.address}</p>
          <p>P.1.{warranty.emitent.workPoint}</p>
        </div>

        <div className="text-center mb-10">
          <h1 className="font-extrabold text-[16pt] uppercase underline">CERTIFICAT DE GARANTIE</h1>
          <p className="font-bold text-[12pt] mt-1 uppercase">NR.{warranty.number}/{warranty.date}</p>
        </div>

        <div className="space-y-6 text-justify">
          <section>
            <h3 className="font-extrabold mb-1">1. Emitent</h3>
            <p>
              <span className="font-bold underline uppercase">{warranty.emitent.name}</span>, cu sediul in <span className="font-bold">{warranty.emitent.address}</span>, inregistrata la oficiul Registrului Comertului Bihor sub nr.<span className="font-bold">{warranty.emitent.regCom}</span>, CUI <span className="font-bold">{warranty.emitent.cui}</span>, punct de lucru <span className="font-bold">{warranty.emitent.workPoint}</span>, CONT <span className="font-bold">{warranty.emitent.iban}</span> deschis la <span className="font-bold uppercase underline">{warranty.emitent.bank}</span> Filiala Salonta, reprezentata prin <span className="font-bold underline">{warranty.emitent.representative}</span>, in calitate de <span className="font-bold uppercase italic">VANZATOR</span>.
            </p>
          </section>

          <section>
            <h3 className="font-extrabold mb-1">2. Beneficiar</h3>
            <p>
              <span className="font-bold underline uppercase tracking-tight">{warranty.beneficiar.name}</span>, cu sediul in <span className="font-bold uppercase">{warranty.beneficiar.address}</span>, inregistrata sub nr. <span className="font-bold uppercase underline">{warranty.beneficiar.regCom}</span>, C.U.I <span className="font-bold uppercase underline">{warranty.beneficiar.cui}</span>, CONT <span className="font-bold uppercase underline">{warranty.beneficiar.iban}</span>, deschis la banca <span className="font-bold uppercase underline">{warranty.beneficiar.bank}</span>, reprezentată prin <span className="font-bold underline uppercase">{warranty.beneficiar.representative}</span>, în calitate de <span className="font-bold uppercase underline">CUMPARATOR</span>.
            </p>
          </section>

          <section>
            <h3 className="font-extrabold mb-1">3. Obiect:</h3>
            <p className="font-bold uppercase">
              - {warranty.obiect.name} SERIA {warranty.obiect.serialNumber}
            </p>
          </section>

          <section>
            <p className="flex items-center gap-2">
                <span className="font-extrabold text-[12pt]">4. Seria factura</span>
                <span className="font-bold underline uppercase">{warranty.factura.series} nr.{warranty.factura.number} din {warranty.factura.date}</span>
            </p>
          </section>

          <section className="space-y-4">
            <p>
                <span className="font-extrabold">5. {warranty.emitent.name} ne obligam</span>, ca in <span className="font-extrabold underline italic">perioada de garantie</span>, respectiv <span className="font-extrabold underline">{warranty.garantie.startDate}-{warranty.garantie.endDate}</span>, sa inlocuim produsele cu defectiuni tehnice.
            </p>
            <p className="font-bold leading-normal">
                Nu se acorda garantie pentru defectele cauzate de utilizarea defectuoasa a utilajului precum si in cazul deteriorarii sau pierderii certificatului de garantie.
            </p>
          </section>
        </div>

        <div className="mt-20 grid grid-cols-2">
          <div className="text-left font-bold">
            <p>{warranty.emitent.workPoint.split(',')[0]}</p>
            <p>{warranty.date}</p>
          </div>
          <div className="text-center font-bold">
            <p className="mb-10 uppercase tracking-widest">{warranty.emitent.name}</p>
          </div>
        </div>

      </div>
    </div>
  );
}
