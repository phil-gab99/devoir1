
//Called onload.
var initComposition = function(){
    //Make the year picker
    buildNumberPicker("year-composition", 1969, 2004)

    $("#comp-filter-btn").click(update)
}

//Updates the page in general
var update = function(){
    let year = $("#year-composition option:selected").text()

    let showFielding = $("#showFielding").is(':checked')
    let showPitching = $("#showPitching").is(':checked')
    let showManager = $("#showManager").is(':checked')
    let showAttendance = $("#showAttendance").is(':checked')
    let showSalaryMass = $("#showSalaryMass").is(':checked')

    //Details section
    updateTeamDetails(showManager, showAttendance, showSalaryMass, year)

    //Fielding section
    $("#fielding-container").html('')
    if(showFielding){
        displayFielding()
        updateFielding()
    }

    //Pitching section
    $("#pitching-container").html('')
    if(showPitching){
        displayPitching()
        updatePitching()
    }
}

/*
Returns an array of string representing column names according to the selected checkboxes in the UI.
@groupID is the group to which the checkboxes belongs to.
@attributes is an an array representing the identifiers of the checkboxes among the group.
The function returns the identifiers of the checkboxes that are checked.
*/
var checkedFrom = function(groupID, checkboxes){
    let checked = []

    checkboxes.forEach(function(a){
        //Check if the attribute is checked
        if($("#" + groupID + "_" + a[0]).is(':checked')){
            checked.push(a)
        }
    })

    return checked
}

/*
Updates the table of a specific section.
@section is the name of that section.
@columns is an array containing all the available columns of the table.
@onUpdate is the function to call at the end of this function.
*/
updateTable = function(section, columns, onUpdate){
    let year = $('#year-composition option:selected').text()

    //Retreive and reset the table container
    let tableContainer = $('#'+section+'-table-container')
    tableContainer.html('')

    //If we are not in the select all mode
    if(!($('#'+section+'-attributes-selection-fieldset_all').is(':checked'))){

        //TODO manage offensive and defensive

        // if($('#'+section+'-attributes-selection-fieldset_off').is(':checked')){
        //     //Offensive
        // }
        // else if($('#'+section+'-attributes-selection-fieldset_def').is(':checked')){
        //     //Defensive
        // }

        //Get the selected columns
        columns = checkedFrom(section+'-attributes-stats-fieldset', columns)
    }

    columns.unshift(["nameFirst", "prenom"])
    columns.unshift(["nameLast", "nom"])

    console.log(contains(columns, ['salary', 'salaire']))

    //Si on n'a pas l'information salariale
    if(year < 1985 && columns[columns.length - 1][0] == "salary"){
        columns.pop();//Enlever le salaire
    }

    //Add a new table with the selected columns to the container
    tableContainer.append(buildTable(section+'-table', matrixToArray(columns, 1)))

    //Call the onUpdate function
    onUpdate(columns)
}

//Updates specifically the pitching section
var updatePitching = function(){
    //Define the columns
    let columns = [
        ['ERA', 'ERA'], 
        ['BAOpp', "BAOpp"], 
        ['partant', 'partant'], 
        ['G', 'G'], 
        ['GS', 'GS'], 
        ['CG', 'CG'], 
        ['W', 'V'], 
        ['L', 'D'], 
        ['SV', 'SV'], 
        ['IPouts', 'IPouts'], 
        ['SO', 'SO'], 
        ['H', 'H'], 
        ['BB', 'BB'], 
        ['salary', 'salaire']
    ]

    updateTable("pitching", columns, fillPitchingTable)
}

//Fills the pitching table
var fillPitchingTable = function(columns){
    let year = $("#year-composition option:selected").text()
    let order = $("input[name='name_pitching-sort-fieldset']:checked").val()

    if(columns.indexOf(order) > 0){

    }

    //Remove nameFirst and nameLast
    columns.shift()
    columns.shift()

    let query = "nameFirst as prenom, nameLast as nom"

    //console.log(columns)

    columns.forEach(function(c){
        if(c[0] != "partant" && (c[0] != "salary" || year >= 1985)){
            query += ", " + c[0] + " as " + c[1]
        }
        else if(c[0] == "partant"){
            query += ", GS as partant"
        }
    })

    //Attention: partant

    if(year >= 1985){
        query += " \
        from Pitching p \
        inner join Salaries s on s.playerID = p.playerID \
        inner join Master m on m.playerID = p.playerID \
        where \
            s.yearID = "+year+" \
            and s.teamID = 'MON' \
            and p.yearID = "+year+"  \
            and p.teamID = 'MON' \
            order by " + order + " desc"
    }
    else{
        query += " \
        from Pitching p \
        inner join Master m on m.playerID = p.playerID \
        where \
            p.yearID = "+year+"  \
            and p.teamID = 'MON' \
        order by " + order + " desc"
    }

    //console.log(query)

    //Check if partant if GS > 0

    let postData = {}
    postData["db"] = "dift6800_baseball"
    postData["query"] = query
    $.post(
        "http://www-ens.iro.umontreal.ca/~dift6800/baseball/db.php",
        postData,
        function(response,status){
            
            let data = JSON.parse(response).data
            //console.log(data)

            let table = $('#pitching-table')

            columns.unshift(["nameFirst", "prenom"])
            columns.unshift(["nameLast", "nom"])

            data.forEach(function(e, i){

                console.log(e)

                table.append('<tr id="pitching-table_'+i+'"">')
                let row = $("#pitching-table_" + i)
                
                let partant = e["partant"] > 0

                columns.forEach(function(c){
                    if(c[1] == "salaire"){
                        row.append('<td>' + moneyFrom("" + e[c[1]]) + '</td>')
                    }
                    else if(c[1] != "partant" && e[c[1]] != undefined){
                        row.append('<td>' + e[c[1]] + '</td>')
                    }
                    else{
                        row.append('<td>' + partant + '</td>')
                    }
                })

                table.append('</tr>')
            })

            

            //let manager = JSON.parse(response).data

            //let name = manager[0].prenom + " " + manager[0].nom

            //fieldset.append(buildLabeledInformation("manager-lbl", "Gérant", name))                    
        }
    )

    //console.log(order);
}

