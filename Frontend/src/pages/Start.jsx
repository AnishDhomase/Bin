import Button from "@mui/material/Button";
import FolderLogo from "../components/FolderLogo";
import GlitchBg from "../components/GlitchBg";
import Logo from "../components/Logo";
import SquaresBg from "../components/SquaresBg";
import GradientText from "../Animations/GradientText";
import ShinyText from "../Animations/ShinyText";
import { Link } from "react-router";
import Cubes from "../Animations/Cubes";
const headline = "Cloud based file system";
const subHeadline =
  "A secure cloud workspace for storing, managing, and sharing your files effortlessly.";

const Start = () => {
  return (
    <>
      <GlitchBg>
        <div style={{ width: "100vw", height: "100vh", padding: "15px 5vw" }}>
          <nav
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 40px",
              backgroundColor: "#ffffff3d",
              borderRadius: "50px",

              // border: "1px solid gray",
            }}
          >
            <span
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <Logo noMargin={true} />
              <span
                style={{
                  color: "#ffffff",
                  fontSize: "22px",
                  fontWeight: "500",
                }}
              >
                Bin
              </span>
            </span>
            <Link to="/auth/signin">
              <Button
                type="submit"
                variant="contained"
                disableElevation
                sx={{
                  fontSize: "16px",
                  fontWeight: "500",
                  color: "#ffffff",
                  backgroundColor: "#376CFB",
                  padding: "8px 20px",
                  "&:hover": {
                    backgroundColor: "#0869d0",
                  },
                }}
              >
                Login
              </Button>
            </Link>
          </nav>
          <section
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "20px 0",
              // border: "1px solid gray",
              gap: "10px",
            }}
          >
            <FolderLogo />
            <div
              style={
                {
                  // border: "1px solid gray",
                }
              }
            >
              <GradientText
                colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                animationSpeed={3}
                showBorder={false}
                className="custom-class"
              >
                {headline}
              </GradientText>
              <div
                style={{
                  // border: "1px solid gray",
                  lineHeight: "1.1",
                  width: "100%",
                  maxWidth: "350px",
                  textAlign: "center",
                  margin: "0 auto",
                }}
              >
                <ShinyText
                  text={subHeadline}
                  disabled={false}
                  speed={3}
                  className="custom-class"
                />
              </div>
            </div>
          </section>
        </div>
      </GlitchBg>

      <GlitchBg>
        <div
          style={{
            width: "100vw",
            height: "100vh",
            padding: "0 5vw",
            // border: "1px solid red",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {/* <Cubes
            gridSize={12}
            maxAngle={90}
            radius={2}
            borderStyle="2px dashed #376bfb40"
            faceColor="#1a1a2e"
            rippleColor="#376bfb60"
            rippleSpeed={1.5}
            autoAnimate={true}
            rippleOnClick={true}
          />
          <div
            style={{
              color: "white",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "inline-block",
            }}
          >
            <div
              style={
                {
                  // border: "1px solid gray",
                }
              }
            >
              <GradientText
                colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                animationSpeed={3}
                showBorder={false}
                className="custom-class"
              >
                {headline}
              </GradientText>
              <div
                style={{
                  lineHeight: "1.1",
                  width: "100%",
                  maxWidth: "350px",
                  textAlign: "center",
                  margin: "0 auto",
                }}
              >
                <ShinyText
                  text="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Unde,
            cupiditate aspernatur assumenda dolorum maxime eveniet tenetur
            obcaecati ullam repellat. Praesentium?"
                  disabled={false}
                  speed={3}
                  className="custom-class"
                />
              </div>
            </div>
          </div> */}
          c{" "}
        </div>
      </GlitchBg>

      <div
        style={{
          color: "white",
          backgroundColor: "black",
          height: "200px",
        }}
      >
        Footer
      </div>
    </>
  );
};

export default Start;
