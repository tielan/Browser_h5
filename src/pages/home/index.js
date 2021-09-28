import React, { Component } from 'react';
import { Form, Input, Button, Radio, Upload, Spin, message } from 'antd';
const { Dragger } = Upload;
const fetch = require('dva').fetch;

const LoginPad = ({ callBack }) => {
  const onFinish = values => {
    console.log('Success:', values);
    if (values && values.username == 'admin' && values.password == 'c123456') {
      callBack && callBack('ok');
    } else {
      message.info('账号或密码错误');
    }
  };

  return (
    <Form name="basic" onFinish={onFinish} autoComplete="off">
      <Form.Item label="账号" name="username" rules={[{ required: true, message: '请输入账号' }]}>
        <Input />
      </Form.Item>

      <Form.Item label="密码" name="password" rules={[{ required: true, message: '请输入密码!' }]}>
        <Input.Password />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          登录
        </Button>
      </Form.Item>
    </Form>
  );
};
const onFinish = values => {
  fetch('/app/saveConfig', {
    method: 'POST',
    body: JSON.stringify(values),
  })
    .then(res => res.json())
    .then(res => {
      message.info('保存成功');
    });
};
const props = {
  name: 'file',
  multiple: false,
  action: '/app/deployFile',
  onChange(info) {
    const { status } = info.file;
    if (status === 'done') {
      message.success(`应用成功`);
    } else if (status === 'error') {
      message.error(`应用失败`);
    }
  },
  onDrop(e) {
    console.log('Dropped files', e.dataTransfer.files);
  },
};
const ConfigPad = ({ config }) => {
  return (
    <div>
      <Form
        onFinish={onFinish}
        initialValues={{
          ...config,
        }}
      >
        <Form.Item label="设备方向" name="orientation">
          <Radio.Group>
            <Radio.Button value="0">默认</Radio.Button>
            <Radio.Button value="1">竖屏</Radio.Button>
            <Radio.Button value="2">横屏</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="导航按钮" name="showBack">
          <Radio.Group>
            <Radio.Button value="VISIBLE">显示</Radio.Button>
            <Radio.Button value="GONE">隐藏</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="页面地址" name="url">
          <Input placeholder="http://172.16.17.96:8080/index.html" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            保存
          </Button>
          <Button
            style={{ marginLeft: 30 }}
            type="primary"
            onClick={() => {
              fetch('/app/restartApp');
            }}
          >
            重启APP
          </Button>

          <Button
            style={{ marginLeft: 30 }}
            type="primary"
            onClick={() => {
              fetch('/app/exitApp');
            }}
          >
            退出APP
          </Button>
        </Form.Item>
      </Form>
      <Dragger {...props}>
        <p className="ant-upload-text">点击 或 拖拽文件到这上传</p>
        <p className="ant-upload-hint">支持单个文件上传,文件格式为zip。上传后自动应用</p>
      </Dragger>
    </div>
  );
};
export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showConfig: sessionStorage.getItem('showConfig') || false,
      config: undefined,
    };
  }
  componentDidMount() {
    fetch('/app/getConfig')
      .then(res => res.json())
      .then(res => {
        this.setState({ config: res.data });
      });
  }
  render() {
    const { showConfig, config } = this.state;
    return (
      <div style={{ padding: 30 }}>
        {showConfig ? (
          config ? (
            <ConfigPad config={config} />
          ) : (
            <Spin />
          )
        ) : (
          <LoginPad
            callBack={() => {
              sessionStorage.setItem('showConfig', true);
              this.setState({ showConfig: true });
            }}
          />
        )}
      </div>
    );
  }
}
