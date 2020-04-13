/*
* @Vincent Falardeau
* @Philippe Gabriel
* @Version 0.7.0 2020-04-17
**/

/*
* Ces procédures permettent de d'appliquer la propriété de visibilité à un
* élément html de façon similaire au contrôle de la présence d'un élément
* Source: https://stackoverflow.com/questions/9614622/equivalent-of-jquery-hide-to-set-visibility-hidden
**/

(function($) {
    $.fn.visible = function() {
        return this.each(function() {
            $(this).css("visibility", "visible");
        });
    };
    $.fn.invisible = function() {
        return this.each(function() {
            $(this).css("visibility", "hidden");
        });
    };
}(jQuery));

/*
* La fonction loadDetails génère les éléments obtenus des requêtes sur
* les informations n'appartenant pas aux tables, notamment sur le gérant,
* l'assistance et la masse salariale
*
* @param data Les données de la requête
**/
// TODO: Find way to identify information
var loadDetails = function(data) {

};

/*
* La fonction queryDetailCompSql a pour but de générer les informations
* supplémentaires relatives au gérant, à l'assistance de match et la masse
* salariale selon les options fournies par l'usager
* Source: https://stackoverflow.com/questions/1456106/how-to-select-an-empty-result-set
*
* @param mnger Booléen déterminant si les informations sur le gérant sont à
* rechercher
* @param attd Booléean déterminant si les informations sur l'assistance aux
* matchs sont à générer
* @param pay Booléen déterminant si les informations sur la masse salariale
* sont à générer
* @param year Integer indiquant l'année choisie par l'usager
* @return queriesDetails Array contenant les requêtes prêtes à être acheminées
* au script php
**/
// NOTE: Might need rework, will work it out tomorrow
var queryDetailCompSql = function(mnger, attd, pay, year) {

    //Requête retournant un résultat vide
    var mngerQuery = "1 FROM dual WHERE false;";
    var attdQuery = "1 FROM dual WHERE false;";
    var payQuery = "1 FROM dual WHERE false;";


    if (mnger) { //Requête pour le géant
        mngerQuery = "" +
            ""
        ;
        //Manager need questions
    }

    if (attd) { //Requête pour l'assistance aux matchs
        attdQuery = "" +
                "attendance " +
            "FROM Teams " +
            "WHERE teamID = 'MON' "  +
                "AND yearID = " + year + ";"
        ;
    }

    if (pay) { //Requête pour la masse salariale
        payQuery = "" +
                "SUM(salary) AS payroll" +
            "FROM Salaries " +
            "WHERE teamID = 'MON' " +
                "AND yearID = " + year + ";"
        ;
    }

    var queriesDetails = {
        manager:    mngerQuery,
        attendance: attdQuery,
        payroll:    payQuery
    };

    return queriesDetails;
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
// TODO: Correspond with ids in composition to finish query details
var querySql = function(year) {
    var query = "" +
            "m.nameLast AS nom, " +
            "m.nameFirst AS prénom, " +
            "b.H/b.AB AS 'BA%'," +
            "(b.H-b.2B-b.3B-b.HR+2*b.2B+3*b.3B+4*b.HR)/b.AB AS 'SL%', " +
            "(b.H + b.BB + b.HBP)/(b.AB + b.BB + b.HBP + b.SF) AS 'OB%', " +
            "b.SO/b.AB AS 'SO%', " +
            "b.SB/(b.CS+b.SB) AS 'SB%', " +
            "b.AB, " +
            "b.H, " +
            "b.2B, " +
            "b.3B, " +
            "b.HR, " +
            "b.BB, " +
            "b.R, " +
            "b.SB, " +
            "b.CS, " +
            "SUM(f.A)/(SUM(f.A) + SUM(f.E)) AS 'FP%', " +
            "f2.POS AS 'POS*', " +
            "SUM(f.A) AS A, " +
            "SUM(f.E) AS E, " +
            "s.salary AS salaire " +
        "FROM Master AS m " +
            "INNER JOIN Fielding AS f ON m.playerID = f.playerID " +
            "INNER JOIN Salaries AS s ON m.playerID = s.playerID " +
            "INNER JOIN Batting AS b ON m.playerID = b.playerID " +
            "INNER JOIN (SELECT playerID, yearID, teamID, POS, GS " +
                        "FROM Fielding " +
                        ") AS f2 ON m.playerID = f2.playerID " +
        "WHERE f.yearID = 1996 " +
            "AND f.yearID = s.yearID " +
            "AND f.yearID = b.yearID " +
            "AND f.yearID = f2.yearID " +
            "AND f.teamID = 'MON' " +
            "AND f.teamID = b.teamID " +
            "AND f.teamID = f2.teamID " +
            "AND f.POS <> 'OF' " +
            "AND f2.POS <> 'P' " +
            "AND f2.POS <> 'OF' " +
            "AND f2.GS = (SELECT MAX(GS) " +
                        "FROM Fielding " +
                        "WHERE f.playerID = playerID " +
                            "AND f.yearID = yearID " +
                            "AND f.teamID = teamID " +
                            "AND POS <> 'P' " +
                            "AND POS <> 'OF' " +
                        ") " +
            "AND b.AB > 10 " +
        "GROUP BY m.playerID;"
    ;
};

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
// NOTE: Loop might not be necessary with reworked idea
var queryData = function(queries) {

    //L'url de la base de donnée à laquelle la requête sera acheminée
    var url = "http://www-ens.iro.umontreal.ca/~dift6800/baseball/db.php";

    for (var i in queries) {

        //Objet constitué du nom de la base de données et des données de la requête
        var postData = {
            db: "dift6800_baseball",
            query: i
        };

        //Les données désirées sont récupérés par une requête HTTP POST
        $.post(url,postData,
            function(data,status) {

                var obj = JSON.parse(data);

                if (obj.error == "") {

                    // if (obj.data.length) <= 1) {
                    //     loadDetails(obj.data);
                    // } else {
                    //     loadTables(obj.data);
                    // }
                } else { //En cas d'erreur
                    alert("Erreur: " + obj.error);
                }
            }
        );
    }
};

/*
* La procédure checkControl s'occupe de contrôler la présence de certains
* éléments de la page selon les choix entrepris par l'usager dans l'interface
* et entreprends certaines requêtes pour les attributs simples de la page
* Source: https://www.w3schools.com/jquery/eff_hide.asp
**/
// NOTE: Might be adjusted for more efficient method
var checkControl = function() {

    var yearSelect = $("#year option:selected").text(); //Année sélectionnée

    var mngerSelect = $('#manager').is(':checked');
    var attdSelect  = $('#attendance').is(':checked');
    var paySelect   = $('#payroll').is(':checked');

    //Informations relatives aux joueurs de champs
    if ($('#fielders').is(':checked')) {
        $('#field-data').show();
    } else {
        $('#field-data').hide();
    }

    //Informations relatives aux lanceurs
    if ($('#pitchers').is(':checked')) {
        $('#pitch-data').show();
    } else {
        $('#pitch-data').hide();
    }

    //Informations relatives au gérant
    if (mngerSelect) {
        $('.detail-comp #manager-data, #prop-data').visible();
        //Execute query for year selected to put in span
    } else {
        $('.detail-comp #manager-data, #prop-data').invisible();
    }

    //Informations relatives à l'assistance
    if (attdSelect) {
        $('.detail-comp #attendance-data').visible();
        //Execute query for year selected to put in span
    } else {
        $('.detail-comp #attendance-data').invisible();
    }

    //Informations relatives à la masse salariale
    if (paySelect) {
        $('.detail-comp #payroll-data').visible();
        //Execute query for year selected to put in span
    } else {
        $('.detail-comp #payroll-data').invisible();
    }

    queryDetailCompSql(mngerSelect, attdSelect, paySelect, yearSelect);
};

/*
* La procédure init prépare la requête sur les joueurs selon les spécifications
* apportées par l'usager
**/

var init = function() {

    var fieldTable = $("#field-table"); //Tableau alloqué aux joueurs de champ
    var pitchTable = $("#pitch-table"); //Tableau alloqué aux lanceurs

    //Le contenu est réinitialisé pour une nouvelle requête
    fieldTable.html('');
    pitchTable.html('');

    //La valeur de ces booléens dépend des choix de l'usager dans l'interface
    var fieldCheck = $("#fielders").is(':checked'); //Case à cocher joueurs
    var pitchCheck = $("#pitchers").is(':checked'); //Case à cocher lanceurs

    var yearSelect = $("#year option:selected").text(); //Année sélectionnée

    if (fieldCheck) {

        //Une requête pour les joueurs de champs est lancée
        queryData(querySql(yearSelect));
        queryData(querySql(yearSelect));
    }

    if (pitchCheck) {

        //Une requête pour chaque division est envoyée
        queryData(querySql(yearSelect));
        queryData(querySql(yearSelect));
    }
};

/*
* La procédure loadUI s'occupe de configurer un élément de sélection par
* l'usager et initie une première requête
**/

var loadUI = function() {

    for(var i = 1969; i <= 2004; i++) {
        $("#year").append('<option>' + i + '</option>');
    }
    checkControl();
};