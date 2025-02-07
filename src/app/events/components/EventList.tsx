import React from 'react';
import { Table, Tag, Space, Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

interface EventListProps {
	status: 'ongoing' | 'upcoming' | 'ended';
}

const EventList: React.FC<EventListProps> = ({ status }) => {
	const columns = [
		{
			title: 'Tên sự kiện',
			dataIndex: 'title',
			key: 'title'
		},
		{
			title: 'Thời gian bắt đầu',
			dataIndex: 'startTime',
			key: 'startTime'
		},
		{
			title: 'Thời gian kết thúc',
			dataIndex: 'endTime',
			key: 'endTime'
		},
		{
			title: 'Trạng thái',
			key: 'status',
			render: (_: any, record: any) => (
				<Tag
					color={
						status === 'ongoing'
							? 'green'
							: status === 'upcoming'
							? 'blue'
							: 'gray'
					}
				>
					{status === 'ongoing'
						? 'Đang diễn ra'
						: status === 'upcoming'
						? 'Sắp diễn ra'
						: 'Đã kết thúc'}
				</Tag>
			)
		},
		{
			title: 'Thao tác',
			key: 'action',
			render: (_: any, record: any) => (
				<Space size='middle'>
					<Button
						type='text'
						icon={<EditOutlined />}
						onClick={() => console.log('Edit', record)}
					>
						Sửa
					</Button>
					<Button
						type='text'
						danger
						icon={<DeleteOutlined />}
						onClick={() => console.log('Delete', record)}
					>
						Xóa
					</Button>
				</Space>
			)
		}
	];

	const data = [
		{
			key: '1',
			title: 'Tranh Danh lam Thắng cảnh',
			startTime: '2024-03-20 09:00:00',
			endTime: '2024-03-25 18:00:00'
		}
	];

	return (
		<Table
			columns={columns}
			dataSource={data}
			pagination={{ pageSize: 10 }}
		/>
	);
};

export default EventList;
