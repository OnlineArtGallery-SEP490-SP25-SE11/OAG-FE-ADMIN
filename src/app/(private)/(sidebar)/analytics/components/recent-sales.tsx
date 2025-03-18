'use client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { vietnamCurrency } from "@/utils";

interface Sale {
  id: string;
  artwork: string;
  customer: {
    name: string;
    email: string;
    avatar: string;
  };
  amount: number;
  date: string;
}

const recentSales: Sale[] = [
  {
    id: '1',
    artwork: "Abstract Dreams",
    customer: {
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      avatar: "/avatars/01.png"
    },
    amount: 1150000,
    date: "2024-03-20"
  },
  {
    id: '2',
    artwork: "Ocean Waves",
    customer: {
      name: "Michael Chen",
      email: "m.chen@example.com",
      avatar: "/avatars/02.png"
    },
    amount: 700000,
    date: "2024-03-19"
  },
  {
    id: '3',
    artwork: "Mountain Sunset",
    customer: {
      name: "Emily Davis",
      email: "emily.d@example.com",
      avatar: "/avatars/03.png"
    },
    amount: 1600000,
    date: "2024-03-18"
  },
  {
    id: '4',
    artwork: "Urban Life",
    customer: {
      name: "Alex Thompson",
      email: "alex.t@example.com",
      avatar: "/avatars/04.png"
    },
    amount: 1050000,
    date: "2024-03-17"
  },
];

export function RecentSales() {
  return (
    <div className="space-y-8">
      {recentSales.map((sale) => (
        <div key={sale.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={sale.customer.avatar} alt={sale.customer.name} />
            <AvatarFallback>
              {sale.customer.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{sale.customer.name}</p>
            <p className="text-sm text-muted-foreground">{sale.artwork}</p>
          </div>
          <div className="ml-auto font-medium">
            {vietnamCurrency(sale.amount)}
          </div>
        </div>
      ))}
    </div>
  );
}
