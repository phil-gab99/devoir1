
var initClassement = function(){
    $("#rank-filter-btn").click(updateClassement)

    updateClassement()
}

var queryFrom = function(year, league, division){
    return "\
        t.teamID as equipe, \
        t.name as nom, \
        t.yearID as annee, \
        t.park as parc, \
        t.teamID=WSC.teamIDWinner AS WS, \
        t.teamID=LC.teamIDWinner AS NLCS, \
        t.W as V, \
        t.L as D \
        FROM Teams t, \
        (SELECT teamIDWinner FROM SeriesPost \
            WHERE yearID="+year+" AND round='"+league+"CS') AS LC,\
        (SELECT teamIDWinner FROM SeriesPost \
            WHERE yearID="+year+" AND round='WS') AS WSC\
        WHERE t.yearID="+year+"  \
        AND t.lgID='"+league+"' \
        AND t.divID='"+division+"'\
        order by V desc"
}

var updateClassement = function(){

    let year = $("#year-classement option:selected").text()

    let nlCondition = ""

    let alContainer = $("#al-container")
    alContainer.html('')

    let nlContainer = $("#nl-container")
    nlContainer.html('')

    if($("#nl-cbx").is(':checked')){
        nlContainer.html('\
            <h2>Ligne nationale</h2>\
            <br>\
            <div id="nl-EST-table-container">\
            </div>\
            <div id="nl-OUEST-table-container">\
            </div>')
        executeQuery(queryFrom(year, 'NL', 'E'), 'nl', 'EST')
        executeQuery(queryFrom(year, 'NL', 'W'), 'nl', 'OUEST')
    }

    if($("#al-cbx").is(':checked')){
        alContainer.html('\
            <h2>Ligne américaine</h2>\
            <br>\
            <div id="al-EST-table-container">\
            </div>\
            <div id="al-OUEST-table-container">\
            </div>')
        executeQuery(queryFrom(year, 'AL', 'E'), 'al', 'EST')
        executeQuery(queryFrom(year, 'AL', 'W'), 'al', 'OUEST')
    }    
}

var executeQuery = function(query, league, division){
    let postData = {};

    postData["db"] = "dift6800_baseball"
    postData["query"] = query

    $.post(
        "http://www-ens.iro.umontreal.ca/~dift6800/baseball/db.php",
        postData,
        function(response,status){
            buildTable(JSON.parse(response).data, league, division)
        }
    )
}

var buildTable = function(data, league, division){

    console.log(data)

    $("#"+league+"-"+division+"-table-container").html('\
        <h3>Division '+division+'</h3>\
        <table id="'+league+'-'+division+'-table">\
            <tr>\
                <th>Équipe</th>\
                <th>Nom</th>\
                <th>Année</th>\
                <th>Ville</th>\
                <th>Victoires</th>\
                <th>Défaites</th>\
            </tr>\
        </table>')

    data.forEach(function(entry){
        $("#"+league+"-"+division+"-table").append('\
            <tr id="'+entry.equipe+'">\
                <td>'+entry.equipe+'</td>\
                <td>'+entry.nom+'</td>\
                <td>'+entry.annee+'</td>\
                <td>'+entry.parc+'</td>\
                <td>'+entry.V+'</td>\
                <td>'+entry.D+'</td>\
            </tr>')

        if(((league == 'al' && $("#al-champ-cbx").is(':checked')) || 
            (league == 'nl' && $("#nl-champ-cbx").is(':checked'))) && 
            entry.NLCS == 1){
            $("#"+entry.equipe).css("background-color", "#b08d57")
        }

        if($("#wrld-champ-cbx").is(':checked') && entry.WS == 1){
            $("#"+entry.equipe).css("background-color", "gold")
        }  
    })
}