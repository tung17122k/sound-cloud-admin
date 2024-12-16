import React, { useState } from 'react'
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


import { UserOutlined, HomeOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';

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
        element: <>manage tracks</>,
      },
    ]
  },


]);



ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
