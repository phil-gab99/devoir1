var initComposition = function(){

    buildYearSelector("year-composition", 1969, 2004)

    $("#comp-filter-btn").click(updateTeam)

    updateTeam()
}

var updateTeam = function(){

    let year = $("#year-composition option:selected").text()

    let showFielding = $("#showFielding").is(':checked')
    let showPitching = $("#showPitching").is(':checked')
    let showManager = $("#showManager").is(':checked')
    let showAttendance = $("#showAttendance").is(':checked')
    let showSalaryMass = $("#showSalaryMass").is(':checked')

    showTeamDetails(showManager, showAttendance, showSalaryMass, year)
}

var showTeamDetails = function(showManager, showAttendance, showSalaryMass, year){

    let detailsContainer = $("#team-details")

    if(showManager || showAttendance || showSalaryMass){

        let fieldsetId = "team-details-fieldset"
        detailsContainer.html(buildFieldset(fieldsetId))
        let fieldset = $("#" + fieldsetId)

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