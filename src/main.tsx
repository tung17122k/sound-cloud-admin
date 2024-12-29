import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import "./App.scss"
import './index.css'
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  Link
} from "react-router-dom";
import UsersPage from './screens/users.page.tsx';


import { UserOutlined, HomeOutlined, AudioOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import TracksPage from './screens/tracks.page.tsx'

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    label: <Link to={"/"}>Home</Link>,
    key: 'home',
    icon: <HomeOutlined />,
  },
  {
    label: <Link to={"/users"}>Manage Users</Link>,
    key: 'users',
    icon: <UserOutlined />,
  },
  {
    label: <Link to={"/tracks"}>Manage Tracks</Link>,
    key: 'tracks',
    icon: <AudioOutlined />,
  },

];


const Header = () => {
  const [current, setCurrent] = useState('mail');

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };

  return (
    <Menu
      onClick={onClick}
      selectedKeys={[current]}
      mode="horizontal"
      items={items}
    />
  );
};



const LayoutAdmin = () => {

  useEffect(() => {
    getData();
  }, [])


  const getData = async () => {
    const res = await fetch("http://localhost:8000/api/v1/auth/login", {
      method: "POST",
      headers: {

        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "admin@gmail.com",
        password: "123456"
      })
    })
    const d = await res.json();
    // console.log(d);

    if (d.data) {
      localStorage.setItem("access_token", d.data.access_token);
    }

  }
  return (
    <div>
      <Header />
      <Outlet />
      <footer></footer>
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: "/",
    // element: <App />,
    element: <LayoutAdmin />,

    children: [
      { index: true, element: <App /> },
      {
        path: "users",
        element: <UsersPage />
      },
      {
        path: "/tracks",
        element: <TracksPage />
      },
    ]
  },


]);



ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
