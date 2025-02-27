import {
	BarChart2,
	Bell,
	FileText,
	Home,
	Newspaper,
	Settings,
	UserCog,
	Users
} from 'lucide-react';
const menuItems = [
	{ href: '/dashboard', label: 'Dashboard', icon: Home },
	{ href: '/analytics', label: 'Analytics', icon: BarChart2 },
	{
		href: '/customers',
		label: 'Customers',
		icon: Users,
		children: [
			{
				href: '/customers/reporting',
				label: 'Reporting',
				icon: FileText
			},
			{
				href: '/customers/management',
				label: 'Management',
				icon: UserCog
			}
		]
	},
	{ href: '/events', label: 'Events', icon: FileText },
	{ href: '/notifications', label: 'Notifications', icon: Bell },
	{ href: '/blogs', label: 'Blogs', icon: Newspaper },
	{ href: '/settings', label: 'Settings', icon: Settings },
	
];

export default menuItems;
