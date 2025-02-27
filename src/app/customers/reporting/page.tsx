'use client';

import Image from 'next/image';
import { useState } from 'react';

interface Report {
	id: string;
	reporter: {
		id: string;
		name: string;
		avatar: string;
	};
	reported: {
		id: string;
		name: string;
		avatar: string;
	};
	reason: string;
	evidence: string;
	createdAt: string;
}

export default function ReportsPage() {
	const [reports, setReports] = useState<Report[]>([
		// Mock data - sau này sẽ được thay thế bằng dữ liệu thật từ API
		{
			id: '1',
			reporter: {
				id: '1',
				name: 'John Doe',
				avatar: '/IMG_4802.jpg'
			},
			reported: {
				id: '2',
				name: 'Jane Smith',
				avatar: '/IMG_4802.jpg'
			},
			reason: 'Inappropriate content',
			evidence: '/IMG_3199.jpg',
			createdAt: '2024-03-20T10:30:00Z'
		}
		// Thêm các mẫu dữ liệu khác ở đây
	]);

	// Thêm state mới
	const [showBanModal, setShowBanModal] = useState(false);
	const [selectedReport, setSelectedReport] = useState<Report | null>(null);
	const [showSuccessMessage, setShowSuccessMessage] = useState(false);
	const [showDismissMessage, setShowDismissMessage] = useState(false);

	// Hàm xử lý hiển thị modal
	const handleReviewClick = (report: Report) => {
		setSelectedReport(report);
		setShowBanModal(true);
	};

	// Hàm xử lý ban user
	const handleBanUser = async (duration: number | 'permanent') => {
		try {
			// TODO: Gọi API để ban user
			// const response = await fetch('/api/ban-user', {
			//   method: 'POST',
			//   body: JSON.stringify({
			//     userId: selectedReport?.reported.id,
			//     duration: duration,
			//   }),
			// });

			// Cập nhật UI
			setShowBanModal(false);
			setShowSuccessMessage(true);

			// Ẩn message sau 3 giây
			setTimeout(() => {
				setShowSuccessMessage(false);
			}, 3000);

			// Xóa report đã xử lý khỏi danh sách
			setReports(
				reports.filter((report) => report.id !== selectedReport?.id)
			);
		} catch (error) {
			console.error('Error banning user:', error);
			alert('Failed to ban user. Please try again.');
		}
	};

	// Hàm xử lý dismiss report
	const handleDismiss = (report: Report) => {
		try {
			// Xóa report khỏi danh sách
			setReports(reports.filter((r) => r.id !== report.id));

			// Hiển thị thông báo thành công
			setShowDismissMessage(true);

			// Ẩn thông báo sau 3 giây
			setTimeout(() => {
				setShowDismissMessage(false);
			}, 3000);
		} catch (error) {
			console.error('Error dismissing report:', error);
			alert('Failed to dismiss report. Please try again.');
		}
	};

	return (
		<div className='container mx-auto p-6'>
			<h1 className='text-2xl font-bold mb-6'>Reports Management</h1>

			<div className='overflow-x-auto'>
				<table className='min-w-full bg-white rounded-lg overflow-hidden shadow-lg'>
					<thead className='bg-gray-100'>
						<tr>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								Reporter
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								Reported User
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								Reason
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								Evidence
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								Time
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								Actions
							</th>
						</tr>
					</thead>
					<tbody className='divide-y divide-gray-200'>
						{reports.map((report) => (
							<tr key={report.id} className='hover:bg-gray-50'>
								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='flex items-center'>
										<div className='h-10 w-10 relative rounded-full overflow-hidden'>
											<Image
												src={report.reporter.avatar}
												alt={report.reporter.name}
												fill
												className='object-cover'
											/>
										</div>
										<div className='ml-4'>
											<div className='text-sm font-medium text-gray-900'>
												{report.reporter.name}
											</div>
											<div className='text-sm text-gray-500'>
												ID: {report.reporter.id}
											</div>
										</div>
									</div>
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='flex items-center'>
										<div className='h-10 w-10 relative rounded-full overflow-hidden'>
											<Image
												src={report.reported.avatar}
												alt={report.reported.name}
												fill
												className='object-cover'
											/>
										</div>
										<div className='ml-4'>
											<div className='text-sm font-medium text-gray-900'>
												{report.reported.name}
											</div>
											<div className='text-sm text-gray-500'>
												ID: {report.reported.id}
											</div>
										</div>
									</div>
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='text-sm text-gray-900'>
										{report.reason}
									</div>
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='h-16 w-16 relative rounded overflow-hidden'>
										<Image
											src={report.evidence}
											alt='Evidence'
											fill
											className='object-cover cursor-pointer'
											onClick={() => {
												/* Thêm modal để xem ảnh full size */
											}}
										/>
									</div>
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='text-sm text-gray-900'>
										{new Date(
											report.createdAt
										).toLocaleString()}
									</div>
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<button
										className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mr-2'
										onClick={() =>
											handleReviewClick(report)
										}
									>
										Review
									</button>
									<button
										className='bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600'
										onClick={() => handleDismiss(report)}
									>
										Dismiss
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Modal Ban User */}
			{showBanModal && (
				<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
					<div className='bg-white p-6 rounded-lg shadow-xl'>
						<h2 className='text-xl font-bold mb-4'>
							Ban User: {selectedReport?.reported.name}
						</h2>
						<div className='space-y-3'>
							<button
								className='w-full bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600'
								onClick={() => handleBanUser(30)}
							>
								Ban 30 days
							</button>
							<button
								className='w-full bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600'
								onClick={() => handleBanUser(60)}
							>
								Ban 60 days
							</button>
							<button
								className='w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600'
								onClick={() => handleBanUser('permanent')}
							>
								Permanent Ban
							</button>
							<button
								className='w-full bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600'
								onClick={() => setShowBanModal(false)}
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Success Message */}
			{showSuccessMessage && (
				<div className='fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded shadow-lg'>
					User has been banned successfully!
				</div>
			)}

			{/* Dismiss Success Message */}
			{showDismissMessage && (
				<div className='fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded shadow-lg'>
					Report has been dismissed successfully!
				</div>
			)}
		</div>
	);
}
