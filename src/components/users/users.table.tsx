import { useEffect, useState } from 'react';
import '../../styles/users.scss'
import { Table, Modal, Input, notification } from 'antd';
import type { ColumnsType } from 'antd/es/table'
import CreateUserModal from './create.user.modal';
import UpdateUserModal from './update.user.modal';


export interface IUsers {
  email: string;
  name: string;
  role: string;
  address: string;
  age: string;
  _id: string;
  gender: string;
  password: string
}

const UsersTable = () => {
  const [loading, setLoading] = useState(true);

  const [listUsers, setListUsers] = useState([]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const [dataUpdate, setDataUpdate] = useState<null | IUsers>(null);


  const access_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0b2tlbiBsb2dpbiIsImlzcyI6ImZyb20gc2VydmVyIiwiX2lkIjoiNjc1YmFmMTZkMGNmYWM4MGEyMDI4ZmEwIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJhZGRyZXNzIjoiVmlldE5hbSIsImlzVmVyaWZ5Ijp0cnVlLCJuYW1lIjoiSSdtIGFkbWluIiwidHlwZSI6IlNZU1RFTSIsInJvbGUiOiJBRE1JTiIsImdlbmRlciI6Ik1BTEUiLCJhZ2UiOjY5LCJpYXQiOjE3MzQwNzUzOTYsImV4cCI6MTgyMDQ3NTM5Nn0.peDjGWuVOJ4OjJXzUmxOx_M7YLI4DdAfrCkEQ5pAYdY"



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
    {
      title: 'Action',
      render: (value, record) => {
        return (<><button onClick={() => {

          console.log(record)
          setDataUpdate(record);
          setIsUpdateModalOpen(true)


        }}>Edit</button></>)
      }
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
    if (!d.data) {
      notification.error({
        message: d.message
      })
    }
    setListUsers(d.data.result);
    setLoading(false);

  }


  return (
    <div>
      <div className='flex'>
        <h2>Table Users</h2>
        <div><button onClick={() => setIsCreateModalOpen(true)}>Add new</button></div>

      </div>
      <Table columns={columns} dataSource={listUsers} rowKey={"_id"} loading={loading} />

      <CreateUserModal access_token={access_token} getData={getData} isCreateModalOpen={isCreateModalOpen} setIsCreateModalOpen={setIsCreateModalOpen} />


      <UpdateUserModal
        access_token={access_token}
        getData={getData}
        isUpdateModalOpen={isUpdateModalOpen}
        setIsUpdateModalOpen={setIsUpdateModalOpen}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate} />
    </div >

  )
}

export default UsersTable;