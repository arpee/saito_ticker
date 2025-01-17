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
  const [filters, set_filters] = useState([
    "Price USD",
    "5m",
    "1h",
    "24h",
    "Vol USD",
    "Liquidity USD",
  ]);
  const [initial_pairs, set_initial_pairs] = useState([]);
  const [pairs, set_pairs] = useState([]);
  const [start, set_start] = useState(false);
  const [selected_li, set_selected_li] = useState(undefined);

  const printRef = React.useRef();
  var tickers = null;

  useEffect(() => {
    get_tokens();
  }, []);

  //Get ETH & BSC pairs
  console.log("here we go");
  const get_tokens = async () => {
    var tokensResponseBsc = await getPairsMatchingBaseTokenAddress(
      "0x3c6DAd0475d3a1696B359dc04C99FD401BE134dA"
    );
    var tokensResponseEth = await getPairsMatchingBaseTokenAddress(
      "0xFa14Fa6958401314851A17d6C5360cA29f74B57B"
    );
    //var tokens_bsc = tokensResponseBsc.pairs;
    //var tokens_eth = tokensResponseEth.pairs;
    var tokens_all = tokensResponseEth.pairs.concat(tokensResponseBsc.pairs);
    var temp = [];
    tokens_all &&
      tokens_all.map((item) => {
        var vol = 0;
        if (item?.volume?.h24) {
          vol = item.volume.h24;
        } else {
          vol = item?.volume || 0;
        }
        if (vol > 500) {
          console.info("item: " + JSON.stringify(item));
          temp.push(item);
        }
      });
    temp.sort((a, b) => {
      return (b?.priceUsd || 0) - (a?.priceUsd || 0);
    });

    set_initial_pairs(temp);
    set_pairs(temp);

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
    var filter_array = initial_pairs;

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
    set_start(Math.floor(Math.random() * 1000));
  };

  return (
    <div className="container_all" id="tickers">
      <div className="filter_container">
        <ul>
          <li>Sort by</li>
          {filters &&
            filters.map((item, index) => {
              return (
                <li
                  onClick={() => filter_pairs(item)}
                  style={
                    selected_li === item
                      ? { backgroundColor: "white", color: "black" }
                      : {}
                  }
                  key={index}
                >
                  {item}
                </li>
              );
            })}
        </ul>
      </div>

      <div className="container_box">
        <div className="back_array" ref={printRef}>
          <div className="container_title_array">
            <ul className="array_title_container">
              <li>Chain</li>
              <li>Pair</li>
              {filters &&
                filters.map((item, index) => {
                  return (
                    <li onClick={() => filter_pairs(item)} key={index}>
                      {item}
                    </li>
                  );
                })}
            </ul>
          </div>

       

          <ul className="array_content">
            {pairs &&
              pairs.map((item, index) => {
                return (
                  <div className="container_full_line" key={index}>
                    <div className="full_line">
                      <li>
                        {item?.chainId === "bsc" ? (
                          <img src={bsc_icon} className="icon_chain" alt="#" />
                        ) : (
                          <img src={eth_icon} className="icon_chain" alt="#" />
                        )}
                        &nbsp; {item?.quoteToken?.symbol || ''}
                      </li>
                      <li>
                        {(item?.pairAddress || '').substring(0, 6)}...{" "}
                        <a href={item?.url || '#'} target="_blank">
                          <img src={link_icon} className="icon_link" alt="#" />
                        </a>
                      </li>
                      <li className="numero">
                        {(item?.priceUsd || 0).toLocaleString()}
                      </li>
                      <li className="numero">
                        {(item?.priceChange?.m5 || 0) < 0 ? (
                          <span className="negativ">
                            {(item?.priceChange?.m5 || 0) + "%"}
                          </span>
                        ) : (
                          <span className="positif">
                            {(item?.priceChange?.m5 || 0) + "%"}
                          </span>
                        )}
                      </li>
                      <li className="numero">
                        {(item?.priceChange?.h1 || 0) < 0 ? (
                          <span className="negativ">
                            {(item?.priceChange?.h1 || 0) + "%"}
                          </span>
                        ) : (
                          <span className="positif">
                            {(item?.priceChange?.h1 || 0) + "%"}
                          </span>
                        )}
                      </li>
                      <li className="numero">
                        {(item?.priceChange?.h24 || 0) < 0 ? (
                          <span className="negativ">
                            {(item?.priceChange?.h24 || 0) + "%"}
                          </span>
                        ) : (
                          <span className="positif">
                            {(item?.priceChange?.h24 || 0) + "%"}
                          </span>
                        )}
                      </li>
                      <li className="numero">
                        {((item?.volume?.h24 || 0)).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </li>
                      <li className="numero">
                        {((item?.liquidity?.usd || 0)).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </li>
                    </div>
                  </div>
                );
              })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SaitoPrice;
