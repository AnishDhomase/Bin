import Squares from "../Animations/Squares";

const SquaresBg = ({ children }) => {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
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
        borderColor="#f5f2f2"
        hoverFillColor="#fbf7f7"
      />
    </div>
  );
};

export default SquaresBg;
