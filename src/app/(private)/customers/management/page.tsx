import { Breadcrumb } from "@/components/ui.custom/breadcrumb";
import { DataTable } from "@/app/(private)/blogs/data-table";
import { Customer, columns } from "./columns";

export default function ManagementPage() {
  // Mock data - replace with actual API call
  const customers: Customer[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: '/IMG_4802.jpg',
      status: 'active',
      joinDate: '2024-01-15',
      lastLogin: '2024-03-20',
      role: 'user',
      accountType: 'premium',
      phoneNumber: '+1234567890',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      avatar: '/IMG_4802.jpg',
      status: 'inactive',
      joinDate: '2024-02-20',
      lastLogin: '2024-03-15',
      role: 'moderator',
      accountType: 'free',
      phoneNumber: '+0987654321',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Breadcrumb 
          items={[
            { label: "Dashboard", link: "/dashboard" }, 
            { label: "Customers", link: "/customers" },
            { label: "Management" }
          ]} 
        />
      </div>
      {/* <DataTable columns={columns} data={customers} /> */}
    </div>
  );
}

