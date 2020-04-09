
var initClassement = function(){
    $("#rank-filter-btn").click(updateClassement)

    updateClassement()
}

var queryFrom = function(year, league, division){
    return "\
        teamID as equipe, \
        name as nom, \
        yearID as annee, \
        park as parc, \
        W as V, \
        L as D, \
        (select max(W) from Teams where \
            yearID = "+year+" \
            and lgID = '"+league+"' \
            and divID = '"+division+"') - W as diff \
        from Teams \
        where \
            yearID = "+year+" \
            and lgID = '"+league+"' \
            and divID = '"+division+"' \
        order by V desc"
}

var updateClassement = function(){

    let year = $("#year-classement option:selected").text()

    let nlCondition = ""

    if($("#nl-cbx").is(':checked')){
        let container = $("#nl-container")
        container.html('\
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
        let container = $("#al-container")
        container.html('\
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

    $.post("http://www-ens.iro.umontreal.ca/~dift6800/baseball/db.php",postData,function(response,status){

        buildTable(JSON.parse(response).data, league, division)
    })
}

var buildTable = function(data, league, division){
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
            <tr>\
                <td>'+entry.equipe+'</td>\
                <td>'+entry.nom+'</td>\
                <td>'+entry.annee+'</td>\
                <td>'+entry.parc+'</td>\
                <td>'+entry.V+'</td>\
                <td>'+entry.D+'</td>\
            </tr>')
    })
}