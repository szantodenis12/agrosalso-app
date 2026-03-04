
'use client';
import ProductForm from '../ProductForm';

export default function NewProductPage() {
  return (
    <div className="space-y-8">
      <ProductForm mode="create" />
    </div>
  );
}
