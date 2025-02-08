'use client';

import { ChevronDown, ChevronRight, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface MenuItem {
	href: string;
	label: string;
	icon: LucideIcon;
	children?: MenuItem[];
}

interface SidebarItemProps {
	item: MenuItem;
	isActive: boolean | undefined;
}

export default function SidebarItem({ item, isActive }: SidebarItemProps) {
	const [isOpen, setIsOpen] = useState(isActive);
	const Icon = item.icon;
	const pathname = usePathname();

	useEffect(() => {
		if (item.children) {
			setIsOpen(
				isActive ||
					item.children.some((child) =>
						pathname.startsWith(child.href)
					)
			);
		}
	}, [isActive, item.children, pathname]);

	const toggleOpen = () => {
		setIsOpen(!isOpen);
	};

	const activeClass = isActive
		? 'bg-pink-100 text-pink-500 font-semibold'
		: 'text-gray-700 hover:bg-gray-100';

	if (item.children) {
		return (
			<li className='mb-2'>
				<button
					onClick={toggleOpen}
					className={`flex items-center justify-between w-full p-2 rounded-md transition-all duration-200 ease-in-out ${activeClass}`}
				>
					<div className='flex items-center'>
						<Icon className='mr-3' size={20} />
						<span>{item.label}</span>
					</div>
					{isOpen ? (
						<ChevronDown size={16} />
					) : (
						<ChevronRight size={16} />
					)}
				</button>
				{isOpen && (
					<ul className='ml-6 mt-2 space-y-2'>
						{item.children.map((child) => (
							<SidebarItem
								key={child.href}
								item={child}
								isActive={pathname === child.href}
							/>
						))}
					</ul>
				)}
			</li>
		);
	}

	return (
		<li className='mb-2'>
			<Link
				href={item.href}
				className={`flex items-center p-2 rounded-md transition-all duration-200 ease-in-out ${activeClass}`}
				aria-current={isActive ? 'page' : undefined}
			>
				<Icon className='mr-3' size={20} />
				<span>{item.label}</span>
				{isActive && (
					<div className='w-1 h-6 bg-pink-500 absolute right-0 rounded-l-md transition-all duration-300 ease-in-out' />
				)}
			</Link>
		</li>
	);
}
