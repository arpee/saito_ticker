import './App.css';
import { useEffect, useState } from 'react';
import { AdvancedChart } from "react-tradingview-embed";
//import Iframe from 'react-iframe';

import SaitoPrice from './components/SaitoPrice';
/*
import Footer from './components/Footer';
import MarketCapOf from './components/MarketCapOf';
import LargeBuy from './components/LargeBuy';
import SaitoDescription from './components/SaitoDescription';
import Github from './components/Github';
import Converter from './components/Converter';
*/
import burger_icon from './assets/001-menu.png';

function App() {

  const [saito, set_saito] = useState(undefined);
  const [average_price, set_average_price] = useState(undefined);
//  const [date, set_new_date] = useState(undefined);
  const [burger, set_burger] = useState(false);
 
/*  useEffect(() => {
    document.title = 'Saito Ticker - We love Saito';
  }, []);
*/
  useEffect(() => {
    get_saito();
  }, [set_saito]);

  const get_saito = () => {
    fetch('https://api.coingecko.com/api/v3/coins/saito')
    .then(response => response.json())
    .then(res => {
        set_saito(res);
        get_average(res.tickers);
    })
    .catch(err => console.log(err)) 
  }
  
  const get_average = (tickers) => {
    var total_volume = 0;
    var avg_price = 0;
    tickers.forEach(item => {
      //console.log(item);
      if(item.volume) {
        var vol = 0;
        if (item.volume.h24) {
            vol = item.volume.h24;
        } else {
            vol = item.volume;
        }
        if (vol > 500) {
          total_volume = total_volume + vol;
          avg_price = (item.converted_last.usd * vol) + avg_price;
         }
      } 
    });

    const average_result = avg_price / total_volume;
    set_average_price(average_result);
    document.title = average_result.toFixed(4)+' - Saito Ticker - We love Saito';
  }

  const open_burger = () => {
    var nav = document.getElementById("nav_id");
    if(burger) {
      nav.className = "";
      set_burger(false);
    } else {
      nav.className = "open_nav";
      set_burger(true);
    }
  }

  const close_nav = () => {
    var nav = document.getElementById("nav_id");
    nav.className = "";
    set_burger(false);
  }

  return (
    <div className="App">

      <div className="container_moove">
        <div className="moove">
          <p>We love Saito. Join us on RedSquare 🟥</p>
        </div>
      </div>

      <header>
        <div className="center_header">
          <h1>SaitoTicker 🚀 <span>{average_price && average_price.toFixed(4)+'$'}</span></h1>
          <nav id="nav_id">
            <ul>
              <li onClick={() => close_nav()}>
                <a href="#tickers">Tickers</a>
              </li>
              <li onClick={() => close_nav()}>
                <a href="#graphique">Graphique</a>
              </li>
            </ul>
          </nav>

          <img src={burger_icon} className="burger_menu_icon" onClick={(() => open_burger())}/>
        </div>
      </header>

      <SaitoPrice />

      <div className="container_graph2">
        <div className="button_graph">
          <div className="contain_chart" id="graphique">
            <AdvancedChart widgetProps={{"theme": "dark", "symbol": "SAITOUSDT", autosize: true }} />
          </div>
        </div>
      </div>

 
        
    </div>
  );
}

export default App;
