'use client';
import Image from 'next/image';
import { Certificate } from '@/types';
import { cn } from '@/lib/utils';

export function CertificatePDF({ certificate, className }: { certificate: Certificate, className?: string }) {
  return (
    <div 
      id="certificate-content"
      className={cn(
        "max-w-[210mm] mx-auto bg-white shadow-2xl min-h-[297mm] p-[20mm] print:m-0 print:shadow-none relative border border-neutral-200 print:border-none flex flex-col text-[11pt] leading-[1.5] text-black",
        className
      )}
      style={{ fontFamily: 'Arial, sans-serif' }}
    >
      {/* Header */}
      <div className="flex flex-col mb-10">
        <h2 className="font-extrabold uppercase text-[14pt]">SC AGRO SALSO SRL</h2>
        <div className="text-[11pt] font-bold">
          <p>J05/1081/2012</p>
          <p>CUI RO30425879</p>
          <p>Str. Aleea Petre Paulescu, bl.Q6, Et4, ap U</p>
          <p>Salonta jud Bihor</p>
          <p>P.1. Madaras nr 409 jud Bihor</p>
        </div>
      </div>

      <div className="text-center mb-10">
        <h1 className="font-extrabold text-[16pt] uppercase underline">CERTIFICAT DE CONFORMITATE</h1>
        <p className="font-bold text-[14pt] mt-1">NR.{certificate.number}/{certificate.date}</p>
      </div>

      {/* Body */}
      <div className="space-y-8 text-justify">
        <section>
          <h3 className="font-extrabold underline block">1. Emitent</h3>
          <p>
            <span className="font-extrabold">SC AGRO SALSO SRL</span>, cu sediul in <span className="font-extrabold">municipiul Salonta ,Str Aleea Petre Paulescu Bl Q6 Et4 Ap U jud Bihor</span> ,inregistrata la oficiul Registrului Comertului Bihor sub nr.<span className="font-extrabold">J05/1081/2012</span>,<span className="font-extrabold">CUI RO 30425879</span>,punct de lucru <span className="font-extrabold">Madaras nr 409,jud Bihor</span>, <span className="font-extrabold">CONT {certificate.emitent.iban}</span> deschis la <span className="font-extrabold">{certificate.emitent.bank}</span>, reprezentata prin <span className="font-extrabold">{certificate.emitent.representative}</span> ,in calitate de <span className="font-extrabold">VANZATOR</span>
          </p>
        </section>

        <section>
          <h3 className="font-extrabold underline block">2. Beneficiar</h3>
          <p className="italic">
            <span className="font-extrabold not-italic uppercase">{certificate.beneficiar.name}</span>, cu sediul în <span className="font-extrabold not-italic uppercase">{certificate.beneficiar.address}</span>, inregistrata sub nr. <span className="font-extrabold not-italic uppercase">{certificate.beneficiar.regCom}</span>,<span className="font-extrabold not-italic uppercase">C.U.I {certificate.beneficiar.cui}</span>,<span className="font-extrabold not-italic uppercase">CONT {certificate.beneficiar.iban}</span>, deschis la banca <span className="font-extrabold not-italic uppercase">{certificate.beneficiar.bank}</span>, reprezentată prin <span className="font-extrabold not-italic uppercase">{certificate.beneficiar.representative}</span>, având funcția de {certificate.beneficiar.position}, în calitate de, <span className="font-extrabold not-italic uppercase">CUMPARATOR</span>
          </p>
        </section>

        <section>
          <h3 className="font-extrabold underline block">3. Obiect :</h3>
          <p>
            - <span className="font-extrabold uppercase">{certificate.obiect.name}</span> SERIA <span className="font-extrabold uppercase">{certificate.obiect.serialNumber}</span>
          </p>
        </section>

        <section>
          <h3 className="font-extrabold underline block">4. Seria factura <span className="lowercase">{certificate.factura.series}</span> nr.<span className="font-extrabold">{certificate.factura.number}</span> din <span className="font-extrabold">{certificate.factura.date}</span></h3>
        </section>

        <section>
          <p>
            5. <span className="font-extrabold">SC AGRO SALSO SRL</span> ,<span className="underline">asiguram , garantam si declaram</span> pe propria raspundere conform prevederilor art.5 din HCM nr1022/2002,ca <span className="underline">produsele ,inscrise in factura fiscala</span> la care se refera aceasta declaratie ,nu pun in pericol viata ,sanatatea ,securitatea muncii ,nu au impact negativ si sunt in conformitate cu standardele nationale si internationale din domeniu.
          </p>
        </section>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-20 flex justify-between items-start">
        <div className="text-center font-extrabold">
          <p>Madaras</p>
          <p>{certificate.date}</p>
        </div>
        <div className="text-center font-extrabold">
          <p>SC AGRO SALSO SRL</p>
        </div>
      </div>
    </div>
  );
}
