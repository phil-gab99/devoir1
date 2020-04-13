var buildYearSelector = function(id, min, max){
    max++

    for(let i = min; i < max; i++){
        $("#" + id).append('<option value="'+i+'">'+i+'</option>')
    }
}

var buildFieldset = function(id){
    return '<fieldset id="'+id+'"></fieldset>'
}

var buildLabeledInformation = function(id, label, information){
    return '\
        <label id="'+id+'">\
            <b>'+label+': </b>\
            <span>'+information+'</span>\
        </label>'
}

var format = function(str){
    str += ""

    let formatted = "";

    let j = 0

    for(let i = str.length - 1; i >= 0; i--){
        if(j != 0 && j % 3 == 0){
            formatted = "." + formatted
        }
        formatted = str[i] + formatted
        console.log(formatted)
        j++
    }

    return formatted.split(".").join(" ")
};

var moneyFrom = function(str){

    return format(str) + "$"
}