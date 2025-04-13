

import { Card } from "@src/components/ui/card";

interface DashboardCardProps {
  title: string;
  description: string;
  image: string;
  category: string;
}

export function DashboardCard({ title, description, image, category }: DashboardCardProps) {
  return (
    <Card className="group relative overflow-hidden rounded-xl hoverable animate-fadeIn">
      <div className="aspect-[16/9] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        
      </div>
      <div className="p-6">
        <div className="inline-block px-3 py-1 mb-4 text-xs font-medium rounded-full bg-neutral-100">
          {category}
        </div>
        <h3 className="mb-2 text-xl font-semibold tracking-tight">{title}</h3>
        <p className="text-sm text-neutral-600">{description}</p>
      </div>
    </Card>
  );
}
