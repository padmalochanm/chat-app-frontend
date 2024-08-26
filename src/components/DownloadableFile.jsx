const DownloadableFile = ({ fileUrl, fileName, fileType, isSender }) => {
  const handleFileClick = () => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderFile = () => {
    const style = {
      cursor: "pointer",
      width: "50%", // Set width to 50% of the parent container
      height: "auto",
    };

    if (fileType === "image") {
      return <img src={fileUrl} alt={fileName} style={style} />;
    } else if (fileType === "video") {
      return <video src={fileUrl} style={style} controls />;
    } else if (fileType === "pdf") {
      return <embed src={fileUrl} type="application/pdf" style={style} />;
    }
  };

  return (
    <div
      onClick={handleFileClick}
      className={`flex flex-col ${isSender ? "items-end" : "items-start"}`}
    >
      {renderFile()}
    </div>
  );
};

export default DownloadableFile;
