// import React from 'react';
// import { Modal, Form, Input, DatePicker, Select, message } from 'antd';
// import { CreateEventPayload } from '@/types/event';
// import { EventService } from '@/services/event.service';

// interface Props {
// 	visible: boolean;
// 	onClose: () => void;
// 	onSuccess?: () => void;
// }

// const CreateEvent: React.FC<Props> = ({ visible, onClose, onSuccess }) => {
// 	const [form] = Form.useForm();

// 	// eslint-disable-next-line @typescript-eslint/no-explicit-any
// 	const handleSubmit = async (values: any) => {
// 		try {
// 			const payload: CreateEventPayload = {
// 				...values,
// 				startDate: values.startDate.toDate(),
// 				endDate: values.endDate.toDate()
// 			};
			
// 			await EventService.createEvent(payload);
// 			message.success('Tạo sự kiện thành công');
// 			form.resetFields();
// 			onClose();
// 			onSuccess?.();
// 		// eslint-disable-next-line @typescript-eslint/no-unused-vars
// 		} catch (error) {
// 			message.error('Có lỗi xảy ra khi tạo sự kiện');
// 		}
// 	};

// 	return (
// 		<Modal
// 			title="Tạo sự kiện mới"
// 			open={visible}
// 			onCancel={onClose}
// 			onOk={() => form.submit()}
// 		>
// 			<Form form={form} layout="vertical" onFinish={handleSubmit}>
// 				<Form.Item
// 					name="title"
// 					label="Tiêu đề"
// 					rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
// 				>
// 					<Input />
// 				</Form.Item>

// 				<Form.Item
// 					name="description"
// 					label="Mô tả"
// 					rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
// 				>
// 					<Input.TextArea rows={4} />
// 				</Form.Item>

// 				<Form.Item
// 					name="type"
// 					label="Loại sự kiện"
// 					rules={[{ required: true, message: 'Vui lòng chọn loại sự kiện' }]}
// 				>
// 					<Select>
// 						<Select.Option value="exhibition">Triển lãm</Select.Option>
// 						<Select.Option value="auction">Đấu giá</Select.Option>
// 						<Select.Option value="workshop">Workshop</Select.Option>
// 					</Select>
// 				</Form.Item>

// 				<Form.Item
// 					name="status"
// 					label="Trạng thái"
// 					rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
// 				>
// 					<Select>
// 						<Select.Option value="upcoming">Sắp diễn ra</Select.Option>
// 						<Select.Option value="ongoing">Đang diễn ra</Select.Option>
// 						<Select.Option value="ended">Đã kết thúc</Select.Option>
// 					</Select>
// 				</Form.Item>

// 				<Form.Item
// 					name="startDate"
// 					label="Ngày bắt đầu"
// 					rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
// 				>
// 					<DatePicker showTime />
// 				</Form.Item>

// 				<Form.Item
// 					name="endDate"
// 					label="Ngày kết thúc"
// 					rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc' }]}
// 				>
// 					<DatePicker showTime />
// 				</Form.Item>

// 				<Form.Item
// 					name="image"
// 					label="Hình ảnh"
// 					rules={[{ required: true, message: 'Vui lòng nhập URL hình ảnh' }]}
// 				>
// 					<Input />
// 				</Form.Item>
// 			</Form>
// 		</Modal>
// 	);
// };

// export default CreateEvent;
