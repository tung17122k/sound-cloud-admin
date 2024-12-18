import { Form, FormProps, Input, InputNumber, Modal, notification, Radio, Select } from "antd";


interface IProps {
    access_token: string;
    getData: any;
    isCreateModalOpen: boolean;
    setIsCreateModalOpen: (v: boolean) => void;
}

// type FieldType = {
//     username?: string;
//     password?: string;
//     remember?: string;
// };


const CreateUserModal = (props: IProps) => {
    const { access_token, getData, isCreateModalOpen, setIsCreateModalOpen } = props;
    const [form] = Form.useForm();


    const onFinish: FormProps['onFinish'] = async (values) => {
        // lay data

        const { name, email, password, age, gender, address, role } = values;
        const data = { name, email, password, age, gender, address, role };
        console.log("data", data);

        // gui data len sever

        const res = await fetch("http://localhost:8000/api/v1/users", {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${access_token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })

        const d = await res.json();
        console.log("check d: ", d);
        if (d.data) {
            //success
            await getData();
            notification.success({
                message: "Tạo mới user thành công!"
            })
            handleCloseCreateModal();
        } else {
            notification.error({
                message: "Có lỗi xảy ra",
                description: d.message
            })
        }
    };

    // close modal
    const handleCloseCreateModal = () => {
        form.resetFields();
        setIsCreateModalOpen(false);
    }

    // submit failed
    const onFinishFailed: FormProps['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };


    return (
        <Modal title="Add new user"
            open={isCreateModalOpen}
            onOk={() => form.submit()}
            onCancel={() => handleCloseCreateModal()}
            maskClosable={false}
        >

            <Form
                name="basic"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                layout="vertical"
                form={form}
            >
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Please input your email!', type: 'email' }]}

                >
                    <Input />
                </Form.Item>

                <Form.Item label="Giới tính" name="gender" initialValue="male">
                    <Radio.Group>
                        <Radio value="male"> Nam </Radio>
                        <Radio value="female"> Nữ </Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item
                    label="Age"
                    name="age"
                    rules={[{ required: true, message: 'Please input your age!' }]}

                >
                    <InputNumber style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                    label="Address"
                    name="address"
                    rules={[{ required: true, message: 'Please input your Address!' }]}
                >
                    <Input.TextArea />
                </Form.Item>

                <Form.Item label="Role" name="role">
                    <Select>
                        <Select.Option value="ADMIN">ADMIN</Select.Option>
                        <Select.Option value="USER">USER</Select.Option>
                    </Select>
                </Form.Item>



            </Form>
        </Modal>
    )
}

export default CreateUserModal;