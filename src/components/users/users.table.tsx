import { useEffect, useState } from 'react';
import '../../styles/users.scss'
import { Table, notification, Button, Popconfirm, } from 'antd';
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

  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 5,
    pages: 0,
    total: 0
  })


  const access_token = localStorage.getItem("access_token") as string; // ép kiểu dữ liệu

  useEffect(() => {
    getData();
  }, [])


  // get data
  const getData = async () => {
    const res = await fetch(`http://localhost:8000/api/v1/users?current=${meta.current}&pageSize=${meta.pageSize}`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    })

    const d = await res.json();
    console.log(d);

    if (!d.data) {
      notification.error({
        message: d.message
      })
    }
    setListUsers(d.data.result);
    setLoading(false);
    setMeta({
      current: d.data.meta.current,
      pageSize: d.data.meta.pageSize,
      pages: d.data.meta.pages,
      total: d.data.meta.total
    })

  }



  // confirm delete table
  const confirm = async (user: IUsers) => {
    const res = await fetch(`http://localhost:8000/api/v1/users/${user._id}`, {
      method: "DELETE",
      headers: {
        'Authorization': `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    })
    const d = await res.json();
    if (d.data) {
      notification.success({
        message: "Xóa user thành công!"
      })
      getData();
    } else {
      notification.error({
        message: JSON.stringify(d.message)
      })
    }

  };

  // pagination
  const handleOnChange = async (page: number, pageSize: number) => {
    console.log(page, pageSize);

    const res = await fetch(`http://localhost:8000/api/v1/users?current=${page}&pageSize=${pageSize}`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    })
    const d = await res.json();
    console.log(d);

    if (!d.data) {
      notification.error({
        message: d.message
      })
    }
    setListUsers(d.data.result);
    setLoading(false);
    setMeta({
      current: d.data.meta.current,
      pageSize: d.data.meta.pageSize,
      pages: d.data.meta.pages,
      total: d.data.meta.total
    })

  }

  // table
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
        return (
          <>
            <Button

              onClick={() => {
                console.log(record)
                setDataUpdate(record);
                setIsUpdateModalOpen(true)
              }}>
              Edit
            </Button>
            <Popconfirm
              title="Delete the user"
              description={`Are you sure to delete this user ${record.name}?`}
              onConfirm={() => confirm(record)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                className='button-delete'
                danger
              >
                Delete
              </Button>
            </Popconfirm>
          </>
        )
      }
    },
  ];

  return (
    <div>
      <div className='flex'>
        <h2>Table Users</h2>
        <div><button onClick={() => setIsCreateModalOpen(true)}>Add new</button></div>

      </div>
      <Table
        columns={columns}
        dataSource={listUsers}
        rowKey={"_id"}
        loading={loading}
        pagination={{
          current: meta.current,
          pageSize: meta.pageSize,
          total: meta.total,
          showTotal: (total) => `Total ${total} items`,
          onChange: (page: number, pageSize: number) => handleOnChange(page, pageSize),
          showSizeChanger: true

        }}
      />

      <CreateUserModal
        access_token={access_token}
        getData={getData}
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
      />


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