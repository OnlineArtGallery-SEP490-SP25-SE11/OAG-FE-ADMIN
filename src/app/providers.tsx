'use client';
import QueryWrapper from '@/components/query-wrapper';
import { ThemeProvider } from '@/components/theme-wrapper';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<QueryWrapper>
			<ThemeProvider
				attribute='class'
				defaultTheme='system'
				enableSystem
				disableTransitionOnChange
			>
				<TooltipProvider>{children}</TooltipProvider>
				<Toaster />
			</ThemeProvider>
		</QueryWrapper>
	);
}
