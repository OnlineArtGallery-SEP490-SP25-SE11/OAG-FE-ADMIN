// 'use client';
// import React, { useState } from 'react';
// import { Tabs, Button } from 'antd';
// import CreateEvent from './components/CreateEvent';
// import EventList from './components/EventList';

// const { TabPane } = Tabs;

// const EventManagement: React.FC = () => {
// 	const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

// 	return (
// 		<div className='p-6'>
// 			<div className='flex justify-between items-center mb-6'>
// 				<h1 className='text-2xl font-bold'>Quản lý sự kiện</h1>
// 				<Button
// 					type='primary'
// 					onClick={() => setIsCreateModalVisible(true)}
// 				>
// 					Tạo sự kiện mới
// 				</Button>
// 			</div>

// 			<Tabs defaultActiveKey='ongoing'>
// 				<TabPane tab='Đang diễn ra' key='ongoing'>
// 					<EventList status='ongoing' />
// 				</TabPane>
// 				<TabPane tab='Sắp diễn ra' key='upcoming'>
// 					<EventList status='upcoming' />
// 				</TabPane>
// 				<TabPane tab='Đã kết thúc' key='ended'>
// 					<EventList status='ended' />
// 				</TabPane>
// 			</Tabs>

// 			<CreateEvent
// 				visible={isCreateModalVisible}
// 				onClose={() => setIsCreateModalVisible(false)}
// 			/>
// 		</div>
// 	);
// };

// export default EventManagement;
