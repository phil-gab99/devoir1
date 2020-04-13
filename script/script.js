var buildYearSelector = function(id, min, max){
    max++

    for(let i = min; i < max; i++){
        $("#" + id).append('<option value="'+i+'">'+i+'</option>')
    }
}

var buildTable = function(id, columns){

    let table = '<table id="'+id+'"><tr>'

    columns.forEach(function(c){
        table += '<th>'+c+'</th>'
    })

    table += '</tr></table>'

    return table
}

var buildFieldset = function(id){
    return '<fieldset id="'+id+'"></fieldset>'
}

var buildLegend = function(title, content){
    let legend = '<aside><b>'+title+'</b><br>'

    content.forEach(function(e){
        legend += '<span>'+e[0]+':</span> '+e[1]+'<br>'
    })

    legend += '</aside>'

    return legend
}

var buildRadiobuttonGroup = function(content, groupID){
    let group = ""

    content.forEach(function(e){
        group += buildInput(e[0], e[1] , groupID, "radio")
    })

    return group
}


var buildCheckboxGroup = function(content, groupID){
    let group = ""

    content.forEach(function(e){
        group += buildInput(e[0], e[1] , groupID, "checkbox")
    })

    return group
}

var buildInput = function(id, name, groupID, type){
    return '<label><input type="'+type+'" id="'+groupID+'_'+id+'" name="name_'+groupID+'">'+name+'</label>'
}

var buildLabeledInformation = function(id, label, information){
    return '\
        <label id="'+id+'">\
            <b>'+label+': </b>\
            <span>'+information+'</span>\
        </label>'
}

var appendFieldsetTo = function(element, id){
    element.append(buildFieldset(id))

    return $("#" + id)
}

var title = function(element, title, type){
    if(type == undefined){
        type = "h1"
    }
    element.append('<'+type+'>'+title+'</'+type+'>')
}

//changes a 2 dimensionnal array to a single dimentionnal array
var matrixToArray = function(matrix, index){
    let array = []

    matrix.forEach(function(e){
        array.push(e[index])
    })

    return array
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
        j++
    }

    return formatted.split(".").join(" ")
};

var moneyFrom = function(str){

    return format(str) + "$"
}