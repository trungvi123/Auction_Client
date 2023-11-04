import Editor from "ckeditor5-custom-build/build/ckeditor";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import React from "react";

const TextEditor = ({
  description,
  handlerodDescription,
}: {
  description?: any;
  handlerodDescription: (state: string) => void;
}) => {
  const editorConfiguration = {
    toolbar: {
      items: [
        "heading",
        "|",
        "bold",
        "italic",
        "link",
        "bulletedList",
        "numberedList",
        "|",
        "outdent",
        "indent",
        "|",
        "imageUpload",
        "blockQuote",
        "mediaEmbed",
        "undo",
        "redo",
        // "alignment",
        // "code",
        // "codeBlock",
        // "findAndReplace",
        // "fontColor",
        // "fontFamily",
        // "fontSize",
        // "fontBackgroundColor",
        // "hightlight",
        // "horizontalLine",
        // "htmlEmbed",
        // "imageInsert",
      ],
    },
    language: "vi",
    image: {
      toolbar: [
        "imageTextAlternative",
        "toggleImageCaption",
        "imageStyle:inline",
        "imageStyle:block",
        "imageStyle:side",
      ],
    },
    table: {
      contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
    },
  };
  return (
    <div>
      <CKEditor
        editor={Editor}
        config={editorConfiguration}
        data={description}
        onChange={(event, editor) => {
          const data = editor.getData();
          handlerodDescription(data);
        }}
      ></CKEditor>
    </div>
  );
};
export default React.memo(TextEditor);
