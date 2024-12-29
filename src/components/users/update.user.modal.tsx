import { Input, Modal, notification, Form, Radio, InputNumber, Select, FormProps } from "antd";
import { useEffect, useState } from "react";
import { IUsers } from "./users.table";


interface IProps {
    access_token: string;
    getData: any;
    isUpdateModalOpen: boolean;
    setIsUpdateModalOpen: (v: boolean) => void;
    dataUpdate: null | IUsers;
    setDataUpdate: any;
}


const CreateUserModal = (props: IProps) => {
    const { access_token, getData, isUpdateModalOpen, setIsUpdateModalOpen, dataUpdate, setDataUpdate } = props;
    const [form] = Form.useForm();

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                name: dataUpdate.name,
                email: dataUpdate.email,
                age: dataUpdate.age,
                address: dataUpdate.address,
                password: dataUpdate.password,
                role: dataUpdate.role,
                gender: dataUpdate.gender
            })
        }
    }, [dataUpdate])


    const handleCloseCreateModal = () => {
        setIsUpdateModalOpen(false);
        form.resetFields();
        setDataUpdate(null);
    }


    const onFinish: FormProps['onFinish'] = async (values) => {

        // lay data
        const { name, email, password, age, gender, address, role } = values;

        // gui data len sever
        if (dataUpdate) {
            const data = {
                _id: dataUpdate._id,
                name, email, password, age, gender, address, role
            }
            // goi api update
            const res = await fetch("http://localhost:8000/api/v1/users", {
                method: "PATCH",
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            })
            const d = await res.json();
            // console.log("check d: ", d);
            if (d.data) {
                //success
                await getData();
                notification.success({
                    message: "Update user thành công!"
                })
                handleCloseCreateModal();
            } else {
                notification.error({
                    message: "Có lỗi xảy ra",
                    description: d.message
                })
            }
        }


    };
    const onFinishFailed: FormProps['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };


    return (
        <Modal title="Update user"
            open={isUpdateModalOpen}
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
                    rules={[{ required: dataUpdate ? false : true, message: 'Please input your password!' }]}
                >
                    <Input.Password disabled={dataUpdate ? true : false} />
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
                        <Radio value="MALE"> Nam </Radio>
                        <Radio value="FEMALE"> Nữ </Radio>
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