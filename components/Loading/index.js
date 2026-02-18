const Loading = () => {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "20px",
      }}
    >
      <img
        src="/img/loader.svg"
        alt="Loading..."
        style={{ width: "300px", height: "300px" }}
      />
    </div>
  );
};

export default Loading;
