import React, { useState } from "react";

function FileUpload() {
  const [file, setFile] = useState(null);

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("dwg", file);

    try {
      const response = await fetch("http://localhost:8080/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log(data);
    } catch (err) {
      console.error("There has been a problem with your fetch operation:", err);
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input type="file" name="dwgFile" onChange={onFileChange} />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export default FileUpload;
