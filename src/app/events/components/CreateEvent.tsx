import React from 'react';
import { Modal, Form, Input, DatePicker, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

interface CreateEventProps {
	visible: boolean;
	onClose: () => void;
}

const CreateEvent: React.FC<CreateEventProps> = ({ visible, onClose }) => {
	const [form] = Form.useForm();

	const handleSubmit = async (values: any) => {
		try {
			// Xử lý logic tạo event ở đây
			console.log(values);
			onClose();
			form.resetFields();
		} catch (error) {
			console.error('Error creating event:', error);
		}
	};

	return (
		<Modal
			title='Tạo sự kiện mới'
			visible={visible}
			onCancel={onClose}
			onOk={() => form.submit()}
		>
			<Form form={form} layout='vertical' onFinish={handleSubmit}>
				<Form.Item
					name='title'
					label='Tên sự kiện'
					rules={[
						{ required: true, message: 'Vui lòng nhập tên sự kiện' }
					]}
				>
					<Input />
				</Form.Item>

				<Form.Item
					name='description'
					label='Mô tả'
					rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
				>
					<Input.TextArea rows={4} />
				</Form.Item>

				<Form.Item
					name='dateRange'
					label='Thời gian diễn ra'
					rules={[
						{ required: true, message: 'Vui lòng chọn thời gian' }
					]}
				>
					<DatePicker.RangePicker showTime />
				</Form.Item>

				<Form.Item name='image' label='Hình ảnh sự kiện'>
					<Upload>
						<Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
					</Upload>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default CreateEvent;
