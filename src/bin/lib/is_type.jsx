const typeOf = function(type){
    return function(x){
        if (typeof x === type)return true;
        else return false;
    }
}
const objectTypeOf = function(name){
    return function(o){
        if(Object.prototype.toString.call(o) === "[object "+name+"]") return true;
        else return false;
    }
} 
const is_function = (functionToCheck) =>{
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}
module.exports = {
    str : typeOf("string"),
    num : typeOf("number"),
    func : typeOf("function"),
    bool : typeOf("boolean"),
    obj : objectTypeOf("Object"),
    arr : objectTypeOf("Array"),
    date : objectTypeOf("Date"),
    div : objectTypeOf("HTMLDivElement"),
    fn : is_function
}
