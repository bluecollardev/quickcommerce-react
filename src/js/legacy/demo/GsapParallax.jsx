/**
 * react-gsap-parallax
 * 
 * https://github.com/theuprising/react-gsap-parallax
 * https://npmjs.com/package/react-gsap-parallax
 * https://unpkg.com/react-gsap-parallax/umd/react-gsap-parallax.min.js
 */

const { Parallax, ParallaxContainer } = window.ReactGsapParallax
const React = window.React
const { render } = window.ReactDOM

const Demo = () => (
  <ParallaxContainer height={5000} top={0} scrolljack={false} onScroll={x => x}>
    {/***********************************************/}
    <Parallax
      style={{ top: "75vh" }}
      keyframes={{
        "0%": { left: 0, ease: 'Linear.easeNone' },
        "100%": { left: "100vw", ease: 'Linear.easeNone' }
      }}
    >
      <div>
        LINEAR
      </div>
    </Parallax>
    {/***********************************************/}
    <Parallax
      style={{ top: "75vh" }}
      keyframes={{
        "0%": { left: 0, ease: 'Strong' },
        "100%": { left: "100vw", ease: 'Strong' }
      }}
    >
      <div>
        EASE
      </div>
    </Parallax>
    {/***********************************************/}
    <Parallax
      style={{ left: "50vw", top: "25vh" }}
      keyframes={{
        "30%": { fontSize: 0 },
        "40%": { fontSize: 64 }
      }}
    >
      <div>
        POP
      </div>
    </Parallax>
    {/***********************************************/}
    <Parallax
      style={{ left: "50vw", top: "50vh" }}
      keyframes={{
        "30%": { opacity: 0 },
        "40%": { opacity: 1 },
        "50%": { opacity: 0 }
      }}
    >
      <div>
        APPEAR
      </div>
    </Parallax>
    {/***********************************************/}
    <Parallax
      style={{
        height: "10vh"
      }}
      keyframes={{
        "0%": { top: "50vh" },
        "100%": { top: "-10vh" }
      }}
    >
      <div>
        MOVE SLOW
      </div>
    </Parallax>
    {/***********************************************/}
    <Parallax
      style={{
        height: "10vh"
      }}
      keyframes={{
        "0%": { top: "100vh" },
        "100%": { top: "-10vh" }
      }}
    >
      <div>
        MOVE
      </div>
    </Parallax>
    {/***********************************************/}
  </ParallaxContainer>
)

render(<Demo />, document.querySelector('#demo'))
