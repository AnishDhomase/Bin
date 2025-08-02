import Logo from "../components/Logo";
import SquaresBg from "./SquaresBg";

const SignupSigninOutline = ({ children, headline }) => {
  return (
    <SquaresBg>
      <main
        style={{
          padding: "30px",
          borderRadius: "10px",
          width: "450px",
          backgroundColor: "rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.238)",
        }}
      >
        <header
          style={{
            display: "flex",
            flexDirection: "column",
            alignContent: "center",
            justifyContent: "center",
          }}
        >
          <Logo />
          <h1
            style={{
              fontSize: "30px",
              fontWeight: "500",
              color: "#45454c",
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            {headline}
          </h1>
        </header>
        {children}
      </main>
    </SquaresBg>
  );
};

export default SignupSigninOutline;
