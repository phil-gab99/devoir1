/*
* @Vincent Falardeau
* @Philippe Gabriel
* @Version 1.11.2 2020-04-17
**/

/*
* La procédure checkControl s'occupe de contrôler l'état de la case à cocher
* pour le champion de la ligue américaine en s'assurant que l'usager ne
* puisse sélectionner la case s'il n'a pas en premier lieu sélectionné sa ligue
* correspondante ainsi que l'affichage des tableaux selon les cases cochées
**/

var checkControl = function() {

    var alCheck = $("#al-check").is(':checked'); //Case ligue américaine

    //Effet bascule
    $('#al-champ').attr('disabled', !$('#al-champ').attr('disabled'));
    $('#al-champ').prop('checked', false); //Décocher la case si déjà cochée

    if (alCheck) { //État d'affichage des tableaux américains
        $("#al-data").show();
    } else {
        $("#al-data").hide();
    }
};

/*
* La procédure loadNoResult s'occupe d'informer à l'usager l'absence de
* résultats pour une division donnée
*
* @param lg String indiquant la ligue pour laquelle les données ne sont pas
* disponibles
* @param div String indiquant la division pour laquelle les données ne sont pas
* disponibles
**/

var loadNoResult = function(lg, div) {

    var noContent = $("#" + lg + "-" + div + "-data");

    noContent.html('' +
        '<h3>Division ' + div + '</h3>' +
        '<h4 class="no-result">' +
            'La requête n\'a retourné aucun résultat pour cette division à ' +
            'l\'année ' + $("#year option:selected").text() + '' +
        '</h4>'
    );
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
    var nlChamp = $("#nl-champ").is(':checked');    //Champion ligue nationale
    var alChamp = $("#al-champ").is(':checked');    //Champion ligue américaine
    var wChamp  = $("#world-champ").is(':checked'); //Champion série mondiale

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

            var rowName = '<tr>';

            if (wChamp && entry.WSC == 1) {

                rowName = '<tr id="world-champ-row">';
            } else if (((lg == 'nl' && nlChamp) || (lg == 'al' && alChamp))
            && entry.LSC == 1) {

                rowName = '<tr id="' + lg + '-champ-row">';
            }

            table.append('' +
                rowName +
                    '<td>' + entry.nom + '</td>' +
                    '<td>' + entry.moyenne + '</td>' +
                    '<td>' + entry.V + '</td>' +
                    '<td>' + entry.D + '</td>' +
                    '<td>' + entry.diff + '</td>' +
                '</tr>'
            );
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
* Source: https://www.sitepoint.com/community/t/how-do-i-link-jump-to-a-specific-section-on-a-different-page/5646
**/

var querySql = function(year, lg, div) {

    var query = "";

    if (year != 1994) { //Éviter l'année de grève où il n'y pas eu de champions

        query = "" +
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
            "ORDER by V DESC;"
        ;

    } else {

        //Lien vers la page accueil expliquant l'absence de champions
        $("#year1994").html('' +
            '<a href="accueil.html#champ1994">' +
                'En savoir plus: Pourquoi n\'y a-t-il pas de champions?' +
            '</a>'
        );

        query = "" +
                "ta.teamID AS equipe, " +
                "ta.name AS nom, " +
                "ta.W / (ta.W + ta.L) AS moyenne, " +
                "ta.W AS V, " +
                "ta.L AS D, " +
                "tb.W - ta.W AS diff " +
            "FROM Teams AS ta " +
                "INNER JOIN " +
                    "(SELECT W, lgID, divID, yearID " +
                        "FROM Teams " +
                        "WHERE Rank = 1 " +
                    ") AS tb " +
                    "ON ta.lgID = tb.lgID " +
                        "AND ta.divID = tb.divID " +
                        "AND ta.yearID = tb.yearID " +
            "WHERE ta.lgID = '" + lg + "' " +
                "AND ta.divID = '" + div + "' " +
                "AND ta.yearID = " + year + " " +
            "ORDER by V DESC;"
        ;
    }

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
        db: "dift6800_baseball",
        query: query
    };

    //Les données désirées sont récupérés par une requête HTTP POST
    $.post(url,postData,
        function(data,status) {

            var obj = JSON.parse(data);

            if (obj.error == "") {
                if (obj.data.length != 0) { //Cas ou aucun résultat retourné
                    loadTable(obj.data, lg, div);
                } else {
                    loadNoResult(lg, div);
                }
            } else { //En cas d'erreur
                alert(obj.error);
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

    //Le contenu est réinitialisé pour une nouvelle requête
    nlData.html('');
    alData.html('');

    //Le contenu du message informatif est réinitialisé
    $("#year1994").html('');

    //La valeur de ces booléens dépend des choix de l'usager dans l'interface
    var nlCheck = $("#nl-check").is(':checked'); //Case ligue nationale
    var alCheck = $("#al-check").is(':checked'); //Case ligue américaine

    var yearSelect = $("#year option:selected").text(); //Année sélectionnée

    if (nlCheck) {

        nlData.html('' +
            '<br>' +
            '<h2>Ligne nationale en ' + yearSelect + '</h2>' +
            '<div id="nl-est-data"></div>' +
            '<div id="nl-ouest-data"></div>' +
            '<div id="nl-centrale-data"></div>'
        );

        //Une requête pour chaque division est envoyée
        queryData(querySql(yearSelect, 'NL', 'E'), 'nl', 'est');
        queryData(querySql(yearSelect, 'NL', 'W'), 'nl', 'ouest');
        queryData(querySql(yearSelect, 'NL', 'C'), 'nl', 'centrale');
    }

    if (alCheck) {

        alData.html('' +
            '<br>' +
            '<h2>Ligne américaine en ' + yearSelect + '</h2>' +
            '<div id="al-est-data"></div>' +
            '<div id="al-ouest-data"></div>' +
            '<div id="al-centrale-data"></div>'
        );

        //Une requête pour chaque division est envoyée
        queryData(querySql(yearSelect, 'AL', 'E'), 'al', 'est');
        queryData(querySql(yearSelect, 'AL', 'W'), 'al', 'ouest');
        queryData(querySql(yearSelect, 'AL', 'C'), 'al', 'centrale');
    }
};

/*
* La prcédure loadUI s'occupe de configurer un élément de sélection
**/

var loadUI = function() {

    for(var i = 1969; i <= 2004; i++) {
        $("#year").append('<option>' + i + '</option>');
    }
};