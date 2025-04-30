import {
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import ReactQuill from 'react-quill-new'
import './style.css'
import { uploadImagesToCloud } from '@/services/upload-cloud.api'
import LoaderComponent from '@/components/container/loader-component'
interface Props {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  theme?: 'snow' | 'bubble'
  className?: string
  comment?: boolean

  onChangeUploadFiles?: (files: string[]) => void
}

const ReactQuillNew: FC<Props> = ({
  onChange,
  onChangeUploadFiles,
  placeholder,
  theme,
  value,
  comment,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [files, setFiles] = useState<string[]>([])

  const reactQuillNewRef = useRef<ReactQuill | null>(null)

  const imageHandler = useCallback(async () => {
    try {
      const input = document.createElement('input')
      input.setAttribute('type', 'file')
      input.setAttribute('accept', 'image/*')
      input.setAttribute('multiple', 'true')
      input.click()
      input.onchange = async function () {
        setIsLoading(true)
        if (input !== null && input.files !== null) {
          const files = input.files
          const response = await uploadImagesToCloud(files)

          const quill = reactQuillNewRef.current

          if (quill && response?.data?.length > 0) {
            for (const element of response.data) {
              const range = quill.getEditorSelection()
              if (range) {
                quill
                  .getEditor()
                  .insertEmbed(range.index, 'image', element?.url)
              }
              setFiles((prev) => [...prev, element?.url])
            }
          }
        }
        setIsLoading(false)
      }
    } catch (error) {
      console.error(error)
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (files.length > 0 && onChangeUploadFiles) {
      onChangeUploadFiles(files)
    }
  }, [files])

  // options
  const modulesOptions = useMemo(() => {
    if (comment) {
      return {
        toolbar: {
          container: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],

            ['bold', 'italic', 'underline', 'strike'], // toggled buttons
            ['blockquote', 'code-block'],
            ['link', 'image'],

            // [{ header: 1 }, { header: 2 }], // custom button values
            [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],

            [{ align: [] }],

            ['clean'], // remove formatting button
          ],
          handlers: {
            image: imageHandler,
          },
          clipboard: {
            matchVisual: false,
          },
        },
      }
    }
    return {
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],

          ['bold', 'italic', 'underline', 'strike'], // toggled buttons
          ['blockquote', 'code-block'],
          ['link', 'image', 'video', 'formula'],

          // [{ header: 1 }, { header: 2 }], // custom button values
          [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
          [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
          [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
          [{ direction: 'rtl' }], // text direction

          [{ color: [] }, { background: [] }], // dropdown with defaults from theme
          [{ font: [] }],
          [{ align: [] }],

          ['clean'], // remove formatting button
        ],
        handlers: {
          image: imageHandler,
        },
        clipboard: {
          matchVisual: false,
        },
      },
    }
  }, [imageHandler, comment])

  return (
    <>
      {isLoading && <LoaderComponent />}
      <ReactQuill
        ref={reactQuillNewRef}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        theme={theme}
        modules={modulesOptions}
      />
    </>
  )
}

export default memo(ReactQuillNew)
