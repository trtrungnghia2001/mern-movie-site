import React, { memo, useCallback, useMemo } from 'react'
import { Editor } from '@tiptap/core'
import clsx from 'clsx'
import { uploadImagesToCloud } from '@/services/upload-cloud.api'

import { RiBold, RiItalic, RiStrikethrough, RiParagraph } from 'react-icons/ri'
import {
  LuHeading1,
  LuHeading2,
  LuHeading3,
  LuHeading4,
  LuHeading5,
  LuHeading6,
  LuRedo,
  LuUndo,
} from 'react-icons/lu'
import { BiCode, BiCodeBlock } from 'react-icons/bi'
import {
  BsTextCenter,
  BsTextLeft,
  BsTextRight,
  BsTypeUnderline,
} from 'react-icons/bs'
import { IoListOutline } from 'react-icons/io5'
import { GoHorizontalRule } from 'react-icons/go'
import { TbBlockquote } from 'react-icons/tb'
import { FaFileImage } from 'react-icons/fa'
import { GrOrderedList } from 'react-icons/gr'

const Menu = ({ editor }: { editor: Editor | null }) => {
  const imageHandler = useCallback(() => {
    try {
      const input = document.createElement('input')
      input.setAttribute('type', 'file')
      input.setAttribute('accept', 'image/*')
      input.setAttribute('multiple', 'true')
      input.click()
      input.onchange = async function () {
        if (input !== null && input.files !== null) {
          const files = input.files
          const response = await uploadImagesToCloud(files)

          if (editor && response?.data?.length) {
            for (const element of response.data) {
              editor
                .chain()
                .focus()
                .setImage({
                  src: element?.secure_url,
                  alt: element?.secure_url,
                  title: element?.secure_url,
                })

                .run()
              editor.createNodeViews()
              console.log({ element })
            }
          }
        }
      }
    } catch (error) {
      console.error(error)
    }
  }, [editor])

  const buttons = useMemo(() => {
    if (editor) {
      return [
        {
          icon: <RiBold className="size-4" />,
          onClick: () => editor.chain().focus().toggleBold().run(),
          disabled: !editor.can().chain().focus().toggleBold().run(),
          isActive: editor.isActive('bold'),
        },
        {
          icon: <BsTypeUnderline className="size-4" />,
          onClick: () => editor.chain().focus().toggleUnderline().run(),
          disabled: !editor.can().chain().focus().toggleUnderline().run(),
          isActive: editor.isActive('underline'),
        },
        {
          icon: <RiItalic className="size-4" />,
          onClick: () => editor.chain().focus().toggleItalic().run(),
          disabled: !editor.can().chain().focus().toggleItalic().run(),
          isActive: editor.isActive('italic'),
        },
        {
          icon: <RiStrikethrough className="size-4" />,
          onClick: () => editor.chain().focus().toggleStrike().run(),
          disabled: !editor.can().chain().focus().toggleStrike().run(),
          isActive: editor.isActive('strike'),
        },
        {
          icon: <BiCode className="size-4" />,
          onClick: () => editor.chain().focus().toggleCode().run(),
          disabled: !editor.can().chain().focus().toggleCode().run(),
          isActive: editor.isActive('code'),
        },
        {
          icon: <BiCodeBlock className="size-4" />,
          onClick: () => editor.chain().focus().toggleCodeBlock().run(),
          disabled: !editor.can().chain().focus().toggleCodeBlock().run(),
          isActive: editor.isActive('codeBlock'),
        },
        {
          icon: <RiParagraph className="size-4" />,
          onClick: () => editor.chain().focus().setParagraph().run(),
          disabled: !editor.can().chain().focus().setParagraph().run(),
          isActive: editor.isActive('paragraph'),
        },
        {
          icon: <LuHeading1 className="size-4" />,
          onClick: () =>
            editor
              .chain()
              .focus()
              .toggleHeading({
                level: 1,
              })
              .run(),
          disabled: !editor
            .can()
            .chain()
            .focus()
            .toggleHeading({
              level: 1,
            })
            .run(),
          isActive: editor.isActive('heading', { level: 1 }),
        },
        {
          icon: <LuHeading2 className="size-4" />,
          onClick: () =>
            editor
              .chain()
              .focus()
              .toggleHeading({
                level: 2,
              })
              .run(),
          disabled: !editor
            .can()
            .chain()
            .focus()
            .toggleHeading({
              level: 2,
            })
            .run(),
          isActive: editor.isActive('heading', { level: 2 }),
        },
        {
          icon: <LuHeading3 className="size-4" />,
          onClick: () =>
            editor
              .chain()
              .focus()
              .toggleHeading({
                level: 3,
              })
              .run(),
          disabled: !editor
            .can()
            .chain()
            .focus()
            .toggleHeading({
              level: 3,
            })
            .run(),
          isActive: editor.isActive('heading', { level: 3 }),
        },
        {
          icon: <LuHeading4 className="size-4" />,
          onClick: () =>
            editor
              .chain()
              .focus()
              .toggleHeading({
                level: 4,
              })
              .run(),
          disabled: !editor
            .can()
            .chain()
            .focus()
            .toggleHeading({
              level: 4,
            })
            .run(),
          isActive: editor.isActive('heading', { level: 4 }),
        },
        {
          icon: <LuHeading5 className="size-4" />,
          onClick: () =>
            editor
              .chain()
              .focus()
              .toggleHeading({
                level: 5,
              })
              .run(),
          disabled: !editor
            .can()
            .chain()
            .focus()
            .toggleHeading({
              level: 5,
            })
            .run(),
          isActive: editor.isActive('heading', { level: 5 }),
        },
        {
          icon: <LuHeading6 className="size-4" />,
          onClick: () =>
            editor
              .chain()
              .focus()
              .toggleHeading({
                level: 6,
              })
              .run(),
          disabled: !editor
            .can()
            .chain()
            .focus()
            .toggleHeading({
              level: 6,
            })
            .run(),
          isActive: editor.isActive('heading', { level: 6 }),
        },
        {
          icon: <IoListOutline className="size-4" />,
          onClick: () => editor.chain().focus().toggleBulletList().run(),
          disabled: !editor.can().chain().focus().toggleBulletList().run(),
          isActive: editor.isActive('bulletList'),
        },
        {
          icon: <GrOrderedList className="size-4" />,
          onClick: () => editor.chain().focus().toggleOrderedList().run(),
          disabled: !editor.can().chain().focus().toggleOrderedList().run(),
          isActive: editor.isActive('orderedList'),
        },
        {
          icon: <TbBlockquote className="size-4" />,
          onClick: () => editor.chain().focus().toggleBlockquote().run(),
          disabled: !editor.can().chain().focus().toggleBlockquote().run(),
          isActive: editor.isActive('blockquote'),
        },
        {
          icon: <GoHorizontalRule className="size-4" />,
          onClick: () => editor.chain().focus().setHorizontalRule().run(),
          disabled: !editor.can().chain().focus().setHorizontalRule().run(),
          isActive: editor.isActive('horizontalRule'),
        },
        {
          icon: <LuUndo className="size-4" />,
          onClick: () => editor.chain().focus().undo().run(),
          disabled: !editor.can().chain().focus().undo().run(),
          isActive: editor.isActive('undo'),
        },
        {
          icon: <LuRedo className="size-4" />,
          onClick: () => editor.chain().focus().redo().run(),
          disabled: !editor.can().chain().focus().redo().run(),
          isActive: editor.isActive('redo'),
        },
        {
          icon: <FaFileImage />,
          onClick: () => {
            imageHandler()
          },
        },
        {
          icon: <BsTextLeft className="size-4" />,
          onClick: () => editor.chain().focus().setTextAlign('left').run(),
          disabled: !editor.can().chain().focus().setTextAlign('left').run(),
          isActive: editor.isActive('left'),
        },
        {
          icon: <BsTextCenter className="size-4" />,
          onClick: () => editor.chain().focus().setTextAlign('center').run(),
          disabled: !editor.can().chain().focus().setTextAlign('center').run(),
          isActive: editor.isActive('center'),
        },
        {
          icon: <BsTextRight className="size-4" />,
          onClick: () => editor.chain().focus().setTextAlign('right').run(),
          disabled: !editor.can().chain().focus().setTextAlign('right').run(),
          isActive: editor.isActive('right'),
        },
      ]
    }
    return []
  }, [editor])

  return (
    <div className="p-2 border-b flex flex-wrap gap-2 text-sm">
      {buttons.map(({ icon, onClick, isActive, disabled }, index) => (
        <button
          key={index}
          type="button"
          onClick={onClick}
          disabled={disabled}
          className={clsx([
            `hover:text-blue-500`,
            isActive ? 'text-blue-500' : '',
          ])}
        >
          {icon}
        </button>
      ))}
    </div>
  )
}

export default memo(Menu)
