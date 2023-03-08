import io from "socket.io-client";
import { useEffect, useState, useRef } from "react";
import { Layout } from "antd";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

import "antd/dist/reset.css";
import 'leaflet/dist/leaflet.css'
import "./App.css";
import kisiLogo from "./img/kisi-logo.png";
import unlockIcon from "./img/unlock-icon.png";

const markerIcon = new L.Icon({
  iconUrl: require("./img/unlock-icon.png"),
  iconSize: [25, 25],
  iconAnchor: [10, 20]
})
const socket = io("http://localhost:4000", {
  transports: ["websocket", "polling"]
});
let newData = [];
function App() {
  const { Header, Content, Sider } = Layout;
  const mapRef = useRef();
  const [unlocksData, setUnlocksData] = useState([]);
  const [marksOnMap, setMarksOnMap] = useState([]);
  const [topsOnMap, setTopsOnMap] = useState([]);
  const [topCountries, setTopCountries] = useState([]);


  useEffect(() => {
    socket.on("unlock", (unlockData) => {
      setUnlocksData((prevData => [unlockData, ...prevData]));
    })
  }, []);
  useEffect(() => {
    let currentDate = new Date();
    let time = currentDate.getTime();

    //data to show on map
    let tempMapArray = unlocksData.filter((item) => {
      return (Math.abs(item.created_time - time) / 1000 <= 3)
    });
    setMarksOnMap(tempMapArray)

    //data to set as top states of last 1 min
    let tempTopsArray = unlocksData.filter((item) => {
      return (Math.abs(item.created_time - time) / 1000 <= 60)
    });
    // setTopsOnMap(tempTopsArray)
    newData = tempTopsArray;

  }, [unlocksData])


  useEffect(() => {

    const interval = setInterval(() => {
      //obtaining top states data 
      const result = Object.values(newData.reduce((r, e) => {
        let k = `${e.location.state_name}`;
        let km = e.location.state_name;
        if (!r[k]) r[k] = { km, count: 1 }
        else r[k].count += 1;
        return r;
      }, {}))

      let topCountriesData = result.sort((a, b) => parseFloat(b.count) - parseFloat(a.count));
      setTopCountries(topCountriesData)


    }, 15000);
    return () => clearInterval(interval);
  }, []);



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
                Details Inside Map
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
              {/* <div className="sider_details_box">
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
              </div> */}
              <article className="sider_header_text">
                Unlocks Details
              </article>
              <div className="globe_details_subholder">
                {
                  unlocksData.map((item, key) => {
                    return <article className="sider_details_text" key={key}>{item.location.state_name}, {item.location.admin_name}, {item.created_at} </article>
                  })
                }
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
                <div className="map_countrie_holder">
                  {/* map element which displays all the unlocked places */}
                  <MapContainer center={{
                    lat: 23.8504,
                    lng: 78.7500,
                  }} zoom={4} scrollWheelZoom={true} ref={mapRef}>
                    <TileLayer
                      url="https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=WlZsDGgEyr9sKXvvdqUW"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'

                    />
                    {
                      marksOnMap.map((item, key) => {
                        let lat = item.location.lat;
                        let lng = item.location.lng;
                        return <Marker key={key} position={{ lat, lng }} icon={markerIcon}>
                          <Popup>
                            A pretty CSS3 popup. <br /> Easily customizable.
                          </Popup>
                        </Marker>
                      })
                    }
                  </MapContainer>
                  <div className="top_country_box">
                    <article className="sider_header_text">
                      Top States / Count
                    </article>
                    {topCountries.length == 0 ? 'Analyzing Data...' : topCountries.slice(0, 3).map((country, key) => {
                      return <article key={key} className="sider_details_text">
                        {country.km} / {country.count}
                      </article>
                    })}
                  </div>
                </div>

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
    </div >
  );
}

export default App;
