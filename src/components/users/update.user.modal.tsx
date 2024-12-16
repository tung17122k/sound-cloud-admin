import { Input, Modal, notification } from "antd";
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
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [address, setAddress] = useState("");
    const [role, setRole] = useState("");


    useEffect(() => {
        if (dataUpdate) {
            setName(dataUpdate.name);
            setEmail(dataUpdate.email);
            setAddress(dataUpdate.address);
            setAge(dataUpdate.age)
            setRole(dataUpdate.role);
            setGender(dataUpdate.gender);
            setPassword(dataUpdate.password);
        }
    }, [dataUpdate])



    const handleOk = async () => {
        if (dataUpdate) {



            const data = {
                _id: dataUpdate._id,
                name,
                email,
                password,
                age,
                gender,
                address,
                role

            }
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

    const handleCloseCreateModal = () => {
        setIsUpdateModalOpen(false);
        setName("");
        setEmail("");
        setAddress("");
        setAge("");
        setRole("");
        setGender("");
        setPassword("");
        setDataUpdate(null);
    }





    return (
        <Modal title="Update user"
            open={isUpdateModalOpen}
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
                <Input disabled value={password} onChange={(e) => setPassword(e.target.value)} />
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