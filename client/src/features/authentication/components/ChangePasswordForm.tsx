import React, { memo } from 'react'
import { IChangePassword } from '../types/user.type'
import { Button, Form, FormProps, Input } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useAuthStore } from '../stores/auth.store'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import LoaderComponent from '@/components/container/loader-component'

const initValues: IChangePassword = {
  new_password: '',
  confirm_new_password: '',
}

const ChangePasswordForm = () => {
  const [form] = useForm<IChangePassword>()
  const onFinish: FormProps<IChangePassword>['onFinish'] = (values) => {
    changePasswordResult.mutate(values)
  }
  const onFinishFailed: FormProps<IChangePassword>['onFinishFailed'] = (
    errorInfo,
  ) => {
    console.log('Failed:', errorInfo)
  }

  const { changePassword } = useAuthStore()
  const changePasswordResult = useMutation({
    mutationFn: async (values: IChangePassword) => {
      return await changePassword(values)
    },
    onSuccess: (data) => {
      toast.success(data.message)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  return (
    <>
      {changePasswordResult.isPending && <LoaderComponent />}
      <div>
        <Form
          initialValues={initValues}
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
          className="space-y-4"
        >
          <div>
            <Form.Item<IChangePassword>
              label="New Password"
              name={'new_password'}
              rules={[
                {
                  required: true,
                  message: 'Please input your new password!',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item<IChangePassword>
              label="Confirm New Password"
              name={'confirm_new_password'}
              rules={[
                {
                  required: true,
                  message: 'Please confirm your new password!',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item className="mb-0">
              <Button htmlType="submit" type="primary">
                Update Me
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </>
  )
}

export default memo(ChangePasswordForm)
