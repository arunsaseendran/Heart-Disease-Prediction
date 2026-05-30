import React from 'react';

interface StatCardProps {
  value: string;
  label: string;
}

export function StatCard({ value, label }: StatCardProps) {
  return (
    <div className="text-center">
      <div className="text-4xl mb-2 text-primary">{value}</div>
      <div className="text-muted-foreground">{label}</div>
    </div>
  );
}
