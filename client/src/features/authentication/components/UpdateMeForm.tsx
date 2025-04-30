import { FormProps, useForm } from 'antd/es/form/Form'
import { IUser } from '../types/user.type'
import { useAuthStore } from '../stores/auth.store'
import { useMutation, useQuery } from '@tanstack/react-query'
import { memo, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Button, Form, Input, Select } from 'antd'
import LoaderComponent from '@/components/container/loader-component'
import { genderOptions } from '../constants'
import { IMAGE_DEFAULT } from '@/constants/image.constant'

const initValues: Omit<IUser, '_id'> = {
  avatar: '',
  banner: '',

  name: '',
  nickname: '',
  phone_number: '',
  address: '',
  date_of_birth: '',
  email_address: '',
  gender: '',
  bio: '',

  link_website: '',
  link_instagram: '',
  link_facebook: '',
  link_twitter: '',
  link_linkedin: '',
  link_pinterest: '',
  link_youtube: '',
  link_github: '',

  work: '',
  education: '',
  skills: '',
}

const UpdateMeForm = () => {
  const [form] = useForm<IUser>()
  const onFinish: FormProps<IUser>['onFinish'] = (values) => {
    updateMeResult.mutate(values)
  }
  const onFinishFailed: FormProps<IUser>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  const { updateMe, getMe, user } = useAuthStore()

  // update form before changes
  const getMeResult = useQuery({
    queryKey: ['getMe'],
    queryFn: async () => {
      const response = await getMe()
      return response.data
    },
  })
  useEffect(() => {
    if (getMeResult.isSuccess) {
      form.setFieldsValue(user as IUser)
    }
  }, [user, form, getMeResult])

  const updateMeResult = useMutation({
    mutationFn: async (values: IUser) => {
      const formData = new FormData()
      Object.entries(values).forEach(([key, value]) =>
        formData.append(key, value as string),
      )
      if (avatarFile) {
        formData.append('avatarFile', avatarFile)
      }
      if (bannerFile) {
        formData.append('bannerFile', bannerFile)
      }

      const response = await updateMe(formData)
      return response
    },
    onSuccess: (data) => {
      toast.success(data?.message)
    },
    onError: (error) => {
      toast.error(error?.message)
    },
  })

  // file
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string>('')
  const [bannerPreview, setBannerPreview] = useState<string>('')
  useEffect(() => {
    if (avatarFile) {
      const avatarUrl = URL.createObjectURL(avatarFile)
      setAvatarPreview(avatarUrl)
    }
    if (bannerFile) {
      const bannerUrl = URL.createObjectURL(bannerFile)
      setBannerPreview(bannerUrl)
    }
    return () => {
      URL.revokeObjectURL(avatarPreview as string)
      URL.revokeObjectURL(bannerPreview as string)
    }
  }, [avatarFile, bannerFile])

  return (
    <>
      {(getMeResult.isLoading || updateMeResult.isPending) && (
        <LoaderComponent />
      )}
      <div>
        <Form
          initialValues={initValues}
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          layout="vertical"
          className="space-y-4"
        >
          {/* file  */}
          <div className="relative mb-20">
            {/* banner */}
            <label
              htmlFor="bannerFile"
              className="w-full h-48 overflow-hidden rounded block cursor-pointer"
            >
              <input
                id="bannerFile"
                name="bannerFile"
                accept="image/*"
                className="hidden"
                type="file"
                onChange={(e) => setBannerFile(e.target.files?.[0] as File)}
              />
              <img
                src={
                  bannerFile
                    ? bannerPreview
                    : user?.banner ?? IMAGE_DEFAULT.banner_notfound_image
                }
                alt={bannerPreview ?? IMAGE_DEFAULT.banner_notfound_image}
              />
            </label>
            {/* avatar */}
            <div className="absolute bg-white left-[50%] -translate-x-[50%] bottom-0 translate-y-14 rounded-full overflow-hidden">
              <label
                htmlFor="avatarFile"
                className="w-28 h-28 overflow-hidden rounded-full block cursor-pointer"
              >
                <input
                  id="avatarFile"
                  name="avatarFile"
                  accept="image/*"
                  className="hidden"
                  type="file"
                  onChange={(e) => setAvatarFile(e.target.files?.[0] as File)}
                />
                <img
                  src={
                    avatarFile
                      ? avatarPreview
                      : user?.avatar ?? IMAGE_DEFAULT.avatar_notfound_image
                  }
                  alt={avatarPreview ?? IMAGE_DEFAULT.avatar_notfound_image}
                />
                <div className="absolute text-center text-xs text-white font-medium bottom-0 left-0 right-0 h-[40%] pt-2 bg-black/50 w-full">
                  Update avatar
                </div>
              </label>
            </div>
          </div>
          {/* base */}
          <div>
            <Form.Item<IUser>
              label="Name"
              name={'name'}
              rules={[
                {
                  required: true,
                  message: 'Please input your name!',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item<IUser> label="Nickname" name={'nickname'}>
              <Input />
            </Form.Item>
            <Form.Item<IUser> label="Phone number" name={'phone_number'}>
              <Input />
            </Form.Item>
            <Form.Item<IUser> label="Address" name={'address'}>
              <Input />
            </Form.Item>
            <Form.Item<IUser> label="Date of birth" name={'date_of_birth'}>
              <Input type="date" />
            </Form.Item>
            <Form.Item<IUser> label="Email address" name={'email_address'}>
              <Input />
            </Form.Item>
            <Form.Item<IUser> label="Gender" name={'gender'}>
              <Select options={genderOptions} />
            </Form.Item>
            <Form.Item<IUser> label="Bio" name={'bio'} className="mb-0">
              <Input.TextArea rows={4} />
            </Form.Item>
          </div>

          <Form.Item className="mb-0">
            <Button htmlType="submit" type="primary">
              Update Me
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  )
}

export default memo(UpdateMeForm)
