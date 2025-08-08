import Logo from "../components/Logo";
import SquaresBg from "./SquaresBg";
import SplitText from "../Animations/SplitText";
import { Link } from "react-router";

const SignupSigninOutline = ({ children, headline }) => {
  return (
    <SquaresBg>
      <main
        style={{
          padding: "30px 60px",
          borderRadius: "10px",
          width: "450px",
          backgroundColor: "rgba(255, 255, 255, 0.126)",
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.177)",
          boxShadow: "0 8px 32px 0 rgba(131, 131, 139, 0.32)",
        }}
      >
        <header
          style={{
            display: "flex",
            flexDirection: "column",
            alignContent: "center",
            justifyContent: "center",
            // padding: "20px",
          }}
          className="mb-7"
        >
          <Logo size={45} />
          <SplitText
            text={headline}
            className="text-2xl font-semibold text-center"
            delay={100}
            duration={0.6}
            ease="power3.out"
            splitType="words"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="center"
            //   onLetterAnimationComplete={handleAnimationComplete}
          />
        </header>
        {children}
      </main>
    </SquaresBg>
  );
};

export default SignupSigninOutline;
