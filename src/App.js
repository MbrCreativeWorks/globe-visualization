import io from "socket.io-client";
import { useEffect, useState, useRef, useCallback } from "react";
import Globe from "react-globe.gl";
import { Layout } from "antd";

import HEX_DATA from "./data/countries_hex_data.json";
import "antd/dist/reset.css";
import "./App.css";
import kisiLogo from "./img/kisi-logo.png";
import unlockIcon from "./img/unlock-icon.svg";

const socket = io("http://localhost:4000", {
  transports: ["websocket", "polling"]
});
function App() {
  const { Header, Content, Sider } = Layout;
  const markerSvg = ` 
  <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
   width="25.000000pt" height="25.000000pt" viewBox="0 0 512.000000 512.000000"
   preserveAspectRatio="xMidYMid meet">
  <metadata>
  Created by potrace 1.16, written by Peter Selinger 2001-2019
  </metadata>
  <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
  fill="#4a52ff" stroke="green">
  <path d="M1910 5099 c-418 -88 -762 -396 -895 -804 -80 -246 -74 -563 16 -795
  16 -43 98 -223 183 -401 l153 -323 -41 -20 c-59 -29 -138 -112 -172 -181 l-29
  -60 0 -1115 0 -1115 29 -60 c38 -77 114 -153 191 -191 l60 -29 1155 0 1155 0
  60 29 c77 38 153 114 191 191 l29 60 0 1115 0 1115 -29 60 c-17 33 -53 83 -80
  111 -28 27 -78 63 -111 80 l-60 29 -820 3 -820 3 -210 445 c-115 245 -219 469
  -229 497 -13 35 -21 87 -24 157 -3 91 0 115 21 182 46 145 148 265 282 333
  175 88 393 72 560 -43 114 -78 147 -132 354 -572 102 -216 192 -395 202 -401
  10 -5 32 -9 50 -9 40 0 477 193 502 222 9 11 17 35 17 52 0 35 -343 771 -412
  885 -176 290 -479 497 -812 556 -127 22 -345 19 -466 -6z m415 -154 c268 -43
  512 -192 672 -408 25 -34 68 -107 96 -162 73 -145 318 -667 315 -671 -2 -1
  -28 -13 -58 -26 l-55 -24 -121 245 c-143 290 -246 451 -376 586 -176 185 -356
  274 -586 291 -240 18 -498 -89 -684 -284 -109 -114 -149 -201 -169 -365 -14
  -115 -2 -244 52 -557 34 -193 41 -260 42 -375 1 -79 -3 -148 -9 -157 -8 -15
  -32 30 -129 235 -65 138 -131 290 -146 337 -155 481 72 1014 527 1239 203 100
  411 132 629 96z m1375 -2329 c49 -26 88 -64 113 -111 l22 -40 0 -1065 c0
  -1020 -1 -1066 -19 -1100 -26 -49 -64 -88 -111 -113 l-40 -22 -1105 0 -1105 0
  -40 22 c-52 28 -89 68 -114 123 -20 44 -21 60 -21 1084 0 787 3 1049 12 1080
  15 51 99 137 148 153 25 8 350 11 1130 10 1048 -2 1097 -3 1130 -21z"/>
  <path d="M2459 2146 c-106 -28 -210 -121 -251 -224 -17 -43 -22 -78 -23 -143
  0 -79 3 -91 38 -161 21 -43 53 -90 74 -108 l36 -32 -62 -276 c-33 -153 -61
  -297 -61 -322 0 -59 27 -108 79 -145 l43 -30 228 0 228 0 43 30 c52 37 79 86
  79 145 0 25 -28 169 -61 322 l-62 276 36 32 c21 18 53 65 74 108 35 71 38 82
  37 161 -1 108 -27 180 -91 251 -98 110 -244 154 -384 116z"/>
  <path d="M3620 4460 c-19 -19 -20 -33 -20 -260 0 -227 1 -241 20 -260 13 -13
  33 -20 60 -20 27 0 47 7 60 20 19 19 20 33 20 260 0 227 -1 241 -20 260 -13
  13 -33 20 -60 20 -27 0 -47 -7 -60 -20z"/>
  <path d="M4018 4142 c-174 -174 -178 -178 -178 -220 0 -29 6 -48 20 -62 14
  -14 33 -20 62 -20 42 0 46 4 220 178 174 174 178 178 178 220 0 29 -6 48 -20
  62 -14 14 -33 20 -62 20 -42 0 -46 -4 -220 -178z"/>
  <path d="M4020 3740 c-13 -13 -20 -33 -20 -60 0 -27 7 -47 20 -60 19 -19 33
  -20 220 -20 187 0 201 1 220 20 13 13 20 33 20 60 0 27 -7 47 -20 60 -19 19
  -33 20 -220 20 -187 0 -201 -1 -220 -20z"/>
  </g>
  </svg>
  `;
  const globeEl = useRef();
  const location = {
    latitude: 23.424076,
    longitude: 53.847818,
  };
  let gDatatemp = {
    lat: location.latitude,
    lng: location.longitude,
  };

  const [unlocksData, setUnlocksData] = useState([]);
  const [gData, setGData] = useState([gDatatemp]);
  const [selectedCountry, setSelectedCountry] = useState({
    lat: location.latitude,
    lng: location.longitude,
    label: "New Door Unlocked Here",
  });
  const [hex, setHex] = useState({ features: [] });

  useEffect(() => {
    //connecting with the websocket
    socket.on("unlock", (unlockData) => {
      (async () => {
        //storing all unlocked events data
        setUnlocksData((prevData => [unlockData, ...prevData]
        ))
        const unlockedData = unlockData;
        // to display new unlocked place on globe
        setSelectedCountry({
          lat: unlockedData.location.latitude,
          lng: unlockedData.location.longitude,
          label: unlockedData.message,
        });
        //storing all unlocked places to show on Globe
        setGData((prevData) => [
          {
            lat: unlockedData.location.latitude,
            lng: unlockedData.location.longitude,
          },
          ...prevData,
        ]);
      })();
    });
    setHex(HEX_DATA);
  }, []);
  //changing globe pointofview every selectedcountry changes
  useEffect(() => {
    const countryLocation = {
      lat: selectedCountry.lat,
      lng: selectedCountry.lng,
      altitude: 1.5,
    };
    globeEl.current.pointOfView(countryLocation, 0);
  }, [selectedCountry]);
  return (
    <div className="app_main_holder">
      <Layout>
        <Header className="layout_header_element">
          <div className="logo">
            <img width={60} src={kisiLogo} alt='kisi logo' />
          </div>
        </Header>
        <Layout className="layout_sider_content">
          <Sider className="layout_sider_element">
            <div className="globe_details_holder">
              <article className="sider_header_text">
                Details Inside Globe
              </article>
              <div className="sider_details_box">
                <img
                  style={{ marginBottom: "5px" }}
                  width={30}
                  src={unlockIcon}
                  alt="unlock-icon"
                />
                <article className="sider_details_text">
                  Unlocked Locations
                </article>
              </div>
              <div className="sider_details_box">
                <div className="sider_details_icon"></div>
                <article className="sider_details_text">
                  Large Sea Areas
                </article>
              </div>
              <div className="sider_details_box">
                <div className="sider_details_icon">
                  {[...Array(9).keys()].map((key) => (
                    <div key={key}></div>
                  ))}
                </div>
                <article className="sider_details_text">
                  Locks Linked with Kisi
                </article>
              </div>
            </div>
          </Sider>
          <Layout className="layout_content_holder">
            <Content className="layout_content_element">
              <h1 className="main_heading_text">
                Real Time Unlocks Data Visualization
              </h1>
              <div className="globe_main_holder">
                <article className="sub_heading_text">
                  Unlocks Triggered in Real Time
                </article>
                {/* globe element which displays all the unlocked places */}
                <Globe
                  globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
                  backgroundColor="rgba(0,0,0,0)"
                  animateIn={true}
                  waitForGlobeReady={true}
                  width={
                    window.innerWidth >= 1200
                      ? 800
                      : window.innerWidth >= 525
                        ? 600
                        : 280
                  }
                  height={
                    window.innerWidth >= 1200
                      ? 500
                      : window.innerWidth >= 525
                        ? 400
                        : 300
                  }
                  htmlElementsData={gData}
                  htmlElement={(d) => {
                    const el = document.createElement("div");
                    el.innerHTML = markerSvg;
                    el.style.color = "#4a52ff";
                    el.style.width = "24px";

                    el.style["pointer-events"] = "auto";
                    el.style.cursor = "pointer";
                    el.onclick = () => console.info(d);
                    return el;
                  }}
                  ref={globeEl}
                  labelsData={[selectedCountry]}
                  labelText={"label"}
                  labelSize={1.6}
                  labelColor={useCallback(() => "white", [])}
                  labelDotRadius={0.2}
                  labelAltitude={0.1}
                  hexPolygonsData={hex.features}
                  hexPolygonResolution={3} //values higher than 3 makes it buggy
                  hexPolygonMargin={0.62}
                  hexPolygonColor={useCallback(() => "#1b66b1", [])}
                />
              </div>
              <h1 className="main_heading_text">Our Mission</h1>
              <div className="globe_main_holder">
                <article className="sider_details_text">
                  Develop innovative products and solutions to ensure ease of
                  facility access and remote space management. Provide access
                  systems to create a secure future where spaces are connected
                  and accessible without boundaries.
                </article>
              </div>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </div>
  );
}

export default App;
