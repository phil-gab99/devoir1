/*
* @Vincent Falardeau
* @Philippe Gabriel
* @Version 1.2.8 2020-04-17
**/

/*
* La procédure checkControl s'occupe de contrôler l'état de la case à cocher
* pour le champion de la ligue américaine en s'assurant que l'usager ne
* puisse sélectionner la case s'il n'a pas en premier lieu sélectionné sa ligue
* correspondante
**/

var checkControl = function() {
    $('#alc').attr('disabled', !$('#alc').attr('disabled')); //Effet bascule
    $('#alc').prop('checked', false); //Décocher la case si cochée
};

/*
* La procédure loadTable génère les tables selons la requête initié par
* l'usager
*
* @param data Un tableau d'objets contenant les divers informations de la
* requête SQL que l'usager a choisi
* @param lg String indiquant la ligue pour laquelle un tableau sera généré
* @param div String indiquant la division pour laquelle un tableau sera généré
**/

var loadTable = function(data, lg, div) {

    //La valeur de ces booléens dépend des choix de l'usager dans l'interface
    var nlChamp = $("#nlc").is(':checked'); //Champion de la ligue nationale
    var alChamp = $("#alc").is(':checked'); //Champion de la ligue américaine
    var wChamp  = $("#wc").is(':checked');  //Champion de la série mondiale

    //Div contiendra les données relatives à la ligue et division en question
    var content = $("#" + lg + "-" + div + "-data");

    content.html('' +
        '<h3>Division ' + div + '</h3>' +
        '<table id=' + lg + div +' class="placement">' +
            '<tr>' +
                '<th>Équipe</th>' +
                '<th>Moyenne</th>' +
                '<th>Victoires</th>' +
                '<th>Défaites</th>' +
                '<th>Différentielle</th>' +
            '</tr>' +
        '</table>'
    );

    var table = $("#" + lg + div);

    data.forEach(
        function(entry) {

            table.append('' +
                '<tr id="' + entry.equipe + '">' +
                    '<td>' + entry.nom + '</td>' +
                    '<td>' + entry.moyenne + '</td>' +
                    '<td>' + entry.V + '</td>' +
                    '<td>' + entry.D + '</td>' +
                    '<td>' + entry.diff + '</td>' +
                '</tr>'
            );

            //Condition pour indiquer champion de ligue
            if (((lg == 'nl' && nlChamp) || (lg == 'al' && alChamp))
            && entry.LSC == 1) {

                $("#" + entry.equipe).css("background-color", "#ff9999")
            }

            //Condition pour indiquer champion mondiale
            if (wChamp && entry.WSC == 1) {

                $("#" + entry.equipe).css("background-color", "#ff9933")
            }
        }
    );
};

/*
* La fonction querySql s'occupe d'établir la requête SQL selon les
* spécifications de l'usager qui sera acheminée au script php pour fournir
* l'information désirée
*
* @param year Integer représentant l'année sélectionnée par l'usager
* @param lg String indiquant la ligue pour laquelle l'information sera
* recherchée
* @param div String indiquant la division pour laquelle l'information sera
* recherchée
* @return query String représentant la requête à être acheminée en format SQL
**/

var querySql = function(year, lg, div) {

    var query = "" +
        "ta.teamID AS equipe, " +
        "ta.name AS nom, " +
        "ta.W / (ta.W + ta.L) AS moyenne, " +
        "ta.W AS V, " +
        "ta.L AS D, " +
        "tb.W - ta.W AS diff, " +
        "ta.teamID = ls.teamIDWinner AS LSC, " +
        "ta.teamID = ws.teamIDWinner AS WSC " +
    "FROM Teams AS ta " +
        "INNER JOIN " +
            "(SELECT W, lgID, divID, yearID " +
                "FROM Teams " +
                "WHERE Rank = 1 " +
            ") AS tb " +
            "ON ta.lgID = tb.lgID " +
                "AND ta.divID = tb.divID " +
                "AND ta.yearID = tb.yearID " +
        "INNER JOIN " +
            "(SELECT teamIDWinner, yearID " +
                "FROM SeriesPost " +
                "WHERE round = '" + lg + "CS' " +
            ") AS ls " +
            "ON ta.yearID = ls.yearID " +
        "INNER JOIN " +
            "(SELECT teamIDWinner, yearID " +
                "FROM SeriesPost " +
                "WHERE round = 'WS' " +
            ") AS ws " +
            "ON ta.yearID = ws.yearID " +
    "WHERE ta.lgID = '" + lg + "' " +
        "AND ta.divID = '" + div + "' " +
        "AND ta.yearID = " + year + " " +
    "ORDER by V DESC;";

    return query;
}

/*
* La procédure queryData s'occupe d'acheminé la requête formée par l'usager
* au script php pour ensuite récupérer l'information provenant de la requête
*
* @param query String composé de la requête formée par l'usager en format SQL
* @param lg String indiquant la ligue pour laquelle l'information a été
* recherchée
* @param div String indiquant la division pour laquelle l'information a été
* recherchée
**/

var queryData = function(query, lg, div) {

    //L'url de la base de donnée à laquelle la requête sera acheminée
    var url = "http://www-ens.iro.umontreal.ca/~dift6800/baseball/db.php";

    //Objet constitué du nom de la base de données et des données de la requête
    var postData = {
        db:    "dift6800_baseball",
        query: query
    };

    //Les données désirées sont récupérés par une requête HTTP POST
    $.post(
        url,
        postData,
        function(data,status) {

            var obj = JSON.parse(data);

            if (obj.error == "") {
                loadTable(obj.data, lg, div);
            } else { //En cas d'erreur
                alert("Erreur: " + obj.error);
            }
        }
    );
};

/*
* La procédure init prépare la requête selon les spécifications apportées par
* l'usager
**/

var init = function() {

    var nlData = $("#nl-data"); //Div alloqué à la ligue nationale
    var alData = $("#al-data"); //Div alloqué à la ligue américaine

    //La valeur de ces booléens dépend des choix de l'usager dans l'interface
    var nlCheck = $("#nl").is(':checked'); //Case à cocher ligue nationale
    var alCheck = $("#al").is(':checked'); //Case à cocher ligue américaine

    var year = $("#year option:selected").text(); //Année sélectionnée

    if (nlCheck) {

        nlData.html('' +
            '<br>' +
            '<h2>Ligne nationale</h2>' +
            '<div id="nl-est-data"></div>' +
            '<div id="nl-ouest-data"></div>'
        );

        //Une requête pour chaque division est envoyée
        queryData(querySql(year, 'NL', 'E'), 'nl', 'est')
        queryData(querySql(year, 'NL', 'W'), 'nl', 'ouest')
    }

    if (alCheck) {

        alData.html('' +
            '<br>' +
            '<h2>Ligne américaine</h2>' +
            '<div id="al-est-data"></div>' +
            '<div id="al-ouest-data"></div>'
        );

        //Une requête pour chaque division est envoyée
        queryData(querySql(year, 'AL', 'E'), 'al', 'est');
        queryData(querySql(year, 'AL', 'W'), 'al', 'ouest');
    }
};

/*
* La prcédure loadUI s'occupe de configurer un élément de sélection par
* l'usager et initie une première requête
**/

var loadUI = function() {

    for(var i = 1969; i <= 2004; i++) {
        $("#year").append('<option>' + i + '</option>');
    }

    init();
};