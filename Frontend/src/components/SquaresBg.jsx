import Squares from "../Animations/Squares";

const SquaresBg = ({ children }) => {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        backgroundColor: "#000000",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "inline-block",
        }}
      >
        {children}
      </div>
      <Squares
        speed={0.7}
        squareSize={100}
        direction="right" // up, down, left, right, diagonal
        borderColor="#181818"
        hoverFillColor="#121212"
      />
    </div>
  );
};

export default SquaresBg;
