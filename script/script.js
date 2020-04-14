
/*
Generates options for a select with numbers ranging from @min to @max.
@id is the id of the targeted select.
*/
var buildNumberPicker = function(id, min, max){
    max++ //Increment so that max is included in the loop

    for(let i = min; i < max; i++){
        //Append the option
        $("#" + id).append('<option value="'+i+'">'+i+'</option>')
    }
}

/*
Generates html code representing a table.
@id is the table's id.
@columns is an array containing the column names.
*/
var buildTable = function(id, columns){
    let table = '<table id="'+id+'"><tr>'

    columns.forEach(function(c){
        table += '<th>'+c+'</th>'
    })

    table += '</tr></table>'

    return table
}

/*
Generates html code representing a fieldset.
@id is the fieldset's id
*/
var buildFieldset = function(id){
    return '<fieldset id="'+id+'"></fieldset>'
}

/*
Generates html code representing a legend.
@title is the title of that legend
@content is the legend's content.  
    Its an array containing elements such as [elementId, elementDescription]
*/
var buildLegend = function(title, content){
    let legend = '<aside><b>'+title+'</b><br>'

    content.forEach(function(e){
        legend += '<span>'+e[0]+':</span> '+e[1]+'<br>'
    })

    legend += '</aside>'

    return legend
}

/*
Generates html code representing a radiobutton group.
@content is the group's elements.
    Its array containing elements such as [elementId, elementDescription]
@groupID is the group's identifier.
*/
var buildRadiobuttonGroup = function(elements, groupID){
    let group = ""

    elements.forEach(function(e){
        group += buildInput(e[0], e[1] , groupID, "radio")
    })

    return group
}

/*
Generates html code representing a checkbox group.
@content is the group's elements.
    Its array containing elements such as [elementId, elementDescription]
@groupID is the group's identifier.
*/
var buildCheckboxGroup = function(content, groupID){
    let group = ""

    content.forEach(function(e){
        group += buildInput(e[0], e[1] , groupID, "checkbox")
    })

    return group
}

/*
Generates html code representing an input.
@id is part of the input's id.
@label is the input label's content.
@groupID is the indentifier of the group for which the input belongs to.
@type is the input's type
Note that 
    the id is of the following format: groupID_id
    the name is of the following format: name_groupID
*/
var buildInput = function(id, label, groupID, type){
    return '<label><input type="'+type+'" id="'+groupID+'_'+depercent(id)+'" name="name_'+groupID+'" value="'+depercent(id)+'">'+label+'</label>'
}

/*
Generates html code representing a labeled information.
@id is the id of the label containing that info.
@label is the described information.
@information descrbibes the label.
*/
var buildLabeledInformation = function(id, label, information){
    return '\
        <label id="'+id+'">\
            <b>'+label+': </b>\
            <span>'+information+'</span>\
        </label>'
}

/*
Appends a fieldset to the specified element.
@element is the element to which the fieldset will be appended.
@id is the id of the fieldset.
The function returns the newly created fieldset.
*/
var appendFieldsetTo = function(element, id){
    element.append(buildFieldset(id))

    return $("#" + id)
}

/*
Titles an element.
@element is the element to be titled.
@title is the title.
@type is the type of title.  Example: h1, h2, ...
*/
var title = function(element, title, type){
    if(type == undefined){
        type = "h1"
    }
    element.append('<'+type+'>'+title+'</'+type+'>')
}

/*
Changes a matrix into an array.
@matrix is the matrix in which the array will be taken.
@index is the index of the column that is the array.
*/
var matrixToArray = function(matrix, index){
    let array = []

    matrix.forEach(function(e){
        array.push(e[index])
    })

    return array
}

/*
Separates a number in bunches of length 3 to enhance its readability.
@num is the number to be formatted.
The function returns a string representing the formatted number.
*/
var format = function(num){
    num += ""

    let formatted = ""

    let j = 0

    for(let i = num.length - 1; i >= 0; i--){
        if(j != 0 && j % 3 == 0){
            formatted = "." + formatted
        }
        formatted = num[i] + formatted
        j++
    }

    return formatted.split(".").join(" ")
};

/*
Separates a number representing money and adds a dollar sign.
@num is the number to be formatted.
The function returns a string representing the formatted number.
*/
var moneyFrom = function(num){
    return format(num) + "$"
}

/*
*/

//Replaces the % symbol to a code valid to most usages.
var depercent = function(str){
    return str.split("%").join("_prst_")
}

//Replaces the percentage code to the % symbol.
var percent = function(str){
    return str.split("_prst_").join("%")
}


/*
* The contains function determines if a given value is found within a given
* array
*
* @param tab Array which will be analyzed
* @param x Integer compared with every value in the array
* @return contains Boolean determining whether there is correspondance or not
* between a value from the given array and the given integer value
**/

var contains = function(tab, x) {
    var contains = true;
    for (var i = 0; i < tab.length; i++) {
        if (tab[i] == x) {
            return contains;
        }
    }
    return !contains;
};