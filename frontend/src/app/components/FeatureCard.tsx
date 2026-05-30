import React from 'react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-shadow duration-300">
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
