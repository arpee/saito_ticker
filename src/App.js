import './App.css';
import { useCallback, useEffect, useState } from 'react';
import { AdvancedChart } from "react-tradingview-embed";
//import Iframe from 'react-iframe';

import SaitoPrice from './components/SaitoPrice';
import saito_app_logo from './assets/SaitoAppLogo.png';
/*
import Footer from './components/Footer';
import MarketCapOf from './components/MarketCapOf';
import LargeBuy from './components/LargeBuy';
import SaitoDescription from './components/SaitoDescription';
import Github from './components/Github';
import Converter from './components/Converter';
*/

function App() {

  const [average_price, set_average_price] = useState(undefined);
  const [is_online, set_is_online] = useState(navigator.onLine);

  /*  useEffect(() => {
      document.title = 'SAITO Ticker - We love Saito';
    }, []);
  */
  useEffect(() => {
    const update_online_status = () => set_is_online(navigator.onLine);

    window.addEventListener('online', update_online_status);
    window.addEventListener('offline', update_online_status);

    return () => {
      window.removeEventListener('online', update_online_status);
      window.removeEventListener('offline', update_online_status);
    };
  }, []);

  const get_average = useCallback((tickers = []) => {
    var total_volume = 0;
    var avg_price = 0;
    tickers.forEach(item => {
      //console.log(item);
      if (item.volume) {
        var vol = 0;
        if (item.volume.h24) {
          vol = item.volume.h24;
        } else {
          vol = item.volume;
        }
        if (vol >= 0) {
          total_volume = total_volume + vol;
          avg_price = (item.converted_last.usd * vol) + avg_price;
        }
      }
    });

    if (total_volume === 0) {
      return;
    }

    const average_result = avg_price / total_volume;
    set_average_price(average_result);
    document.title = average_result.toFixed(4) + ' - SAITO Ticker';
  }, []);

  const get_saito = useCallback(() => {
    fetch('https://api.coingecko.com/api/v3/coins/saito')
      .then(response => response.json())
      .then(res => {
        get_average(res.tickers);
      })
      .catch(err => console.log(err))
  }, [get_average]);

  useEffect(() => {
    get_saito();
  }, [get_saito]);

  return (
    <div className="App">

      {!is_online && (
        <div className="offline_banner" role="status">
          Offline - showing cached data where available.
        </div>
      )}

      <header>
        <div className="center_header">
          <div className="header_brand">
            <img src={saito_app_logo} className="header_logo" alt="" />
            <h1>SAITO Ticker{average_price && ` - ${average_price.toFixed(6)}`}</h1>
          </div>
          <div className="header_links" aria-label="SAITO links">
            <a href="https://saito.io" target="_blank" rel="noreferrer">
              Web
            </a>
            <a href="https://wiki.saito.io" target="_blank" rel="noreferrer">
              Wiki
            </a>
          </div>
        </div>
      </header>

      <SaitoPrice />

      <div className="container_graph2">
        <div className="button_graph">
          <div className="contain_chart" id="graphique">
            <AdvancedChart widgetProps={{ "theme": "dark", "symbol": "SAITOUSDT", autosize: true }} />
          </div>
        </div>
      </div>



    </div>
  );
}

export default App;
