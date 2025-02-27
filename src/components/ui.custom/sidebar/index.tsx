'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import menuItems from './menu-items';
import SidebarItem from './sidebar-item';
import MobileSidebar from './sidebar-mobile';
import { UserInfo, UserInfoSkeleton } from './user-info';

export default function Sidebar() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const pathname = usePathname();

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 768);
		};
		handleResize();
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	if (isMobile) {
		return (
			<>
				<button
					onClick={toggleMobileMenu}
					className='fixed top-4 left-4 z-20 p-2 rounded-md shadow-md'
					aria-label='Toggle menu'
				>
					<Menu size={24} />
				</button>
				<MobileSidebar
					isOpen={isMobileMenuOpen}
					onClose={toggleMobileMenu}
					menuItems={menuItems}
				/>
			</>
		);
	}

	return (
		<nav className='w-64 bg-background h-screen fixed left-0 top-0 shadow-md transition-all duration-300 ease-in-out'>
			<div className='p-3 h-full flex flex-col justify-between'>
				<Link
					className='flex justify-center items-center mb-8'
					href='/'
				>
					<img
						src='/logo.svg'
						alt='Next.js logo'
						width={100}
						height={42}
						className='[filter:invert(72%)_sepia(87%)_saturate(4090%)_hue-rotate(301deg)_brightness(104%)_contrast(101%)] dark:invert'
					/>
				</Link>
				<Separator className='w-full m-1' />
				<div className='flex-1'>
					<ScrollArea
						className='[&>div>div[style]]:!block w-full max-h-full h-2/3 overflow-y-auto'
						scrollHideDelay={1}
						type='always'
					>
						<ul>
							{menuItems.map((item) => (
								<SidebarItem
									key={item.href}
									item={item}
									isActive={
										pathname === item.href ||
										(item.children &&
											item.children.some((child) =>
												pathname.startsWith(child.href)
											))
									}
								/>
							))}
						</ul>
						{/* <div className="h-64"></div> */}
					</ScrollArea>
				</div>
				<Separator className='w-full m-1' />
				<div className='mt-auto'>
					<Suspense fallback={<UserInfoSkeleton />}>
						<UserInfo />
					</Suspense>
				</div>
			</div>
		</nav>
	);
}
