import { Button, notification, Popconfirm, Table } from "antd";
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useState } from "react";



export interface ITracks {
    _id: string;
    title: string;
    description: string;
    category: string;
    trackUrl: string;
    countLike: number;
    countPlay: number;
}
const TracksTable = () => {
    const access_token = localStorage.getItem("access_token") as string;
    const [loading, setLoading] = useState(false);
    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    })

    const [listTracks, setListTracks] = useState([]);

    useEffect(() => {
        getData();
    }, [])



    const getData = async () => {
        const res = await fetch(`http://localhost:8000/api/v1/tracks?current=${meta.current}&pageSize=${meta.pageSize}`, {
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
        setListTracks(d.data.result);
        setLoading(false);
        setMeta({
            current: d.data.meta.current,
            pageSize: d.data.meta.pageSize,
            pages: d.data.meta.pages,
            total: d.data.meta.total
        })
    }


    const handleOnChange = async (page: number, pageSize: number) => {
        console.log(page, pageSize);

        const res = await fetch(`http://localhost:8000/api/v1/tracks?current=${page}&pageSize=${pageSize}`, {
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
        setListTracks(d.data.result);
        setLoading(false);
        setMeta({
            current: d.data.meta.current,
            pageSize: d.data.meta.pageSize,
            pages: d.data.meta.pages,
            total: d.data.meta.total
        })
    }

    const confirm = async (track: ITracks) => {
        const res = await fetch(
            `http://localhost:8000/api/v1/tracks/${track._id}`,
            {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    "Content-Type": "application/json",
                },
            })
        const d = await res.json();
        if (d.data) {
            notification.success({
                message: "Xóa track thành công."
            })
            await getData();
        } else {
            notification.error({
                message: JSON.stringify(d.message)
            })
        }
    };

    const columns: ColumnsType<ITracks> = [
        {
            title: 'STT',
            dataIndex: '_id',
            render: (value, record, index) => {


                return (<>{((meta.current - 1) * meta.pageSize) + index + 1}</>)
            }
        },
        {
            title: 'Title',
            dataIndex: 'title',
        },
        {
            title: 'Description',
            dataIndex: 'description',
        },
        {
            title: 'Category',
            dataIndex: 'category',
        },
        {
            title: 'Track Url',
            dataIndex: 'trackUrl',
        },
        {
            title: 'Uploader',
            dataIndex: ["uploader", "name"],
        },
        {
            title: 'Action',
            render: (value, record) => {
                return (
                    <>
                        {/* <Button

                            onClick={() => {
                                console.log(record)
                                setDataUpdate(record);
                                setIsUpdateModalOpen(true)
                            }}>
                            Edit
                        </Button> */}
                        <Popconfirm
                            title="Delete the track"
                            description={`Are you sure to delete this track ${record.title}?`}
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
            <h2 >Table Tracks</h2>
            <Table
                columns={columns}
                dataSource={listTracks}
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
            >

            </Table>
        </div>
    )
}

export default TracksTable;