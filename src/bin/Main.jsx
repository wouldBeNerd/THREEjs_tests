import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import {
//   Route,
//   HashRouter,
//   Switch,
//   withRouter
// } from "react-router-dom";

import ThreeScene from "./components/ThreeScene"
import Grid3D from "./threeJS_extensions/build/Grid3D"
let grid3D = Grid3D()


class Main extends Component {
    // state = {

    // };
    
    // constructor(props){
    //   super(props)
      
    // }
    render(){
      return(

        <ThreeScene to_scene = {[ grid3D ]} 
            id="cvcalc"
            onwheel={(e)=>e.preventDefault()}
            onmousewheel ={(e)=>e.preventDefault()}
        />
        )
    }
}

export default Main