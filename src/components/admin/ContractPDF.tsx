'use client';
import { Contract } from '@/types';
import { cn } from '@/lib/utils';

export function ContractPDF({ contract, className }: { contract: Contract, className?: string }) {
  const pageClass = "max-w-[210mm] mx-auto bg-white shadow-2xl min-h-[297mm] p-[20mm] print:m-0 print:shadow-none relative border border-neutral-200 print:border-none flex flex-col text-[10.5pt] leading-[1.5] text-neutral-900 mb-10 last:mb-0";
  const fontFamily = { fontFamily: 'Arial, sans-serif' };

  return (
    <div id="contract-content" className={cn("bg-neutral-100 p-10 print:p-0 print:bg-white", className)}>
      
      {/* PAGINA 1 */}
      <div className={cn(pageClass, "contract-page")} style={fontFamily}>
        <div className="text-center mb-10">
          <h1 className="font-extrabold text-[14pt] uppercase underline">Contract VANZARE -CUMPARARE</h1>
          <p className="font-bold text-[12pt] mt-1 uppercase">NR.{contract.number}/{contract.date}</p>
        </div>

        <div className="space-y-6 text-justify">
          <section>
            <h3 className="font-extrabold underline block uppercase mb-2">I. Părțile contractante</h3>
            <div className="space-y-4">
              <p>
                1.1 <span className="font-extrabold underline">Agro Salso SRL</span>, cu sediul in <span className="font-extrabold">Salonta, str. Al. P. Paulescu, bl. Q6, ap. U, jud. Bihor</span>, inmatriculată sub nr. <span className="font-extrabold">J5/1081/2012</span>, <span className="font-extrabold">C.U.I. 30425879</span>, <span className="font-extrabold">CONT {contract.emitent.iban}</span> deschis la <span className="font-extrabold uppercase">{contract.emitent.bank}</span>, reprezentată prin administrator <span className="font-extrabold underlined">{contract.emitent.representative}</span>, în calitate de <span className="font-extrabold uppercase italic">furnizor</span>,
              </p>
              <p className="text-center font-bold italic">și</p>
              <p>
                1.2. <span className="font-extrabold underlined uppercase">{contract.beneficiar.name}</span>, <span className="italic">cu sediul în <span className="font-extrabold not-italic uppercase">{contract.beneficiar.address}</span>, inregistrata sub nr. <span className="font-extrabold not-italic uppercase underline">{contract.beneficiar.regCom}</span>, <span className="font-extrabold not-italic uppercase">C.U.I {contract.beneficiar.cui}</span>, <span className="font-extrabold not-italic uppercase">CONT {contract.beneficiar.iban}</span>, deschis la banca <span className="font-extrabold not-italic uppercase underline">{contract.beneficiar.bank}</span>, reprezentată prin <span className="font-extrabold not-italic underline uppercase">{contract.beneficiar.representative}</span>, având funcția de {contract.beneficiar.position}, în calitate de <span className="font-extrabold uppercase italic">beneficiar</span></span>,
              </p>
              <p>au încheiat prezentul contract de VANZARE-CUMPARARE în următoarele condiții:</p>
            </div>
          </section>

          <section>
            <h3 className="font-extrabold underline block uppercase mb-2">II. Obiectul contractului</h3>
            <p className="mb-4">2.1 Furnizorul se obligă să vândă, iar beneficiarul să cumpere următoarele:</p>
            <p className="font-bold mb-4">- {contract.obiect.name} SERIA {contract.obiect.serialNumber}</p>
            
            <table className="w-full border-collapse border border-black text-[9pt]">
              <thead>
                <tr className="bg-neutral-50">
                  <th className="border border-black p-2 text-left">Nr.</th>
                  <th className="border border-black p-2 text-left">Denumire Produs</th>
                  <th className="border border-black p-2 text-center">U.M.</th>
                  <th className="border border-black p-2 text-center">Cantitate</th>
                  <th className="border border-black p-2 text-right">Preț unitar</th>
                  <th className="border border-black p-2 text-right">Preț cu TVA</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black p-2 text-center">1</td>
                  <td className="border border-black p-2">
                    <span className="font-bold uppercase">{contract.obiect.name} SERIA {contract.obiect.serialNumber}</span>
                  </td>
                  <td className="border border-black p-2 text-center">B</td>
                  <td className="border border-black p-2 text-center">{contract.obiect.quantity}</td>
                  <td className="border border-black p-2 text-right font-bold">{contract.obiect.unitPrice.toLocaleString()}</td>
                  <td className="border border-black p-2 text-right font-bold">{contract.obiect.totalPriceWithVat.toLocaleString()}</td>
                </tr>
                <tr className="font-extrabold">
                  <td colSpan={5} className="border border-black p-2 uppercase">TOTAL</td>
                  <td className="border border-black p-2 text-right">{contract.obiect.totalPriceWithVat.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
            <div className="mt-4 space-y-2">
              <p>2.2 <span className="underline italic">Cheltuielile de transport a mărfurilor se suportă de</span> către beneficiar.</p>
              <p>2.3 <span className="underline italic">Transportul produselor</span> se va face de către beneficiar prin ridicarea mărfurilor de la adresa convenită de părți.</p>
            </div>
          </section>

          <section>
            <h3 className="font-extrabold underline block uppercase mb-2">III. Recepția și acceptarea mărfurilor</h3>
            <p>
              3.1 <span className="underline italic">Recepția mărfurilor va fi facuta de o comisie de recepție convenită de părți și formată din</span>:
              <br />- delegat al furnizorului: <span className="font-bold underline uppercase">{contract.emitent.representative}</span>
              <br />- delegat al beneficiarului: <span className="font-bold underline uppercase">{contract.beneficiar.representative}</span>
              <br />Comisia de recepție încheie un proces-verbal care va face parte integrantă din prezentul contract. La data si locul incheierii procesului verbal de predare-primire si punere in functiune utilaj care constituie obiectul prezentului contract, dreptul de proprietate si riscurile se transfera beneficiarului.
            </p>
          </section>

          <section>
            <h3 className="font-extrabold underline block uppercase mb-2">IV. Durata contractului</h3>
            <p>4.1 Prezentul contract intră în vigoare la data semnării lui de către părți și încetează odată cu îndeplinirea tuturor obligațiilor contractuale de către ambele părți.</p>
          </section>
        </div>
        <div className="mt-auto text-[8pt] text-neutral-400 text-right">Pagina 1 / 3</div>
      </div>

      {/* PAGINA 2 */}
      <div className={cn(pageClass, "contract-page")} style={fontFamily}>
        <div className="space-y-6 text-justify">
          <section>
            <h3 className="font-extrabold underline block uppercase mb-2">V. Garanții</h3>
            <p>5.1 Furnizorul garantează că mărfurile care fac obiectul prezentului contract sunt în concordanță cu standardele de calitate în vigoare.</p>
            <p>5.2 Perioada de garanție este de <span className="font-bold">{contract.termeni.warrantyMonths} luni</span> pentru viciile ascunse ale bunurilor vândute, în condițiile utilizării normale a acestora de către CUMPARATOR.</p>
          </section>

          <section>
            <h3 className="font-extrabold underline block uppercase mb-2">VI. Obligațiile părților</h3>
            <div className="space-y-4">
              <div>
                <p className="font-bold underline italic mb-2">6.1 Obligațiile furnizorului sunt:</p>
                <ul className="list-disc pl-8 space-y-1">
                  <li>să vândă produsele ce reprezintă obiectul prezentului contract;</li>
                  <li>să însoțească mărfurile cu factură și certificat de calitate/conformitate, conform legislației în vigoare;</li>
                  <li>furnizorul este îndreptățit a refuza onorarea comenzilor clientului ulterior emiterii unei facturi neachitate de beneficiar.</li>
                </ul>
              </div>
              <div>
                <p className="font-bold underline italic mb-2">6.2 Obligațiile beneficiarului sunt următoarele:</p>
                <ul className="list-disc pl-8 space-y-1">
                  <li>să achite prețul produsului ce reprezintă obiectul prezentului contract până în data de <span className="font-bold">{contract.termeni.paymentDate}</span>;</li>
                  <li>să preia și să recepționeze marfa conform prevederilor paragrafului III, art.3.1 din prezentul contract;</li>
                  <li>să achite cheltuielile de transport și să asigure transportul mărfurilor achiziționate conform condițiilor stabilite în prezentul contract;</li>
                  <li>să plătească integral prețul mărfurilor, pana in data de {contract.termeni.paymentDate};</li>
                  <li>să plătească furnizorului penalități de întârziere de 0,1% din suma restantă, pentru fiecare zi de întârziere, în cazul în care nu achită prețul facturat în termen de 15 zile calendaristice de la data scadentă a emiterii facturii. Această obligație intră în vigoare în prima zi următoare scadenței plății, fără a fi necesară punerea în întârziere sau notificare. Penalitățile astfel stabilite curg până în ziua efectuării plății, chiar dacă suma penalităților ar depăși valoarea restului de plată.</li>
                  <li>să utilizeze în condiții normale bunurile cumpărate, pe toată perioada de garanție acordată de VANZATOR.</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h3 className="font-extrabold underline block uppercase mb-2">VII. Plata prețului</h3>
            <p>7.1 Prețul este conform facturii emise de către furnizor serie <span className="font-bold uppercase">{contract.termeni.invoiceSeries}</span> nr.<span className="font-bold">{contract.termeni.invoiceNumber}</span>, pret negociat intre părți respectiv <span className="font-bold">{contract.obiect.totalPriceWithVat.toLocaleString()} RON</span>, valoare cu TVA inclus.</p>
            <p>7.2 Prețul se va plăti, pana la data scadență <span className="font-bold">{contract.termeni.paymentDate}</span> prin transfer bancar.</p>
          </section>

          <section>
            <h3 className="font-extrabold underline block uppercase mb-2">VIII. Clauze de nulitate</h3>
            <p>8.1 Rezilierea totală sau parțială a clauzelor prezentului contract nu are nici un efect asupra obligațiilor deja scadente între părți.</p>
          </section>

          <section>
            <h3 className="font-extrabold underline block uppercase mb-2">IX. Incetarea contractului</h3>
            <p>9.1 Prezentul contract încetează de plin drept, în momentul efectuării plății prețului facturat.</p>
            <p>Toate notificările trebuie să se facă în scris și să se trimită la adresa precizată în prezentul contract.</p>
          </section>
        </div>
        <div className="mt-auto text-[8pt] text-neutral-400 text-right">Pagina 2 / 3</div>
      </div>

      {/* PAGINA 3 */}
      <div className={cn(pageClass, "contract-page")} style={fontFamily}>
        <div className="space-y-6 text-justify">
          <section>
            <h3 className="font-extrabold underline block uppercase mb-2">X. Forța majoră</h3>
            <p>10.1 Nici una dintre părțile contractante nu răspunde de neexecutarea la termen sau de executarea în mod necorespunzător - total sau parțial - a oricărei obligații care îi revine în baza prezentului contract, dacă neexecutarea sau executarea necorespunzătoare a obligației respective a fost cauzată de forța majoră, așa cum este definită de lege.</p>
            <p>10.2 Partea care invocă forța majoră este obligată să notifice celeilalte părți, în termen de 5 zile de la producerea evenimentului și să ia toate măsurile posibile în vederea limitării consecințelor lui.</p>
          </section>

          <section>
            <h3 className="font-extrabold underline block uppercase mb-2">XI. Litigii</h3>
            <p>11.1 În cazul în care rezolvarea neînțelegerilor nu este posibilă pe cale amiabilă, ele vor fi supuse spre soluționare instanțelor judecătorești competente.</p>
          </section>

          <section>
            <h3 className="font-extrabold underline block uppercase mb-2">XII. Dispoziții finale</h3>
            <p>Modificarea prezentului contract se face numai prin act adițional încheiat între părțile contractante.</p>
            <p>Prezentul contract intră în vigoare la data semnării lui de către părți.</p>
            <p>Încheiat astăzi, <span className="font-bold underline">{contract.date}</span> în 2 exemplare.</p>
          </section>
        </div>

        <div className="mt-24 grid grid-cols-2 gap-20">
          <div className="text-center">
            <p className="font-extrabold uppercase mb-10">FURNIZOR</p>
            <p className="font-extrabold underline">{contract.emitent.name}</p>
          </div>
          <div className="text-center">
            <p className="font-extrabold uppercase mb-10">BENEFICIAR</p>
            <p className="font-extrabold underline uppercase">{contract.beneficiar.name}</p>
            <p className="font-bold mt-2 uppercase underline">{contract.beneficiar.representative}</p>
          </div>
        </div>
        <div className="mt-auto text-[8pt] text-neutral-400 text-right">Pagina 3 / 3</div>
      </div>

    </div>
  );
}