//Updates specifically the fielding section
var updateFielding = function(){
    //Define the columns
    let columns = [
        ['ERA', 'ERA'], 
        ['BAOpp', "BAOpp"], 
        ['partant', 'partant'], 
        ['G', 'G'], 
        ['GS', 'GS'], 
        ['CG', 'CG'], 
        ['W', 'V'], 
        ['L', 'D'], 
        ['SV', 'SV'], 
        ['IPouts', 'IPouts'], 
        ['SO', 'SO'], 
        ['H', 'H'], 
        ['BB', 'BB'], 
        ['salary', 'salaire']
    ]

    updateTable("fielding", columns, fillFieldingTable)
}

//Fills the fielding table
var fillFieldingTable = function(columns){
    let year = $("#year-composition option:selected").text() 
    let order = $("input[name='name_fielding-sort-fieldset']:checked").val()
    //console.log(order);
}

//Displays the pitching section
var displayPitching = function(){
    let legend = [
        ['ERA', 'Moyenne de points mérités'], 
        ['BAOpp', "Moyenne au bâton de l'adversaire"], 
        ['partant', 'Lanceur partant'], 
        ['G', 'Parties'], 
        ['GS', 'Parties commencées'], 
        ['CG', 'Parties complétées'], 
        ['V', 'Victoires'], 
        ['D', 'Défaites'], 
        ['SV', 'Sauvetage'], 
        ['IPouts', 'Retraits lancés'], 
        ['SO', 'Retrait au bâton'], 
        ['H', 'Coup de circuit'], 
        ['BB', 'Buts sur balle'], 
        ['salaire', 'Salaire annuel']
    ]

    let attributes = [
        ['ERA', 'ERA'], 
        ['BAOpp', "BAOpp"], 
        ['partant', 'partant'], 
        ['G', 'G'], 
        ['GS', 'GS'], 
        ['CG', 'CG'], 
        ['W', 'V'], 
        ['L', 'D'], 
        ['SV', 'SV'], 
        ['IPouts', 'IPouts'], 
        ['SO', 'SO'], 
        ['H', 'H'], 
        ['BB', 'BB'], 
        ['salary', 'salaire']
    ]

    let sorts = [
        ['ERA', 'ERA'], 
        ['BAOpp', "BAOpp"], 
        ['G', 'G'], 
        ['GS', 'GS'], 
        ['CG', 'CG'], 
        ['W', 'W'], 
        ['SO', 'SO'], 
        ['H', 'H'], 
        ['BB', 'BB'], 
        ['salaire', 'salaire']
    ] 

    let selections = [
        ['pick', 'Au choix'], 
        ['all', "Tout"]
    ]

    displayForm("pitching","Lanceurs",legend,attributes,sorts,selections,updatePitching)
}

//Displays the fielding section
var displayFielding = function(){
    let legend = [
        ['ERA', 'Moyenne de points mérités'], 
        ['BAOpp', "Moyenne au bâton de l'adversaire"], 
        ['partant', 'Lanceur partant'], 
        ['G', 'Parties'], 
        ['GS', 'Parties commencées'], 
        ['CG', 'Parties complétées'], 
        ['W', 'Victoires'], 
        ['L', 'Défaites'], 
        ['SV', 'Sauvetage'], 
        ['IPouts', 'Retraits lancés'], 
        ['SO', 'Retrait au bâton'], 
        ['H', 'Coup de circuit'], 
        ['BB', 'Buts sur balle'], 
        ['salaire', 'Salaire annuel']
    ]

    let attributes = [
        ['ERA', 'ERA'], 
        ['BAOpp', "BAOpp"], 
        ['partant', 'partant'], 
        ['G', 'G'], 
        ['GS', 'GS'], 
        ['CG', 'CG'], 
        ['W', 'V'], 
        ['L', 'D'], 
        ['SV', 'SV'], 
        ['IPouts', 'IPouts'], 
        ['SO', 'SO'], 
        ['H', 'H'], 
        ['BB', 'BB'], 
        ['salary', 'salaire']
    ]

    let sorts = [
        ['ERA', 'ERA'], 
        ['BAOpp', "BAOpp"], 
        ['G', 'G'], 
        ['GS', 'GS'], 
        ['CG', 'CG'], 
        ['W', 'W'], 
        ['SO', 'SO'], 
        ['H', 'H'], 
        ['BB', 'BB'], 
        ['salaire', 'salaire']
    ] 

    let selections = [
        ['pick', 'Au choix'], 
        ['all', "Tout"],
        ['off', "Offensives"],
        ['def', "Défensives"]
    ]

    displayForm("fielding","Joueurs",legend,attributes,sorts,selections,updateFielding)
}

