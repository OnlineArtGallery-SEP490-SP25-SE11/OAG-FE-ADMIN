import { Artwork } from '@/types/artwork';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from '@/components/ui/tooltip';
import Image from 'next/image';
import {
	AlertTriangle,
	Calendar,
	CheckCircle,
	Clock,
	DollarSign,
	FileText,
	Maximize,
	Palette,
	Tag,
	User,
	XCircle
} from 'lucide-react';
import { formatShortDate, formatFullDate } from '@/utils/date';
import { Dispatch, SetStateAction, useState } from 'react';

type ArtworkDetailsDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	artwork: Artwork | null;
	onModerate: (artwork: Artwork) => void;
	isPending?: boolean;
};

export function ArtworkDetailsDialog({
	open,
	onOpenChange,
	artwork,
	onModerate
}: ArtworkDetailsDialogProps) {
	const [showAIReview, setShowAIReview] = useState(false);

	if (!artwork) return null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
				<DialogHeader>
					<DialogTitle>
						<span className='flex items-center'>
							<FileText className='h-5 w-5 mr-2' />
							{artwork.title}
						</span>
					</DialogTitle>
					<DialogDescription>
						<div className='flex items-center gap-2 mt-1'>
							<User className='h-4 w-4' />
							<span>Artist: {artwork.artistId?.name}</span>
							<span className='mx-1 text-muted-foreground'>
								•
							</span>
							<Calendar className='h-4 w-4' />
							<span>
								{artwork.createdAt && (
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger className='cursor-help'>
												{formatShortDate(
													artwork.createdAt
												)}
											</TooltipTrigger>
											<TooltipContent>
												{formatFullDate(
													artwork.createdAt
												)}
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								)}
							</span>
						</div>
					</DialogDescription>
				</DialogHeader>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-6 pt-2'>
					<div className='space-y-4'>
						<div className='relative aspect-square rounded-md overflow-hidden ring-1 ring-border shadow-sm'>
							<Image
								src={artwork.url}
								alt={artwork.title}
								fill
								className='object-contain'
								sizes='(max-width: 768px) 100vw, 500px'
								priority
							/>
						</div>

						<div className='grid grid-cols-2 gap-3'>
							<div className='flex items-center justify-center p-3 rounded-md bg-muted border'>
								<div className='flex flex-col items-center'>
									<DollarSign className='h-5 w-5 text-green-500 mb-1' />
									<span className='text-xs text-muted-foreground'>
										Price
									</span>
									<span className='font-semibold'>
										${artwork.price?.toFixed(2)}
									</span>
								</div>
							</div>

							<div className='flex items-center justify-center p-3 rounded-md bg-muted border'>
								<div className='flex flex-col items-center'>
									<Maximize className='h-5 w-5 text-blue-500 mb-1' />
									<span className='text-xs text-muted-foreground'>
										Dimensions
									</span>
									<span className='text-center text-sm'>
										{artwork.dimensions?.width} ×{' '}
										{artwork.dimensions?.height}
									</span>
								</div>
							</div>
						</div>
					</div>

					<div className='space-y-6'>
						<Tabs
							defaultValue='details'
							className='w-full'
							onValueChange={(value) => {
								if (value === 'ai-review')
									setShowAIReview(true);
							}}
						>
							<TabsList className='grid w-full grid-cols-2'>
								<TabsTrigger value='details'>
									<FileText className='h-4 w-4 mr-2' />
									Details
								</TabsTrigger>
								<TabsTrigger value='ai-review'>
									<Palette className='h-4 w-4 mr-2' />
									AI Review
								</TabsTrigger>
							</TabsList>
							<TabsContent
								value='details'
								className='space-y-4 mt-4'
							>
								<div>
									<h3 className='font-medium mb-1 flex items-center'>
										<FileText className='h-4 w-4 mr-1' />
										Description
									</h3>
									<ScrollArea className='h-24 rounded-md border p-4 bg-muted/50'>
										<p className='text-sm text-muted-foreground'>
											{artwork.description ||
												'No description provided'}
										</p>
									</ScrollArea>
								</div>

								<div>
									<h3 className='font-medium mb-1 flex items-center'>
										<Tag className='h-4 w-4 mr-1' />
										Categories
									</h3>
									<div className='flex flex-wrap gap-2'>
										{artwork.category?.length ? (
											artwork.category.map((cat, i) => (
												<Badge
													key={i}
													variant='secondary'
												>
													{cat}
												</Badge>
											))
										) : (
											<span className='text-sm text-muted-foreground'>
												No categories
											</span>
										)}
									</div>
								</div>

								<div className='grid grid-cols-2 gap-4'>
									<div className='p-3 rounded-md bg-muted border'>
										<h3 className='font-medium mb-1 flex items-center'>
											<Calendar className='h-4 w-4 mr-1' />
											Status
										</h3>
										<div className='flex flex-col gap-1'>
											<Badge
												variant='outline'
												className='w-fit'
											>
												{artwork.status}
											</Badge>
											<Badge
												variant={
													artwork.moderationStatus ===
													'pending'
														? 'outline'
														: artwork.moderationStatus ===
														  'approved'
														? 'secondary' // Changed from "success" to a standard variant
														: 'destructive'
												}
												className={`w-fit mt-1 ${
													artwork.moderationStatus ===
													'approved'
														? 'bg-green-100 text-green-800 hover:bg-green-200'
														: ''
												}`}
											>
												{artwork.moderationStatus}
											</Badge>
										</div>
									</div>

									<div className='p-3 rounded-md bg-muted border'>
										<h3 className='font-medium mb-1 flex items-center'>
											<Clock className='h-4 w-4 mr-1' />
											Last Updated
										</h3>
										<p className='text-sm text-muted-foreground'>
											<TooltipProvider>
												<Tooltip>
													<TooltipTrigger className='cursor-help'>
														{formatShortDate(
															artwork.updatedAt
														)}
													</TooltipTrigger>
													<TooltipContent>
														{formatFullDate(
															artwork.updatedAt
														)}
													</TooltipContent>
												</Tooltip>
											</TooltipProvider>
										</p>
									</div>
								</div>

								{artwork.moderationReason && (
									<div className='p-3 rounded-md bg-destructive/10 border border-destructive/20'>
										<h3 className='font-medium mb-1 text-destructive flex items-center'>
											<AlertTriangle className='h-4 w-4 mr-1' />
											Moderation Reason
										</h3>
										<ScrollArea className='h-24'>
											<p className='text-sm text-destructive'>
												{artwork.moderationReason}
											</p>
										</ScrollArea>
									</div>
								)}

								{artwork.moderatedBy && (
									<div className='p-3 rounded-md bg-muted border'>
										<h3 className='font-medium mb-1 flex items-center'>
											<User className='h-4 w-4 mr-1' />
											Moderated By
										</h3>
										<p className='text-sm text-muted-foreground'>
											{artwork.moderatedBy}
										</p>
									</div>
								)}
							</TabsContent>

							<TabsContent
								value='ai-review'
								className='space-y-4 mt-4'
							>
								{artwork.aiReview ? (
									<>
										<div>
											<h3 className='font-medium mb-1 flex items-center'>
												<Palette className='h-4 w-4 mr-1' />
												AI Description
											</h3>
											<ScrollArea className='h-32 rounded-md border p-4 bg-muted/50'>
												<p className='text-sm text-muted-foreground'>
													{
														artwork.aiReview
															.description
													}
												</p>
											</ScrollArea>
										</div>

										<div>
											<h3 className='font-medium mb-1 flex items-center'>
												<Tag className='h-4 w-4 mr-1' />
												Suggested Categories
											</h3>
											<div className='flex flex-wrap gap-2'>
												{artwork.aiReview
													.suggestedCategories
													?.length ? (
													artwork.aiReview.suggestedCategories.map(
														(cat, i) => (
															<Badge
																key={i}
																variant='secondary'
															>
																{cat}
															</Badge>
														)
													)
												) : (
													<span className='text-sm text-muted-foreground'>
														No suggested categories
													</span>
												)}
											</div>
										</div>

										<div>
											<h3 className='font-medium mb-1 flex items-center'>
												<Tag className='h-4 w-4 mr-1' />
												Keywords
											</h3>
											<div className='flex flex-wrap gap-2'>
												{artwork.aiReview.keywords
													?.length ? (
													artwork.aiReview.keywords.map(
														(keyword, i) => (
															<Badge
																key={i}
																variant='outline'
															>
																{keyword}
															</Badge>
														)
													)
												) : (
													<span className='text-sm text-muted-foreground'>
														No keywords
													</span>
												)}
											</div>
										</div>

										<div className='grid grid-cols-2 gap-4'>
											<div className='p-3 rounded-md bg-accent/50 border'>
												<h3 className='font-medium mb-1'>
													Style
												</h3>
												<p className='text-sm'>
													{artwork.aiReview.metadata
														?.style ||
														'Not specified'}
												</p>
											</div>
											<div className='p-3 rounded-md bg-accent/50 border'>
												<h3 className='font-medium mb-1'>
													Subject
												</h3>
												<p className='text-sm'>
													{artwork.aiReview.metadata
														?.subject ||
														'Not specified'}
												</p>
											</div>
											<div className='p-3 rounded-md bg-accent/50 border'>
												<h3 className='font-medium mb-1'>
													Mood
												</h3>
												<p className='text-sm'>
													{artwork.aiReview.metadata
														?.mood ||
														'Not specified'}
												</p>
											</div>
											<div className='p-3 rounded-md bg-accent/50 border'>
												<h3 className='font-medium mb-1'>
													Technique
												</h3>
												<p className='text-sm'>
													{artwork.aiReview.metadata
														?.technique ||
														'Not specified'}
												</p>
											</div>
										</div>

										<div>
											<h3 className='font-medium mb-1'>
												Colors
											</h3>
											<div className='flex flex-wrap gap-2'>
												{artwork.aiReview.metadata
													?.colors?.length ? (
													artwork.aiReview.metadata.colors.map(
														(color, i) => (
															<Badge
																key={i}
																variant='outline'
																style={{
																	backgroundColor:
																		color ===
																		'blue'
																			? '#EFF6FF'
																			: color ===
																			  'green'
																			? '#ECFDF5'
																			: color ===
																			  'red'
																			? '#FEF2F2'
																			: color ===
																			  'yellow'
																			? '#FEFCE8'
																			: color ===
																			  'purple'
																			? '#FAF5FF'
																			: color ===
																			  'pink'
																			? '#FDF2F8'
																			: color ===
																			  'gray'
																			? '#F9FAFB'
																			: color ===
																			  'black'
																			? '#F3F4F6'
																			: color ===
																			  'white'
																			? '#FFFFFF'
																			: color ===
																			  'warm tones'
																			? '#FEF3C7'
																			: '#F3F4F6',
																	color:
																		color ===
																		'blue'
																			? '#1E40AF'
																			: color ===
																			  'green'
																			? '#047857'
																			: color ===
																			  'red'
																			? '#B91C1C'
																			: color ===
																			  'yellow'
																			? '#A16207'
																			: color ===
																			  'purple'
																			? '#7E22CE'
																			: color ===
																			  'pink'
																			? '#BE185D'
																			: color ===
																			  'gray'
																			? '#374151'
																			: color ===
																			  'black'
																			? '#111827'
																			: color ===
																			  'white'
																			? '#374151'
																			: color ===
																			  'warm tones'
																			? '#92400E'
																			: '#374151'
																}}
															>
																{color}
															</Badge>
														)
													)
												) : (
													<span className='text-sm text-muted-foreground'>
														No color information
													</span>
												)}
											</div>
										</div>
									</>
								) : (
									<div className='flex flex-col items-center justify-center h-40 bg-muted rounded-md border'>
										<Palette className='h-10 w-10 text-muted-foreground/50 mb-2' />
										<p className='text-muted-foreground'>
											No AI review available for this
											artwork
										</p>
									</div>
								)}
							</TabsContent>
						</Tabs>

						<div className='flex justify-end gap-2 pt-4 border-t'>
							<Button
								variant='outline'
								onClick={() => onOpenChange(false)}
							>
								Close
							</Button>
							{artwork.moderationStatus !== 'approved' && (
								<Button onClick={() => onModerate(artwork)}>
									<CheckCircle className='h-4 w-4 mr-2' />
									Review this artwork
								</Button>
							)}
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

type ModerationDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	artwork: Artwork | null;
	moderationReason: string;
	setModerationReason: Dispatch<SetStateAction<string>>;
	onApprove: () => void;
	onReject: () => void;
	isPending: boolean;
};

