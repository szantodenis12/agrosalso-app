
'use client';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Product } from '@/types';

/**
 * Utilitar pentru exportul catalogului în format ZIP.
 * Organizează produsele în foldere după categorie și nume.
 */
export async function exportCatalogToZip(products: Product[]) {
  const zip = new JSZip();

  for (const product of products) {
    const cleanCategory = (product.category || 'Altele').replace(/[/\\?%*:|"<>\.]/g, '-');
    const cleanName = product.name.replace(/[/\\?%*:|"<>\.]/g, '-');
    
    const categoryFolder = zip.folder(cleanCategory);
    const productFolder = categoryFolder?.folder(cleanName);

    let infoContent = `NUME PRODUS: ${product.name}\n`;
    infoContent += `MARCĂ: ${product.brand}\n`;
    infoContent += `CATEGORIE: ${product.category}\n`;
    infoContent += `PREȚ: ${product.priceOnRequest ? 'LA CERERE' : product.price + ' EUR'}\n`;
    infoContent += `STATUS STOC: ${product.inStock ? 'ÎN STOC' : 'LA COMANDĂ'}\n`;
    infoContent += `--------------------------------------------------\n\n`;
    
    infoContent += `DESCRIERE SCURTĂ:\n${product.shortDescription}\n\n`;
    const plainDescription = product.detailedDescription?.replace(/<[^>]*>?/gm, '') || '';
    infoContent += `DESCRIERE DETALIATĂ:\n${plainDescription}\n\n`;

    if (product.specTable && product.specTable.headers.length > 0) {
      infoContent += `SPECIFICAȚII TEHNICE:\n`;
      infoContent += product.specTable.headers.join(' | ') + '\n';
      infoContent += '-'.repeat(product.specTable.headers.join(' | ').length) + '\n';
      product.specTable.rows.forEach(row => {
        infoContent += row.values.join(' | ') + (row.isPopular ? ' (POPULAR)' : '') + '\n';
      });
      if (product.specTable.footerNote) {
        infoContent += `\nNotă: ${product.specTable.footerNote}\n`;
      }
    }

    productFolder?.file('detalii-produs.txt', infoContent);

    const imageUrls = [product.mainImage, ...(product.images || [])].filter(Boolean);
    const uniqueImages = Array.from(new Set(imageUrls));

    for (let i = 0; i < uniqueImages.length; i++) {
      try {
        const response = await fetch(uniqueImages[i]);
        if (!response.ok) throw new Error(`Fetch failed for ${uniqueImages[i]}`);
        const blob = await response.blob();
        let extension = 'jpg';
        if (blob.type === 'image/png') extension = 'png';
        if (blob.type === 'image/webp') extension = 'webp';
        const fileName = i === 0 ? `imagine-principala.${extension}` : `galerie-${i}.${extension}`;
        productFolder?.file(fileName, blob);
      } catch (error) {
        console.error(`Eroare la descărcarea imaginii ${uniqueImages[i]}:`, error);
      }
    }
  }

  const content = await zip.generateAsync({ type: 'blob' });
  const dateStr = new Date().toISOString().split('T')[0];
  saveAs(content, `Catalog-AgroSalso-${dateStr}.zip`);
}
