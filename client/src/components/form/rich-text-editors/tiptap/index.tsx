import "./style.css";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import { TextAlign } from "@tiptap/extension-text-align";

import Menu from "./Menu";
import { memo } from "react";

interface Props {
  value?: string;
  onChange?: (value: string) => void;
}

const Tiptap = ({ value, onChange }: Props) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image.extend({
        defaultOptions: {
          ...Image.options,
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph", "image"],
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  return (
    <div className="border">
      <Menu editor={editor} />
      <EditorContent className="p-4" editor={editor} />
    </div>
  );
};

export default memo(Tiptap);
