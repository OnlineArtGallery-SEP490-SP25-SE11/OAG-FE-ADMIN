import Sidebar from '@/components/ui.custom/sidebar';
import { getCurrentUser } from '@/lib/session';
import { notFound } from 'next/navigation';
export default async function PrivateLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const user = await getCurrentUser();
	console.log(user);
	if (!user) {
		return notFound();
	}
	return (
		<div className="flex min-h-screen flex-col md:flex-row">
			<Sidebar />
			{/* Main Content */}
			<main className="flex-1 p-4 md:p-8 md:ml-64 transition-all duration-300 bg-gray-50 dark:bg-gray-900">
				<div className="max-w-7xl mx-auto w-full">{children}</div>
			</main>
		</div>
	);
}