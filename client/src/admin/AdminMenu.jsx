import React, { useState } from "react";
import {
  AppstoreOutlined,
  AppstoreAddOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  UserOutlined,
  EditOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Button, Menu } from "antd";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/authContext"; // Import useAuth hook

const AdminMenu = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [auth] = useAuth(); // Destructure inside the component

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const items = [
    {
      key: "1",
      icon: <PieChartOutlined />,
      label: "Dashboard",
      to: "/dashboard/admin",
    },
    {
      key: "2",
      icon: <UserOutlined />,
      label: "Profile",
      to: "/dashboard/admin/profile",
    },
    {
      key: "3",
      icon: <EditOutlined />,
      label: "Update Profile",
      to: `/dashboard/admin/update/${auth?.user?._id}`,
    },
    {
      key: "4",
      icon: <AppstoreAddOutlined />,
      label: "Create Category",
      to: "/dashboard/admin/create-category",
    },
    {
      key: "5",
      icon: <AppstoreOutlined />,
      label: "Create Product",
      to: "/dashboard/admin/create-product",
    },
    {
      key: "6",
      icon: <AppstoreOutlined />,
      label: "Products",
      to: "/dashboard/admin/products",
    },
    {
      key: "7",
      icon: <UserOutlined />,
      label: "Users",
      to: "/dashboard/admin/users",
    },
    {
      key: "8",
      icon: <ShoppingCartOutlined />,
      label: "Orders",
      to: "/dashboard/admin/orders",
    },
  ];

  return (
    <div style={{ width: 256 }}>
      {/* Button to toggle collapsed sidebar */}
      <Button
        type="primary"
        onClick={toggleCollapsed}
        style={{ marginBottom: 16 }}
        className="md:hidden"
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
      <Menu
        className="border-2 shadow-blue-600 shadow-2xl"
        defaultSelectedKeys={["1"]}
        mode="inline"
        theme="white"
        inlineCollapsed={collapsed}
      >
        {/* Iterate through items and create the menu */}
        {items.map((item) => (
          <Menu.Item key={item.key} icon={item.icon}>
            <NavLink
              to={item.to}
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              {item.label}
            </NavLink>
          </Menu.Item>
        ))}
      </Menu>
    </div>
  );
};

export default AdminMenu;
