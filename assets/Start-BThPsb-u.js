import{r as l,j as t,R as re,T as oe,P as ne,M as ae,L as se,a as ie,B as le}from"./index-BwPoasN2.js";const K={black:"#000000",white:"#ffffff",red:"#ff0000",green:"#00ff00",blue:"#0000ff",fuchsia:"#ff00ff",cyan:"#00ffff",yellow:"#ffff00",orange:"#ff8000"};function Q(e){e.length===4&&(e=e[0]+e[1]+e[1]+e[2]+e[2]+e[3]+e[3]);const r=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);return r||console.warn(`Unable to convert hex string ${e} to rgb values`),[parseInt(r[1],16)/255,parseInt(r[2],16)/255,parseInt(r[3],16)/255]}function fe(e){return e=parseInt(e),[(e>>16&255)/255,(e>>8&255)/255,(e&255)/255]}function Z(e){return e===void 0?[0,0,0]:arguments.length===3?arguments:isNaN(e)?e[0]==="#"?Q(e):K[e.toLowerCase()]?Q(K[e.toLowerCase()]):(console.warn("Color format not recognised"),[0,0,0]):fe(e)}class E extends Array{constructor(r){return Array.isArray(r)?super(...r):super(...Z(...arguments))}get r(){return this[0]}get g(){return this[1]}get b(){return this[2]}set r(r){this[0]=r}set g(r){this[1]=r}set b(r){this[2]=r}set(r){return Array.isArray(r)?this.copy(r):this.copy(Z(...arguments))}copy(r){return this[0]=r[0],this[1]=r[1],this[2]=r[2],this}}const W=(e,r)=>{let s=e.startsWith("#")?e.slice(1):e;s.length===3&&(s=s.split("").map(j=>j+j).join(""));const i=parseInt(s,16);let m=i>>16&255,c=i>>8&255,o=i&255;return m=Math.max(0,Math.min(255,Math.floor(m*(1-r)))),c=Math.max(0,Math.min(255,Math.floor(c*(1-r)))),o=Math.max(0,Math.min(255,Math.floor(o*(1-r)))),"#"+((1<<24)+(m<<16)+(c<<8)+o).toString(16).slice(1).toUpperCase()},ce=({color:e="#5227FF",size:r=1,items:s=[],className:i=""})=>{const c=s.slice(0,3);for(;c.length<3;)c.push(null);const[o,j]=l.useState(!1),[k,M]=l.useState(Array.from({length:3},()=>({x:0,y:0}))),g=W(e,.08),R=W("#ffffff",.1),S=W("#ffffff",.05),v="#ffffff",N=()=>{j(f=>!f),o&&M(Array.from({length:3},()=>({x:0,y:0})))},z=(f,a)=>{if(!o)return;const u=f.currentTarget.getBoundingClientRect(),h=u.left+u.width/2,x=u.top+u.height/2,A=(f.clientX-h)*.15,I=(f.clientY-x)*.15;M(T=>{const y=[...T];return y[a]={x:A,y:I},y})},C=(f,a)=>{M(u=>{const h=[...u];return h[a]={x:0,y:0},h})},F={"--folder-color":e,"--folder-back-color":g,"--paper-1":R,"--paper-2":S,"--paper-3":v},$={transform:`scale(${r})`},D=f=>f===0?"translate(-120%, -70%) rotate(-15deg)":f===1?"translate(10%, -70%) rotate(15deg)":f===2?"translate(-50%, -100%) rotate(5deg)":"";return t.jsx("div",{style:$,className:i,children:t.jsx("div",{className:`group relative transition-all duration-200 ease-in cursor-pointer ${o?"":"hover:-translate-y-2"}`,style:{...F,transform:o?"translateY(-8px)":void 0},onClick:N,children:t.jsxs("div",{className:"relative w-[100px] h-[80px] rounded-tl-0 rounded-tr-[10px] rounded-br-[10px] rounded-bl-[10px]",style:{backgroundColor:g},children:[t.jsx("span",{className:"absolute z-0 bottom-[98%] left-0 w-[30px] h-[10px] rounded-tl-[5px] rounded-tr-[5px] rounded-bl-0 rounded-br-0",style:{backgroundColor:g}}),c.map((f,a)=>{let u="";a===0&&(u="w-[70%] h-[80%]"),a===1&&(u=o?"w-[80%] h-[80%]":"w-[80%] h-[70%]"),a===2&&(u=o?"w-[90%] h-[80%]":"w-[90%] h-[60%]");const h=o?`${D(a)} translate(${k[a].x}px, ${k[a].y}px)`:void 0;return t.jsx("div",{onMouseMove:x=>z(x,a),onMouseLeave:x=>C(x,a),className:`absolute z-20 bottom-[10%] left-1/2 transition-all duration-300 ease-in-out ${o?"hover:scale-110":"transform -translate-x-1/2 translate-y-[10%] group-hover:translate-y-0"} ${u}`,style:{...o?{transform:h}:{},backgroundColor:a===0?R:a===1?S:v,borderRadius:"10px"},children:f},a)}),t.jsx("div",{className:`absolute z-30 w-full h-full origin-bottom transition-all duration-300 ease-in-out ${o?"":"group-hover:[transform:skew(15deg)_scaleY(0.6)]"}`,style:{backgroundColor:e,borderRadius:"5px 10px 10px 10px",...o&&{transform:"skew(15deg) scaleY(0.6)"}}}),t.jsx("div",{className:`absolute z-30 w-full h-full origin-bottom transition-all duration-300 ease-in-out ${o?"":"group-hover:[transform:skew(-15deg)_scaleY(0.6)]"}`,style:{backgroundColor:e,borderRadius:"5px 10px 10px 10px",...o&&{transform:"skew(-15deg) scaleY(0.6)"}}})]})})})},Y=({children:e})=>t.jsx("p",{className:"text-[8px] p-2 text-gray-500",children:e}),ue=[t.jsx(Y,{children:"Lorem ipsum dolor sit amet consectetur."}),t.jsx(Y,{children:"Lorem ipsum dolor sit amet consectetur adipisicing elit."}),t.jsx(Y,{children:"Project Bin is developed by Anish with passion & 🖤"})],de=()=>t.jsx("div",{className:"flex",children:t.jsx("span",{className:"relative px-[200px] pt-[200px] pb-[50px] flex justify-center content-center",children:t.jsx(ce,{size:2,color:"#376CFB",items:ue,className:"custom-folder"})})}),me=`
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`,pe=`
precision mediump float;

varying vec2 vUv;

uniform float iTime;
uniform vec3  iResolution;
uniform float uScale;

uniform vec2  uGridMul;
uniform float uDigitSize;
uniform float uScanlineIntensity;
uniform float uGlitchAmount;
uniform float uFlickerAmount;
uniform float uNoiseAmp;
uniform float uChromaticAberration;
uniform float uDither;
uniform float uCurvature;
uniform vec3  uTint;
uniform vec2  uMouse;
uniform float uMouseStrength;
uniform float uUseMouse;
uniform float uPageLoadProgress;
uniform float uUsePageLoadAnimation;
uniform float uBrightness;

float time;

float hash21(vec2 p){
  p = fract(p * 234.56);
  p += dot(p, p + 34.56);
  return fract(p.x * p.y);
}

float noise(vec2 p)
{
  return sin(p.x * 10.0) * sin(p.y * (3.0 + sin(time * 0.090909))) + 0.2; 
}

mat2 rotate(float angle)
{
  float c = cos(angle);
  float s = sin(angle);
  return mat2(c, -s, s, c);
}

float fbm(vec2 p)
{
  p *= 1.1;
  float f = 0.0;
  float amp = 0.5 * uNoiseAmp;
  
  mat2 modify0 = rotate(time * 0.02);
  f += amp * noise(p);
  p = modify0 * p * 2.0;
  amp *= 0.454545; // 1/2.2
  
  mat2 modify1 = rotate(time * 0.02);
  f += amp * noise(p);
  p = modify1 * p * 2.0;
  amp *= 0.454545;
  
  mat2 modify2 = rotate(time * 0.08);
  f += amp * noise(p);
  
  return f;
}

float pattern(vec2 p, out vec2 q, out vec2 r) {
  vec2 offset1 = vec2(1.0);
  vec2 offset0 = vec2(0.0);
  mat2 rot01 = rotate(0.1 * time);
  mat2 rot1 = rotate(0.1);
  
  q = vec2(fbm(p + offset1), fbm(rot01 * p + offset1));
  r = vec2(fbm(rot1 * q + offset0), fbm(q + offset0));
  return fbm(p + r);
}

float digit(vec2 p){
    vec2 grid = uGridMul * 15.0;
    vec2 s = floor(p * grid) / grid;
    p = p * grid;
    vec2 q, r;
    float intensity = pattern(s * 0.1, q, r) * 1.3 - 0.03;
    
    if(uUseMouse > 0.5){
        vec2 mouseWorld = uMouse * uScale;
        float distToMouse = distance(s, mouseWorld);
        float mouseInfluence = exp(-distToMouse * 8.0) * uMouseStrength * 10.0;
        intensity += mouseInfluence;
        
        float ripple = sin(distToMouse * 20.0 - iTime * 5.0) * 0.1 * mouseInfluence;
        intensity += ripple;
    }
    
    if(uUsePageLoadAnimation > 0.5){
        float cellRandom = fract(sin(dot(s, vec2(12.9898, 78.233))) * 43758.5453);
        float cellDelay = cellRandom * 0.8;
        float cellProgress = clamp((uPageLoadProgress - cellDelay) / 0.2, 0.0, 1.0);
        
        float fadeAlpha = smoothstep(0.0, 1.0, cellProgress);
        intensity *= fadeAlpha;
    }
    
    p = fract(p);
    p *= uDigitSize;
    
    float px5 = p.x * 5.0;
    float py5 = (1.0 - p.y) * 5.0;
    float x = fract(px5);
    float y = fract(py5);
    
    float i = floor(py5) - 2.0;
    float j = floor(px5) - 2.0;
    float n = i * i + j * j;
    float f = n * 0.0625;
    
    float isOn = step(0.1, intensity - f);
    float brightness = isOn * (0.2 + y * 0.8) * (0.75 + x * 0.25);
    
    return step(0.0, p.x) * step(p.x, 1.0) * step(0.0, p.y) * step(p.y, 1.0) * brightness;
}

float onOff(float a, float b, float c)
{
  return step(c, sin(iTime + a * cos(iTime * b))) * uFlickerAmount;
}

float displace(vec2 look)
{
    float y = look.y - mod(iTime * 0.25, 1.0);
    float window = 1.0 / (1.0 + 50.0 * y * y);
    return sin(look.y * 20.0 + iTime) * 0.0125 * onOff(4.0, 2.0, 0.8) * (1.0 + cos(iTime * 60.0)) * window;
}

vec3 getColor(vec2 p){
    
    float bar = step(mod(p.y + time * 20.0, 1.0), 0.2) * 0.4 + 1.0; // more efficient than ternary
    bar *= uScanlineIntensity;
    
    float displacement = displace(p);
    p.x += displacement;

    if (uGlitchAmount != 1.0) {
      float extra = displacement * (uGlitchAmount - 1.0);
      p.x += extra;
    }

    float middle = digit(p);
    
    const float off = 0.002;
    float sum = digit(p + vec2(-off, -off)) + digit(p + vec2(0.0, -off)) + digit(p + vec2(off, -off)) +
                digit(p + vec2(-off, 0.0)) + digit(p + vec2(0.0, 0.0)) + digit(p + vec2(off, 0.0)) +
                digit(p + vec2(-off, off)) + digit(p + vec2(0.0, off)) + digit(p + vec2(off, off));
    
    vec3 baseColor = vec3(0.9) * middle + sum * 0.1 * vec3(1.0) * bar;
    return baseColor;
}

vec2 barrel(vec2 uv){
  vec2 c = uv * 2.0 - 1.0;
  float r2 = dot(c, c);
  c *= 1.0 + uCurvature * r2;
  return c * 0.5 + 0.5;
}

void main() {
    time = iTime * 0.333333;
    vec2 uv = vUv;

    if(uCurvature != 0.0){
      uv = barrel(uv);
    }
    
    vec2 p = uv * uScale;
    vec3 col = getColor(p);

    if(uChromaticAberration != 0.0){
      vec2 ca = vec2(uChromaticAberration) / iResolution.xy;
      col.r = getColor(p + ca).r;
      col.b = getColor(p - ca).b;
    }

    col *= uTint;
    col *= uBrightness;

    if(uDither > 0.0){
      float rnd = hash21(gl_FragCoord.xy);
      col += (rnd - 0.5) * (uDither * 0.003922);
    }

    gl_FragColor = vec4(col, 1.0);
}
`;function ge(e){let r=e.replace("#","").trim();r.length===3&&(r=r.split("").map(i=>i+i).join(""));const s=parseInt(r,16);return[(s>>16&255)/255,(s>>8&255)/255,(s&255)/255]}function ve({scale:e=1,gridMul:r=[2,1],digitSize:s=1.5,timeScale:i=.3,pause:m=!1,scanlineIntensity:c=.3,glitchAmount:o=1,flickerAmount:j=1,noiseAmp:k=1,chromaticAberration:M=0,dither:g=0,curvature:R=.2,tint:S="#ffffff",mouseReact:v=!0,mouseStrength:N=.2,dpr:z=Math.min(window.devicePixelRatio||1,2),pageLoadAnimation:C=!0,brightness:F=1,className:$,style:D,...f}){const a=l.useRef(null),u=l.useRef(null),h=l.useRef(null),x=l.useRef({x:.5,y:.5}),A=l.useRef({x:.5,y:.5}),I=l.useRef(0),T=l.useRef(0),y=l.useRef(0),q=l.useRef(Math.random()*100),P=l.useMemo(()=>ge(S),[S]),_=l.useMemo(()=>typeof g=="boolean"?g?1:0:g,[g]),O=l.useCallback(d=>{const b=a.current;if(!b)return;const n=b.getBoundingClientRect(),U=(d.clientX-n.left)/n.width,p=1-(d.clientY-n.top)/n.height;x.current={x:U,y:p}},[]);return l.useEffect(()=>{const d=a.current;if(!d)return;const b=new re({dpr:z});h.current=b;const n=b.gl;n.clearColor(0,0,0,1);const U=new oe(n),p=new ne(n,{vertex:me,fragment:pe,uniforms:{iTime:{value:0},iResolution:{value:new E(n.canvas.width,n.canvas.height,n.canvas.width/n.canvas.height)},uScale:{value:e},uGridMul:{value:new Float32Array(r)},uDigitSize:{value:s},uScanlineIntensity:{value:c},uGlitchAmount:{value:o},uFlickerAmount:{value:j},uNoiseAmp:{value:k},uChromaticAberration:{value:M},uDither:{value:_},uCurvature:{value:R},uTint:{value:new E(P[0],P[1],P[2])},uMouse:{value:new Float32Array([A.current.x,A.current.y])},uMouseStrength:{value:N},uUseMouse:{value:v?1:0},uPageLoadProgress:{value:C?0:1},uUsePageLoadAnimation:{value:C?1:0},uBrightness:{value:F}}});u.current=p;const te=new ae(n,{geometry:U,program:p});function X(){!d||!b||(b.setSize(d.offsetWidth,d.offsetHeight),p.uniforms.iResolution.value=new E(n.canvas.width,n.canvas.height,n.canvas.width/n.canvas.height))}const H=new ResizeObserver(()=>X());H.observe(d),X();const V=G=>{if(T.current=requestAnimationFrame(V),C&&y.current===0&&(y.current=G),m)p.uniforms.iTime.value=I.current;else{const B=(G*.001+q.current)*i;p.uniforms.iTime.value=B,I.current=B}if(C&&y.current>0){const w=G-y.current,L=Math.min(w/2e3,1);p.uniforms.uPageLoadProgress.value=L}if(v){const w=A.current,L=x.current;w.x+=(L.x-w.x)*.08,w.y+=(L.y-w.y)*.08;const J=p.uniforms.uMouse.value;J[0]=w.x,J[1]=w.y}b.render({scene:te})};return T.current=requestAnimationFrame(V),d.appendChild(n.canvas),v&&d.addEventListener("mousemove",O),()=>{cancelAnimationFrame(T.current),H.disconnect(),v&&d.removeEventListener("mousemove",O),n.canvas.parentElement===d&&d.removeChild(n.canvas),n.getExtension("WEBGL_lose_context")?.loseContext(),y.current=0,q.current=Math.random()*100}},[z,m,i,e,r,s,c,o,j,k,M,_,R,P,v,N,C,F,O]),t.jsx("div",{ref:a,className:`w-full h-full relative overflow-hidden ${$}`,style:D,...f})}const ee=({children:e})=>t.jsxs("div",{className:"relative w-screen h-screen",children:[t.jsx("div",{className:"absolute z-[1]",children:e}),t.jsx(ve,{scale:1.5,gridMul:[2,1],digitSize:1.2,timeScale:2,pause:!1,scanlineIntensity:.2,glitchAmount:1,flickerAmount:.5,noiseAmp:.8,chromaticAberration:0,dither:0,curvature:.5,tint:"#ffffff",mouseReact:!0,mouseStrength:1,pageLoadAnimation:!1,brightness:.07})]});function he({children:e,className:r="",colors:s=["#ffaa40","#9c40ff","#ffaa40"],animationSpeed:i=8,showBorder:m=!1}){const c={backgroundImage:`linear-gradient(to right, ${s.join(", ")})`,animationDuration:`${i}s`};return t.jsxs("div",{className:`relative mx-auto flex max-w-fit flex-row items-center justify-center rounded-[1.25rem] font-medium backdrop-blur transition-shadow duration-500 overflow-hidden cursor-pointer ${r}`,children:[m&&t.jsx("div",{className:"absolute inset-0 bg-cover z-0 pointer-events-none animate-gradient",style:{...c,backgroundSize:"300% 100%"},children:t.jsx("div",{className:"absolute inset-0 bg-black rounded-[1.25rem] z-[-1]",style:{width:"calc(100% - 2px)",height:"calc(100% - 2px)",left:"50%",top:"50%",transform:"translate(-50%, -50%)"}})}),t.jsx("div",{className:"inline-block relative z-2 text-transparent bg-cover animate-gradient",style:{...c,backgroundClip:"text",WebkitBackgroundClip:"text",backgroundSize:"300% 100%",fontSize:"45px",fontWeight:"700"},children:e})]})}const xe=({text:e,disabled:r=!1,speed:s=5,className:i=""})=>{const m=`${s}s`;return t.jsx("div",{className:`text-[#b5b5b5a4] bg-clip-text inline-block ${r?"":"animate-shine"} ${i}`,style:{backgroundImage:"linear-gradient(120deg, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0) 60%)",backgroundSize:"200% 100%",WebkitBackgroundClip:"text",animationDuration:m,fontSize:"20px"},children:e})},ye="Cloud based file system",be="A secure cloud workspace for storing, managing, and sharing your files effortlessly.",je=()=>t.jsxs(t.Fragment,{children:[t.jsx(ee,{children:t.jsxs("div",{style:{width:"100vw",height:"100vh",padding:"15px 5vw"},children:[t.jsxs("nav",{style:{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 40px",backgroundColor:"#ffffff3d",borderRadius:"50px"},children:[t.jsxs("span",{style:{display:"flex",justifyContent:"center",alignItems:"center",gap:"10px"},children:[t.jsx(se,{noMargin:!0}),t.jsx("span",{style:{color:"#ffffff",fontSize:"22px",fontWeight:"500"},children:"Bin"})]}),t.jsx(ie,{to:"/auth/signin",children:t.jsx(le,{type:"submit",variant:"contained",disableElevation:!0,sx:{fontSize:"16px",fontWeight:"500",color:"#ffffff",backgroundColor:"#376CFB",padding:"8px 20px","&:hover":{backgroundColor:"#0869d0"}},children:"Login"})})]}),t.jsxs("section",{style:{width:"100%",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",padding:"20px 0",gap:"10px"},children:[t.jsx(de,{}),t.jsxs("div",{style:{},children:[t.jsx(he,{colors:["#40ffaa","#4079ff","#40ffaa","#4079ff","#40ffaa"],animationSpeed:3,showBorder:!1,className:"custom-class",children:ye}),t.jsx("div",{style:{lineHeight:"1.1",width:"100%",maxWidth:"350px",textAlign:"center",margin:"0 auto"},children:t.jsx(xe,{text:be,disabled:!1,speed:3,className:"custom-class"})})]})]})]})}),t.jsx(ee,{children:t.jsx("div",{style:{width:"100vw",height:"100vh",padding:"0 5vw",display:"flex",justifyContent:"center"}})}),t.jsx("div",{style:{color:"white",backgroundColor:"black",height:"200px"},children:"Footer"})]});export{je as default};
