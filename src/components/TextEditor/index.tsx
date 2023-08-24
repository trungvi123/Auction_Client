import Editor from "ckeditor5-custom-build/build/ckeditor";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProdDescription } from "../../redux/utilsSlice";
import { IRootState } from "../../interface";

const TextEditor = () => {
  const dispatch = useDispatch();
  const dataText = useSelector((e: IRootState) => e.utils.prodDescription);

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
        data={dataText}
        onChange={(event, editor) => {
          const data = editor.getData();
          dispatch(setProdDescription(data));
        }}
      ></CKEditor>
    </div>
  );
};
export default React.memo(TextEditor);
