import React, { useEffect, useState } from 'react';
import Layout from './../components/Layout/Layout';
import axios from 'axios';
import { Button, Flex, Table, Typography } from 'antd';
import AdminMenu from './AdminMenu';

const { Text } = Typography;

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await axios.get('http://localhost:5001/api/v1/allusers');
      setUsers(data.users);
    };
    fetchUsers();
  }, []);

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const hasSelected = selectedRowKeys.length > 0;

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
  ];

  return (
    <Layout>
      <div className=' m-8 mt-32 grid grid-cols-12 gap-6'>
        {/* Sidebar Menu */}
        <div className='col-span-4'>
          <AdminMenu />
        </div>

        {/* Table Section */}
        <div className='col-span-8'>
          <div className='p-6 border rounded shadow-lg bg-white'>
            <Flex align="center" gap="middle" className="mb-4">
              {hasSelected ? (
                <Text type="success">
                  Selected {selectedRowKeys.length} Items
                </Text>
              ) : (
                <Text type="warning">No Item Selected</Text>
              )}
            </Flex>

            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={users}
              pagination={{ pageSize: 5 }}
              rowKey="_id"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AllUsers;