export function ModerationDialog({
	open,
	onOpenChange,
	artwork,
	moderationReason,
	setModerationReason,
	onApprove,
	onReject,
	isPending
}: ModerationDialogProps) {
	if (!artwork) return null;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='max-w-lg'>
				<DialogHeader>
					<DialogTitle>
						<span className='flex items-center'>
							<CheckCircle className='h-5 w-5 mr-2' />
							Review Artwork
						</span>
					</DialogTitle>
					<DialogDescription>
						Approve or reject "{artwork.title}"
					</DialogDescription>
				</DialogHeader>

				<div className='space-y-4 py-4'>
					<div className='flex gap-4 items-start bg-muted/50 p-4 rounded-md border'>
						<div className='relative h-24 w-24 rounded-md overflow-hidden flex-shrink-0 ring-1 ring-border'>
							{artwork.url && (
								<Image
									src={artwork.url}
									alt={artwork.title || 'Artwork preview'}
									fill
									className='object-cover'
									sizes='96px'
								/>
							)}
						</div>
						<div>
							<h3 className='font-medium'>{artwork.title}</h3>
							<div className='text-sm text-muted-foreground flex items-center gap-1 mt-1'>
								<User className='h-3 w-3' />
								{artwork.artistId?.name}
							</div>
							<div className='flex gap-2 mt-2'>
								{artwork.category?.slice(0, 2).map((cat, i) => (
									<Badge
										key={i}
										variant='outline'
										className='text-xs'
									>
										{cat}
									</Badge>
								))}
								{artwork.category &&
									artwork.category.length > 2 && (
										<Badge
											variant='outline'
											className='text-xs'
										>
											+{artwork.category.length - 2}
										</Badge>
									)}
							</div>

							<div className='mt-2'>
								<Badge
									variant={
										artwork.moderationStatus === 'pending'
											? 'outline'
											: artwork.moderationStatus ===
											  'approved'
											? 'secondary' // Changed from "success" to a standard variant
											: 'destructive'
									}
								>
									{artwork.moderationStatus}
								</Badge>
							</div>
						</div>
					</div>

					<div className='space-y-2'>
						<Label
							htmlFor='rejection-reason'
							className='flex items-center'
						>
							<AlertTriangle className='h-4 w-4 mr-1 text-destructive' />
							Rejection reason (required if rejecting)
						</Label>
						<Textarea
							id='rejection-reason'
							placeholder='Explain why this artwork is being rejected...'
							value={moderationReason}
							onChange={(e) =>
								setModerationReason(e.target.value)
							}
							rows={4}
							className='resize-none transition'
						/>
					</div>
				</div>

				<DialogFooter className='gap-2 sm:gap-0 border-t pt-4'>
					<Button
						variant='outline'
						onClick={() => onOpenChange(false)}
					>
						Cancel
					</Button>
					<Button
						variant='destructive'
						onClick={onReject}
						disabled={isPending || !moderationReason.trim()}
						className='transition-all'
					>
						{isPending ? (
							<div className='h-4 w-4 border-2 border-background border-t-transparent rounded-full animate-spin mr-2' />
						) : (
							<XCircle className='h-4 w-4 mr-2' />
						)}
						Reject
					</Button>
					<Button
						onClick={onApprove}
						disabled={isPending}
						variant='default'
						className='transition-all'
					>
						{isPending ? (
							<div className='h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2' />
						) : (
							<CheckCircle className='h-4 w-4 mr-2' />
						)}
						Approve
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
