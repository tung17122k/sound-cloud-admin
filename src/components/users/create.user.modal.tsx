import { Input, Modal, notification } from "antd";
import { useState } from "react";


interface IProps {
    access_token: string;
    getData: any;
    isCreateModalOpen: boolean;
    setIsCreateModalOpen: (v: boolean) => void;
}


const CreateUserModal = (props: IProps) => {
    const { access_token, getData, isCreateModalOpen, setIsCreateModalOpen } = props;

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [address, setAddress] = useState("");
    const [role, setRole] = useState("");

    const handleOk = async () => {
        const data = {
            name,
            email,
            password,
            age,
            gender,
            address,
            role
        }
        const res = await fetch("http://localhost:8000/api/v1/users", {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${access_token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...data })
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

    const handleCloseCreateModal = () => {
        setIsCreateModalOpen(false);
        setName("");
        setEmail("");
        setAddress("");
        setAge("");
        setRole("");
        setGender("");
        setPassword("");
    }





    return (
        <Modal title="Add new user"
            open={isCreateModalOpen}
            onOk={handleOk}
            onCancel={() => handleCloseCreateModal()}
            maskClosable={false}
        >
            <div>
                <label htmlFor="">Name:</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
                <label htmlFor="">Email:</label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
                <label htmlFor="">Password:</label>
                <Input value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div>
                <label htmlFor="">Age:</label>
                <Input value={age} onChange={(e) => setAge(e.target.value)} />
            </div>
            <div>
                <label htmlFor="">Gender:</label>
                <Input value={gender} onChange={(e) => setGender(e.target.value)} />
            </div>
            <div>
                <label htmlFor="">Address:</label>
                <Input value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <div>
                <label htmlFor="">Role:</label>
                <Input value={role} onChange={(e) => setRole(e.target.value)} />
            </div>
        </Modal>
    )
}

export default CreateUserModal;