var initComposition = function(){

    buildYearSelector("year-composition", 1969, 2004)

    $("#comp-filter-btn").click(updateTeam)
}

var updateTeam = function(){

    let year = $("#year-composition option:selected").text()

    let showFielding = $("#showFielding").is(':checked')
    let showPitching = $("#showPitching").is(':checked')
    let showManager = $("#showManager").is(':checked')
    let showAttendance = $("#showAttendance").is(':checked')
    let showSalaryMass = $("#showSalaryMass").is(':checked')

    updateTeamDetails(showManager, showAttendance, showSalaryMass, year)

    // if(showFielding){
    //     updateFielding(year)
    // }

    $("#pitching-container").html('')
    if(showPitching){
        displayPitching()
        updatePitching()
    }
}

var columnsFrom = function(id, attributes){

    let columns = []

    attributes.forEach(function(a){
        if($("#" + id + "_" + a[0]).is(':checked')){
            columns.push(a[0])
        }
    })

    return columns
}

var updatePitching = function(){
    let year = $("#year-composition option:selected").text()

    let pitchingTableContainer = $("#pitching-table-container")

    pitchingTableContainer.html('')

    let attributes = [
        ['ERA', 'ERA'], 
        ['BAOpp', "BAOpp"], 
        ['partant', 'partant'], 
        ['G', 'G'], 
        ['GS', 'GS'], 
        ['CG', 'CG'], 
        ['W', 'W'], 
        ['L', 'D'], 
        ['SV', 'SV'], 
        ['IPouts', 'IPouts'], 
        ['SO', 'SO'], 
        ['H', 'H'], 
        ['BB', 'BB'], 
        ['salaire', 'salaire']
    ]

    let columns = []

    if($("#pitching-attributes-option-fieldset_all").is(':checked')){
        columns =  matrixToArray(attributes, 0)
    }
    else{
        columns =  columnsFrom("pitching-attributes-stats-fieldset", attributes)
    }

    pitchingTableContainer.append(buildTable('pitching-table', columns))
}

var displayPitching = function(){
    let pitchingContainer = $("#pitching-container")
    $("#pitching-container").append("<hr>")
    title(pitchingContainer, "Lanceurs", "h2")

    //Add a field set to the container
    let pitchingFieldset = appendFieldsetTo(pitchingContainer, "pitching-stats")
    title(pitchingFieldset, "Statistiques", "h4")

    //Add a legend
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
    pitchingFieldset.append(buildLegend("Légende", legend))

    //Add a stat fieldset
    let statsFS = appendFieldsetTo(pitchingFieldset, "pitching-stats-fieldset")
    statsFS.append('<legend>Attributs</legend>')

    //Add an attributes fieldset
    let attributesFS = appendFieldsetTo(statsFS, "pitching-attributes-stats-fieldset")
    let attributes = [
        ['ERA', 'ERA'], 
        ['BAOpp', "BAOpp"], 
        ['partant', 'partant'], 
        ['G', 'G'], 
        ['GS', 'GS'], 
        ['CG', 'CG'], 
        ['W', 'W'], 
        ['L', 'D'], 
        ['SV', 'SV'], 
        ['IPouts', 'IPouts'], 
        ['SO', 'SO'], 
        ['H', 'H'], 
        ['BB', 'BB'], 
        ['salaire', 'salaire']
    ]
    let id = attributesFS.attr("id")
    attributesFS.append(buildCheckboxGroup(attributes, id))

    //Add an attributes option fieldset
    let optionFS = appendFieldsetTo(statsFS, "pitching-attributes-option-fieldset")
    let options = [
        ['pick', 'Au choix'], 
        ['all', "Tout"]
    ]
    id = optionFS.attr("id")
    optionFS.append(buildRadiobuttonGroup(options, id))
    $("#"+ id + "_" + options[1][0]).prop("checked", true)

    //Add a sort fieldset
    let sortFS = appendFieldsetTo(pitchingFieldset, "pitching-sort-fieldset")
    sortFS.append('<legend>Triage</legend>')
    id = sortFS.attr("id")
    sortFS.append(buildRadiobuttonGroup(attributes, id))
    $("#"+ id + "_" + attributes[0][0]).prop("checked", true)

    pitchingContainer.append('<div id="pitching-table-container">');

    statsFS.append('<button id="pitching-stats-btn">Choisir</button>')
    $("#pitching-stats-btn").click(updatePitching)
}

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