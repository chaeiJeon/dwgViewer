import React, { useState } from "react";
function FileUpload() {
  const [file, setFile] = useState(null);
  let viewer;

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  function onDocumentLoadSuccess(doc) {
    // A document contains references to 3D and 2D viewables.
    var viewables = window.Autodesk.Viewing.Document.getSubItemsWithProperties(
      doc.getRootItem(),
      { type: "geometry" },
      true
    );
    if (viewables.length === 0) {
      console.error("Document contains no viewables.");
      return;
    }

    // Choose any of the avialble viewables
    var initialViewable = viewables[0];
    var svfUrl = doc.getViewablePath(initialViewable);
    var modelOptions = {
      sharedPropertyDbPath: doc.getPropertyDbPath(),
    };

    var viewerDiv = document.getElementById("MyViewerDiv");
    viewer = new window.Autodesk.Viewing.Private.GuiViewer3D(viewerDiv);
    viewer.start(svfUrl, modelOptions, onLoadModelSuccess, onLoadModelError);
  }
  function onDocumentLoadFailure(viewerErrorCode) {
    console.error("onDocumentLoadFailure() - errorCode:" + viewerErrorCode);
  }
  function onLoadModelSuccess(model) {
    console.log("onLoadModelSuccess()!");
    console.log("Validate model loaded: " + (viewer.model === model));
    console.log(model);
  }
  function onLoadModelError(viewerErrorCode) {
    console.error("onLoadModelError() - errorCode:" + viewerErrorCode);
  }
  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("dwg", file);

    try {
      await fetch("http://localhost:8080/upload", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((res) => {
          const { urn, token } = res.data;
          console.log("translate success");
          console.log(urn);
          var options = {
            env: "AutodeskProduction",
            accessToken: token.access_token,
          };
          window.Autodesk.Viewing.Initializer(
            options,
            function onInitialized() {
              window.Autodesk.Viewing.Document.load(
                urn,
                onDocumentLoadSuccess,
                onDocumentLoadFailure
              );
            }
          );

          return;
        });
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
