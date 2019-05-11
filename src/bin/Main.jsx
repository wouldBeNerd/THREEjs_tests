import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import {
//   Route,
//   HashRouter,
//   Switch,
//   withRouter
// } from "react-router-dom";

import ThreeScene from "./components/ThreeScene"
import Curtain from "./threeJS_extensions/build/Curtain"
let curtain_test = Curtain()


class Main extends Component {
    // state = {

    // };
    
    // constructor(props){
    //   super(props)
      
    // }
    render(){
      return(

        <ThreeScene to_scene = {[ curtain_test ]} 
            id="cvcalc"
            onwheel={(e)=>e.preventDefault()}
            onmousewheel ={(e)=>e.preventDefault()}
        />
        )
    }
}

export default Main