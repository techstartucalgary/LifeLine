import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { classnames } from "../../Utilities";

interface Props {
  onDrop: (acceptedFiles: File[]) => void;
}

const Dropzone = ({ onDrop }: Props) => {
  const onDropCallback = useCallback(
    (acceptedFiles: File[]) => {
      onDrop(acceptedFiles);
    },
    [onDrop]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropCallback,
    accept: {
      "application/pdf": [".pdf"],
    },
  });

  return (
    <div
      {...getRootProps()}
      className={classnames(
        "h-full",
        "flex flex-col justify-center items-center",
        isDragActive ? "bg-gray-200" : "bg-gray-100"
      )}
    >
      <input {...getInputProps()} />
      <span className="material-symbols-outlined text-5xl">add</span>
      <p>
        {isDragActive
          ? "Drop the file(s) here..."
          : "To get started, drag and drop your course outlines here or click \"Add course\""}
      </p>
    </div>
  );
};

export default Dropzone;
