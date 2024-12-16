import { useEffect, useState } from 'react';
import '../../styles/users.scss'
import { Table, Modal, Input, notification } from 'antd';
import type { ColumnsType } from 'antd/es/table'


interface IUsers {
  email: string;
  name: string;
  role: string;
  address: string;
  age: number
  _id: string
}

const UsersTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("");
  const access_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0b2tlbiBsb2dpbiIsImlzcyI6ImZyb20gc2VydmVyIiwiX2lkIjoiNjc1YmFmMTZkMGNmYWM4MGEyMDI4ZmEwIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJhZGRyZXNzIjoiVmlldE5hbSIsImlzVmVyaWZ5Ijp0cnVlLCJuYW1lIjoiSSdtIGFkbWluIiwidHlwZSI6IlNZU1RFTSIsInJvbGUiOiJBRE1JTiIsImdlbmRlciI6Ik1BTEUiLCJhZ2UiOjY5LCJpYXQiOjE3MzQwNzUzOTYsImV4cCI6MTgyMDQ3NTM5Nn0.peDjGWuVOJ4OjJXzUmxOx_M7YLI4DdAfrCkEQ5pAYdY"


  const [listUsers, setListUsers] = useState([]);

  useEffect(() => {
    getData();


  }, [])

  const columns: ColumnsType<IUsers> = [
    {
      title: 'Email',
      dataIndex: 'email',
      render: (value, record) => {

        return (<a>{record.email}</a>)
      }
    },
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Address',
      dataIndex: 'address',
    },
    {
      title: 'Age',
      dataIndex: 'age',
    },
    {
      title: 'Role',
      dataIndex: 'role',
    },
  ];



  const getData = async () => {


    const res = await fetch("http://localhost:8000/api/v1/users/all", {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    })

    const d = await res.json();
    setListUsers(d.data.result);
    setLoading(false);

  }

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
    setIsModalOpen(false);
    setName("");
    setEmail("");
    setAddress("");
    setAge("");
    setRole("");
    setGender("");
    setPassword("");
  }



  return (
    <div>
      <div className='flex'>
        <h2>Table Users</h2>
        <div><button onClick={() => setIsModalOpen(true)}>Add new</button></div>

      </div>
      <Table columns={columns} dataSource={listUsers} rowKey={"_id"} loading={loading} />

      <Modal title="Add new user"
        open={isModalOpen}
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
    </div >

  )
}

export default UsersTable;