//Displays the form of a section and prepares its table container
var displayForm = function(section, sectionTitle, legend, attributes, sorts, selections, onUpdate){
    //Retreive the container and title it
    let container = $("#"+section+"-container")
    $("#"+section+"-container").append("<hr>")
    title(container, sectionTitle, "h2")

    //Add a main fieldset
    let fieldset = appendFieldsetTo(container, section+"-stats")
    title(fieldset, "Statistiques", "h4")

    //Add a legend
    fieldset.append(buildLegend("Légende", legend))

    //Add a stats fieldset
    let statsFS = appendFieldsetTo(fieldset, section+"-stats-fieldset")
    statsFS.append('<legend>Attributs</legend>')

    //Add an attributes fieldset
    let attributesFS = appendFieldsetTo(statsFS, section+"-attributes-stats-fieldset")
    let id = attributesFS.attr("id")
    attributesFS.append(buildCheckboxGroup(attributes, id))

    //Add an attributes selection fieldset
    let selectionFS = appendFieldsetTo(statsFS, section+"-attributes-selection-fieldset")
    id = selectionFS.attr("id")
    selectionFS.append(buildRadiobuttonGroup(selections, id))
    $("#"+ id + "_" + selections[1][0]).prop("checked", true)

    //Add a sort fieldset
    let sortFS = appendFieldsetTo(fieldset, section+"-sort-fieldset")
    sortFS.append('<legend>Triage</legend>')
    id = sortFS.attr("id")
    //Remove partant, because we cannot order by partant
    sortFS.append(buildRadiobuttonGroup(sorts, id))
    $("#"+ id + "_" + sorts[0][0]).prop("checked", true)

    //Add a table container
    container.append('<div id="'+section+'-table-container">');

    //Add an update button
    fieldset.append('<button id="'+section+'-stats-btn">Choisir</button>')
    $("#"+section+"-stats-btn").click(onUpdate)
}

/*
Updates the team's details.
@showManager is a boolean
@showAttendance is a boolean
@showSalaryMass is a boolean
@year is the selected year
*/
var updateTeamDetails = function(showManager, showAttendance, showSalaryMass, year){

    let detailsContainer = $("#team-details")
    detailsContainer.html('')

    if(showManager || showAttendance || showSalaryMass){

        let fieldset = appendFieldsetTo(detailsContainer, "team-details-fieldset")

        if(showManager){
            let query = '\
                nameFirst as prenom, nameLast as nom from Managers m \
                inner join Master mstr on mstr.playerID = m.playerID \
                where m.teamID = \'MON\' \
                and m.lgID = \'NL\' \
                and m.yearID = '+year+''

            let postData = {}
            postData["db"] = "dift6800_baseball"
            postData["query"] = query
            $.post(
                "http://www-ens.iro.umontreal.ca/~dift6800/baseball/db.php",
                postData,
                function(response,status){
                    let manager = JSON.parse(response).data

                    let name = manager[0].prenom + " " + manager[0].nom

                    fieldset.append(buildLabeledInformation("manager-lbl", "Gérant", name))                    
                }
            )            
        }

        if(showAttendance){
            let query = '\
                attendance from Teams t \
                where t.teamID = \'MON\' \
                and t.lgID = \'NL\' \
                and t.yearID = '+year+''

            let postData = {}
            postData["db"] = "dift6800_baseball"
            postData["query"] = query
            $.post(
                "http://www-ens.iro.umontreal.ca/~dift6800/baseball/db.php",
                postData,
                function(response,status){

                    let attendance = JSON.parse(response).data[0].attendance

                    fieldset.append(buildLabeledInformation("attendance-lbl", "Assistance", format(attendance)))                  
                }
            )            
        }

        if(showSalaryMass){
            let query = '\
            sum(salary) as salaryMass from Salaries s \
            where s.teamID = \'MON\' \
            and s.yearID = '+year+''

            let postData = {}
            postData["db"] = "dift6800_baseball"
            postData["query"] = query
            $.post(
                "http://www-ens.iro.umontreal.ca/~dift6800/baseball/db.php",
                postData,
                function(response,status){
                    let salaryMass = JSON.parse(response).data[0].salaryMass

                    if(salaryMass == null){
                        salaryMass = 0
                    }

                    fieldset.append(buildLabeledInformation("salaryMass-lbl", "Masse salariale", moneyFrom(salaryMass)))            
                }
            )            
        }     
    }
    else{
        detailsContainer.html("")
    }           
}