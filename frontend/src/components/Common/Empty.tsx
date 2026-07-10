import type { ReactNode } from 'react';

interface EmptyProps {
  title: string;
  message?: string;
  icon?: ReactNode;
}

export default function Empty({ title, message, icon }: EmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {icon && <div className="mb-4 text-4xl">{icon}</div>}
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {message && <p className="mt-2 text-gray-600">{message}</p>}
    </div>
  );
}
