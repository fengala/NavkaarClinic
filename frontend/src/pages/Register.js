import React, { useState } from 'react';
import { Button, Form, Input, Typography, message } from 'antd';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

const { Title } = Typography;

const Register = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    console.log('Success:', values);
    try {
      const res = await axios.post('/api/v1/user/register', values);
      if (res.data.success) {
        message.success("Registered Successfully!");
        localStorage.setItem("token", res.data.token);
        navigate('/'); // Ensure you have a route for '/homepage'
      } else {
        message.error(res.data.message || "Registration Failed!");
      }
    } catch (error) {
      console.error("Registration Error:", error);
      message.error("Email Already Exists!");
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: '100vh' }}>
      <Title level={2}>Register</Title>
      <Form
        form={form}
        name="register"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 300 }}
        onFinish={onFinish}
        autoComplete="off"
      >
      <Form.Item
        label="FirstName"
        name="firstname"
        rules={[{ required: true, message: 'Please input your first name!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="LastName"
        name="lastname"
        rules={[{ required: true, message: 'Please input your last name!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: 'Please input your email!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Phone"
        name="phone"
        rules={[{ required: true, message: 'Please input your phone number!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        wrapperCol={{ offset: 8, span: 16 }}
      >
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>

      <Link to="/login" >Already a user? Log in.</Link>
      </Form>
    </div>
  );
};

export default Register;
