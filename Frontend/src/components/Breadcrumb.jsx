const Breadcrumb = ({ directory, setDirectory }) => {
  // if (!directory || directory.length === 0) return <h1>/</h1>;
  const len = directory.length;
  return (
    <>
      {
        <div
          className={`${len === 0 && "text-white"}  ${
            len !== 0 && "hover:text-[#4294FF] cursor-pointer"
          } `}
          onClick={() => {
            if (len === 0) return;
            setDirectory([]);
          }}
        >
          /
        </div>
      }
      {directory?.map((dir, ind) => (
        <span className="flex gap-1">
          <button
            className={`${
              ind !== len - 1 && "hover:text-[#4294FF] cursor-pointer"
            } ${ind === len - 1 && "text-white"}`}
            onClick={() => {
              if (len - 1 === ind) return;
              setDirectory(directory.filter((dirr, indd) => indd <= ind));
            }}
          >
            {dir.name}
          </button>
          <div className={`${ind === len - 1 && "text-white"}`}>/</div>
        </span>
      ))}
    </>
  );
};

export default Breadcrumb;
