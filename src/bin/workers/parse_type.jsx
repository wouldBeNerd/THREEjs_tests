import {toNumber, toInteger } from "lodash"

import is_type from "../lib/is_type"
/**
 * 
 * @param {*} type 
 * @param {*} value 
 */
const parse_type = (type, value)=>{
    // console.log(type, value)
    switch (type) {
        case "string": return (value === undefined)? "" : String( value );
        case "boolean": return Boolean( value );
        case "email": return (value === undefined)? "" : String( value );
        case "number": return toInteger( value );
        case "float": return toNumber( value );
        case "password": return (value === undefined)? "" : String( value );
        case "datetime": return new Date( value );
        case "date": return new Date(`${value}`);
        case "object": return (value === undefined)? "" : value;
        // case "date": return new Date( `${value}T12:00:00.000Z` );
        // case ["string"]: return value.map( val =>{ return parse_type( "string", val) });
        // case ["number"]: return value.map( val =>{ return parse_type( "number", val) });
        // case ["float"]: return value.map( val =>{ return parse_type( "float", val) });
        default:
            //processs ["string"], ["number"], ["float"], ["string","number", "float"]
            if( is_type.arr(type) && value === undefined) return [];
            if( is_type.arr(type) && (is_type.arr(value) ) ){
                return value.map( (val, i)=>{//if one sub_type was defined
                    let sub_type = type[0]
                    if(type[i]) sub_type = type[i]
                    return parse_type( sub_type, val )
                })
            }
            // if( value === undefined) return "";
            console.error( `type: ${type} of value: ${JSON.stringify(value)} does not exist in parse_type` )
            return false;
    }

}
export default parse_type