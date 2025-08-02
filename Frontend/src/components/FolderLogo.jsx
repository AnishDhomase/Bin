import Folder from "../Animations/Folder";

const Paper = ({ children }) => {
  return (
    <p
      className="text-[8px] p-2 text-gray-500"
      //   style={{
      //     fontSize: "8px",
      //     padding: "10px",
      //     fontColor: "gray",
      //   }}
    >
      {children}
    </p>
  );
};

const items = [
  <Paper>Lorem ipsum dolor sit amet consectetur.</Paper>,
  <Paper>Lorem ipsum dolor sit amet consectetur adipisicing elit.</Paper>,
  <Paper>Project Bin is developed by Anish with passion & 🖤</Paper>,
];

const FolderLogo = () => {
  return (
    <div
      className="flex"
      //   style={{
      //     display: "flex",
      //   }}
    >
      <span
        className="relative px-[200px] pt-[200px] pb-[50px] flex justify-center content-center"
        // style={{
        //   position: "relative",
        //   padding: "200px 200px 50px",
        //   display: "flex",
        //   justifyContent: "center",
        //   alignContent: "center",
        // }}
      >
        <Folder
          size={2}
          color="#376CFB"
          items={items}
          className="custom-folder"
        />
      </span>
    </div>
  );
};

export default FolderLogo;
