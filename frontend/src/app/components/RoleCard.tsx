import React from 'react';
import { Button } from './Button';

interface RoleCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
}

export function RoleCard({ icon, title, description, features }: RoleCardProps) {
  return (
    <div className="bg-card rounded-xl p-8 border border-border hover:border-primary/50 transition-all duration-300 flex flex-col">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6">{description}</p>
      <ul className="space-y-2 mb-8 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2 text-sm">
            <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Button variant="outline" className="w-full">Get Started</Button>
    </div>
  );
}
