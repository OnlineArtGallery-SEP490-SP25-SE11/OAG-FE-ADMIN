import React, { useEffect, useState } from 'react';
import { Table, Tag, Space, Button, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

interface Event {
    id: string;
    title: string;
    startTime: string;
    endTime: string;
    status: 'ongoing' | 'upcoming' | 'ended';
}

interface EventListProps {
    status: 'ongoing' | 'upcoming' | 'ended';
}

const EventList: React.FC<EventListProps> = ({ status }) => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const data = await response.json();
            // Lọc events theo status nếu API không hỗ trợ filter
            const filteredEvents = data.filter((event: Event) => event.status === status);
            setEvents(filteredEvents);
        } catch (error) {
            message.error('Không thể tải danh sách sự kiện');
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [status]);

    const handleEdit = async (record: Event) => {
        try {
            // Chuyển hướng đến trang chỉnh sửa với ID của event
            window.location.href = `/events/edit/${record.id}`;
        } catch (error) {
            message.error('Không thể chỉnh sửa sự kiện');
            console.error('Error navigating to edit page:', error);
        }
    };

    const handleDelete = async (record: Event) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${record.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            message.success('Xóa sự kiện thành công');
            fetchEvents(); // Tải lại danh sách
        } catch (error) {
            message.error('Không thể xóa sự kiện');
            console.error('Error deleting event:', error);
        }
    };

    const columns = [
        {
            title: 'Tên sự kiện',
            dataIndex: 'title',
            key: 'title'
        },
        {
            title: 'Thời gian bắt đầu',
            dataIndex: 'startTime',
            key: 'startTime',
            render: (time: string) => dayjs(time).format('DD/MM/YYYY HH:mm')
        },
        {
            title: 'Thời gian kết thúc',
            dataIndex: 'endTime',
            key: 'endTime',
            render: (time: string) => dayjs(time).format('DD/MM/YYYY HH:mm')
        },
        {
            title: 'Trạng thái',
            key: 'status',
            render: (_: any, record: Event) => (
                <Tag
                    color={
                        record.status === 'ongoing'
                            ? 'green'
                            : record.status === 'upcoming'
                            ? 'blue'
                            : 'gray'
                    }
                >
                    {record.status === 'ongoing'
                        ? 'Đang diễn ra'
                        : record.status === 'upcoming'
                        ? 'Sắp diễn ra'
                        : 'Đã kết thúc'}
                </Tag>
            )
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_: any, record: Event) => (
                <Space size='middle'>
                    <Button
                        type='text'
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    >
                        Sửa
                    </Button>
                    <Button
                        type='text'
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record)}
                    >
                        Xóa
                    </Button>
                </Space>
            )
        }
    ];

    return (
        <Table
            columns={columns}
            dataSource={events}
            rowKey='id'
            loading={loading}
            pagination={{ pageSize: 10 }}
        />
    );
};

export default EventList;