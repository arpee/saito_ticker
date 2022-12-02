import '../App.css';
import React, { useEffect, useState } from 'react';

import { getPairsMatchingBaseTokenAddress } from 'dexscreener-api';

import bsc_icon from '../assets/bsc.png';
import eth_icon from '../assets/eth.png';
import link_icon from '../assets/link.png';


function SaitoPrice() {

    const [filters, set_filters] = useState(['Price', '5m', '1h', '24h', 'Vol', 'Liquidity']);
    const [initial_pairs, set_initial_pairs] = useState([]);
    const [pairs, set_pairs] = useState([]);
    const [start, set_start] = useState(false);
    const [selected_li, set_selected_li] = useState(undefined);


    useEffect(() => {
        get_tokens();
    }, []);
    
    
    //Get ETH & BSC pairs
    const get_tokens = async() => {
        var tokensResponseBsc = await getPairsMatchingBaseTokenAddress("0x3c6DAd0475d3a1696B359dc04C99FD401BE134dA");
        var tokensResponseEth = await getPairsMatchingBaseTokenAddress("0xFa14Fa6958401314851A17d6C5360cA29f74B57B");

        var tokens_bsc = tokensResponseBsc.pairs;
        var tokens_eth = tokensResponseEth.pairs;

        var temp = tokens_bsc;

        tokens_eth && tokens_eth.map(item => {
            temp.push(item);
        });

        set_initial_pairs(temp)
        set_pairs(temp);
    }
    

    //Filter with tag
    const filter_pairs = (param) => {

        var filter_array = initial_pairs;

        if(param === "Price") {
            filter_array.sort((a, b) => {
                return b.priceUsd - a.priceUsd;
            });
            set_pairs(filter_array);
            set_selected_li(param);
        } else if(param === "Liquidity"){
            filter_array.sort((a, b) => {
                return b.liquidity.usd - a.liquidity.usd;
            });
            set_pairs(filter_array);
            set_selected_li(param);
        } else if(param === "5m"){
            filter_array.sort((a, b) => {
                return b.priceChange.m5 - a.priceChange.m5;
            });
            set_pairs(filter_array);
            set_selected_li(param);
        } else if(param === "1h"){
            filter_array.sort((a, b) => {
                return b.priceChange.h1 - a.priceChange.h1;
            });
            set_pairs(filter_array);
            set_selected_li(param);

        } else if(param === "24h"){
            filter_array.sort((a, b) => {
                return b.priceChange.h24 - a.priceChange.h24;
            });
            set_pairs(filter_array);
            set_selected_li(param);
        } else if(param === "Vol"){
            filter_array.sort((a, b) => {
                return b.volume.h24 - a.volume.h24;
            });
            set_pairs(filter_array);
            set_selected_li(param);
        }

        set_start(Math.floor(Math.random() * 1000));

    }

    return (
        <div className="container_all">

            <div className="filter_container">
                <ul>
                    <li>Filter by</li>
                    {
                        filters && filters.map((item, index) => {
                            return (
                                <li
                                    onClick={() => filter_pairs(item)}
                                    style={selected_li === item ? {backgroundColor: 'white', color: 'black'} : {}}
                                    key={index}
                                >
                                    {item}
                                </li>
                            )
                        })
                    }
                </ul>
            </div>

            <div className="container_box">

                <div className="container_title_array">
                    <ul className="array_title_container">
                        <li>Chain</li>
                        <li>Pair</li>
                        {
                            filters && filters.map((item, index) => {
                                return (
                                    <li onClick={() => filter_pairs(item)} key={index}>{item}</li>
                                )
                            })
                        }
                    </ul>
                </div>

                <ul className="array_content">
                    {
                        pairs && pairs.map((item, index) => {
                            return (
                                <div className="container_full_line" key={index}>
                                    <div className="full_line">
                                        <li>{item.chainId === "bsc" ? <img src={bsc_icon} className="icon_chain" alt="#"/> : <img src={eth_icon} className="icon_chain" alt="#"/>}&nbsp; {item.quoteToken.symbol}</li>
                                        <li>{item.pairAddress.substring(0,6)}... <a href={item.url} target="_blank"><img src={link_icon} className="icon_link" alt="#" /></a></li>
                                        <li>{item.priceUsd}$</li>
                                        <li>{item.priceChange.m5 < 0 ? <span className="negativ">{item.priceChange.m5+'%'}</span> : <span className="positif">{item.priceChange.m5+'%'}</span>}</li>
                                        <li>{item.priceChange.h1 < 0 ? <span className="negativ">{item.priceChange.h1+'%'}</span> : <span className="positif">{item.priceChange.h1+'%'}</span>}</li>
                                        <li>{item.priceChange.h24 < 0 ? <span className="negativ">{item.priceChange.h24+'%'}</span> : <span className="positif">{item.priceChange.h24+'%'}</span>}</li>
                                        <li>{item.volume.h24.toFixed(2)+'$'}</li>
                                        <li>{item.liquidity.usd.toFixed(2)}$</li>
                                    </div>
                                </div>
                            );
                        })
                    }
                </ul>

            </div>


            <div className="container_sub_info">
                <h2 className="medium_title">Say hello to the community on <a href="https://saito.io/redsquare/#home" target="_blank" style={{color: 'white'}}>RedSquare</a> or come to <a href="https://saito.io/arcade/" target="_blank" style={{color: 'white'}}>battle</a> me on blackjack 😇</h2>
            </div>
        
        </div>
    );
}

export default SaitoPrice;