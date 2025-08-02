import FaultyTerminal from "../Animations/FaultyTerminal";

const GlitchBg = ({ children }) => {
  return (
    <div
      className="relative w-screen h-screen"
      // style={{
      //   width: "100vw",
      //   height: "100vh",
      //   position: "relative",
      // }}
    >
      <div
        className="absolute z-[1]"
        // style={{
        //   position: "absolute",
        //   zIndex: 1,
        // }}
      >
        {children}
      </div>
      <FaultyTerminal
        scale={1.5}
        gridMul={[2, 1]}
        digitSize={1.2}
        timeScale={2}
        pause={false}
        scanlineIntensity={0.2}
        glitchAmount={1}
        flickerAmount={0.5}
        noiseAmp={0.8}
        chromaticAberration={0}
        dither={0}
        curvature={0.5}
        tint="#ffffff"
        mouseReact={true}
        mouseStrength={1}
        pageLoadAnimation={false}
        brightness={0.07}
      />
    </div>
  );
};

export default GlitchBg;
