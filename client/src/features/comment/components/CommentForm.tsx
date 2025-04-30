import { Button, Form } from 'antd'
import { FormProps, useForm } from 'antd/es/form/Form'
import React, { memo } from 'react'
import { IComment } from '../types/comment.type'
import { useCommentStore } from '../stores/comment.store'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import LoaderComponent from '@/components/container/loader-component'
import TextareaAutosize from 'react-textarea-autosize'
import { queryClient } from '@/main'
import { IAxiosResponseSuccess } from '@/types/response.type'
import { IResponseList } from '@/types/list.type'

const CommentForm = ({
  data_id,
  data_type,
  parent_comment,
  message,
}: {
  data_id: string
  data_type: string
  parent_comment?: string // reply
  message?: string // edit
  onClose?: () => void // close modal when editing or creating reply
}) => {
  const [form] = useForm()
  const onFinish: FormProps<IComment>['onFinish'] = (values) => {
    return createCommentResult.mutate(values.message)
  }
  const onFinishFailed: FormProps<IComment>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }

  const { createComment } = useCommentStore()
  const createCommentResult = useMutation({
    mutationFn: async (data: string) => {
      return await createComment({
        data_type: data_type,
        data_id: data_id,
        message: data,
      })
    },
    onSuccess: (data) => {
      toast.success(data.message)
      form.resetFields()
      queryClient.setQueryData(
        [
          `comments`,
          data.data.data_id,
          `data_id=${data.data.data_id}&data_type=${data.data.data_type}`,
        ],
        (oldData: {
          pages: IAxiosResponseSuccess<IResponseList<IComment>>[]
          pageParams: number[]
        }) => {
          const newData =
            oldData?.pages.map((page, idx) =>
              idx === 0
                ? {
                    ...page,
                    data: {
                      ...page.data,
                      results: [data.data, ...page.data.results],
                    },
                  }
                : page,
            ) ?? []

          return {
            pages: newData,
            pageParams: oldData?.pageParams ?? [],
          }
        },
      )
    },
    onError: (error) => {
      console.log({ error })

      toast.error(error.message)
    },
  })

  return (
    <>
      {createCommentResult.isPending && <LoaderComponent />}
      <Form
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout="vertical"
        className="space-y-1"
      >
        <Form.Item<IComment>
          className="m-0"
          name={'message'}
          rules={[
            {
              required: true,
              message: 'Please input your comment!',
            },
          ]}
        >
          <TextareaAutosize
            placeholder={parent_comment ? 'Add reply...' : 'Add comment...'}
            className="outline-none border-b w-full bg-transparent text-white py-1.5 focus:border-b-blue-500 focus:border-b-2 transition resize-none m-0"
          />
        </Form.Item>
        <Form.Item className="m-0">
          <Button htmlType="submit" type="primary">
            {message ? 'Edit' : 'Comment'}
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default memo(CommentForm)
