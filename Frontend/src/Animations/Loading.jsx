import Orb from "./Orb";

const Loading = () => {
  return (
    <div className="relative bg-black text-white h-screen w-screen text-2xl flex justify-center content-center items-center">
      <Orb
        hoverIntensity={0.5}
        rotateOnHover={true}
        hue={0}
        forceHoverState={false}
      />
      <span className="absolute">Loading ...</span>
    </div>
  );
};

export default Loading;
