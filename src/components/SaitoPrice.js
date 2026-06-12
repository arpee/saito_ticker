import { getPairsMatchingBaseTokenAddress } from "dexscreener-api";
import React, { useEffect, useState } from "react";
import "../App.css";
import bsc_icon from "../assets/bsc.png";
import eth_icon from "../assets/eth.png";
import link_icon from "../assets/link.png";
/*
import html2canvas from 'html2canvas';
import saito_white from '../assets/saito_white.png';
*/
function SaitoPrice() {
  const [filters] = useState([
    "Price USD",
    "5m",
    "1h",
    "24h",
    "Vol USD",
    "Liquidity USD",
  ]);
  const [initial_pairs, set_initial_pairs] = useState([]);
  const [pairs, set_pairs] = useState([]);
  const [selected_li, set_selected_li] = useState(undefined);
  const [loading, set_loading] = useState(true);
  const [error, set_error] = useState(false);

  useEffect(() => {
    get_tokens();
  }, []);

  //Get ETH & BSC pairs
  const get_tokens = async () => {
    set_loading(true);
    set_error(false);

    try {
      var tokensResponseBsc = await getPairsMatchingBaseTokenAddress(
        "0x3c6DAd0475d3a1696B359dc04C99FD401BE134dA"
      );
      var tokensResponseEth = await getPairsMatchingBaseTokenAddress(
        "0xFa14Fa6958401314851A17d6C5360cA29f74B57B"
      );
      //var tokens_bsc = tokensResponseBsc.pairs;
      //var tokens_eth = tokensResponseEth.pairs;
      var tokens_all = (tokensResponseEth.pairs || []).concat(tokensResponseBsc.pairs || []);
      var temp = [];
      tokens_all.forEach((item) => {
        var vol = 0;
        var liquidity = 0;
        if (item?.volume?.h24) {
          vol = item.volume.h24;
        } else {
          vol = item?.volume || 0;
        }
        if (item?.liquidity?.usd) {
          liquidity = item.liquidity.usd;
        } else {
          liquidity = item?.liquidity || 0;
        }
        if (vol >= 1 && liquidity >= 500) {
          temp.push(item);
        }
      });
      temp.sort((a, b) => {
        return (b?.priceUsd || 0) - (a?.priceUsd || 0);
      });

      set_initial_pairs(temp);
      set_pairs(temp);
    } catch (err) {
      console.log(err);
      set_error(true);
    } finally {
      set_loading(false);
    }

    /*
        fetch('https://api.coingecko.com/api/v3/coins/saito')
        .then(response => response.json())
        .then(res => {
            tickers = res.tickers;
            console.log( res );
            <div className="otherData">
            {tickers.forEach((item) => {
                return (
                    <div>{JSON.stringify(item)}</div>
                )
            })}
          </div> 
        })
        .catch(err => console.log(err)) 
      */  
  };

  //Filter with tag
  const filter_pairs = (param) => {
    var filter_array = [...initial_pairs];

    if (param === "Price USD") {
      filter_array.sort((a, b) => {
        return (b?.priceUsd || 0) - (a?.priceUsd || 0);
      });
      set_pairs(filter_array);
      set_selected_li(param);
    } else if (param === "Liquidity USD") {
      filter_array.sort((a, b) => {
        return (b?.liquidity?.usd || 0) - (a?.liquidity?.usd || 0);
      });
      set_pairs(filter_array);
      set_selected_li(param);
    } else if (param === "5m") {
      filter_array.sort((a, b) => {
        return (b?.priceChange?.m5 || 0) - (a?.priceChange?.m5 || 0);
      });
      set_pairs(filter_array);
      set_selected_li(param);
    } else if (param === "1h") {
      filter_array.sort((a, b) => {
        return (b?.priceChange?.h1 || 0) - (a?.priceChange?.h1 || 0);
      });
      set_pairs(filter_array);
      set_selected_li(param);
    } else if (param === "24h") {
      filter_array.sort((a, b) => {
        return (b?.priceChange?.h24 || 0) - (a?.priceChange?.h24 || 0);
      });
      set_pairs(filter_array);
      set_selected_li(param);
    } else if (param === "Vol USD") {
      filter_array.sort((a, b) => {
        return (b?.volume?.h24 || 0) - (a?.volume?.h24 || 0);
      });
      set_pairs(filter_array);
      set_selected_li(param);
    }
  };

  const format_price = (value) => {
    const number = Number(value || 0);
    return number.toLocaleString(undefined, {
      minimumFractionDigits: number < 1 ? 6 : 2,
      maximumFractionDigits: number < 1 ? 6 : 2,
    });
  };

  const format_number = (value) => {
    return Number(value || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const render_change = (value) => {
    const number = Number(value || 0);
    const className = number < 0 ? "negativ" : "positif";

    return <span className={`ticker_metric_value ${className}`}>{number.toLocaleString()}%</span>;
  };

  const get_chain_icon = (item) => {
    return item?.chainId === "bsc" ? bsc_icon : eth_icon;
  };

  return (
    <section className="container_all ticker_section" id="tickers">
      <div className="ticker_toolbar" aria-label="Ticker sorting controls">
        <span className="ticker_toolbar_label">Sort by</span>
        <div className="ticker_filter_group">
          {filters.map((item) => {
            const isActive = selected_li === item;
            return (
              <button
                className={isActive ? "ticker_filter active" : "ticker_filter"}
                type="button"
                onClick={() => filter_pairs(item)}
                key={item}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>

      <div className="ticker_list" aria-live="polite">
        {loading && <p className="ticker_status">Loading pairs...</p>}
        {error && <p className="ticker_status">Unable to load pairs.</p>}

        {!loading &&
          !error &&
          pairs.map((item) => {
            return (
              <article className="ticker_card" key={item?.pairAddress || item?.url}>
                <div className="ticker_pair">
                  <div className="ticker_chain">
                    <img src={get_chain_icon(item)} className="icon_chain" alt="" />
                    <span className="ticker_quote">{item?.quoteToken?.symbol || ""}</span>
                  </div>
                  <a
                    className="ticker_pair_link"
                    href={item?.url || "#"}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {(item?.pairAddress || "").substring(0, 6)}...
                    <img src={link_icon} className="icon_link" alt="" />
                  </a>
                </div>

                <div className="ticker_metric ticker_price">
                  <span className="ticker_metric_label">Price USD</span>
                  <strong>${format_price(item?.priceUsd)}</strong>
                </div>
                <div className="ticker_metric ticker_change ticker_change_5m">
                  <span className="ticker_metric_label">5m</span>
                  {render_change(item?.priceChange?.m5)}
                </div>
                <div className="ticker_metric ticker_change ticker_change_1h">
                  <span className="ticker_metric_label">1h</span>
                  {render_change(item?.priceChange?.h1)}
                </div>
                <div className="ticker_metric ticker_change ticker_change_24h">
                  <span className="ticker_metric_label">24h</span>
                  {render_change(item?.priceChange?.h24)}
                </div>
                <div className="ticker_metric ticker_volume">
                  <span className="ticker_metric_label">Vol USD</span>
                  <strong>${format_number(item?.volume?.h24)}</strong>
                </div>
                <div className="ticker_metric ticker_liquidity">
                  <span className="ticker_metric_label">Liquidity USD</span>
                  <strong>${format_number(item?.liquidity?.usd)}</strong>
                </div>
              </article>
            );
          })}
      </div>
    </section>
  );
}

export default SaitoPrice;
