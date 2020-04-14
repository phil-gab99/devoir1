/*
* @Vincent Falardeau
* @Philippe Gabriel
* @Version 2.15.7 2020-04-17
**/

// TODO: Find what proprio means to finish last queries
    //Will have to modify the following functions and procedures:
        //loadDetails(data);
        //queryDetailCompSql(queryObj, table, year);
        //checkControl();
        //queryData(query,type) (possibly)
// IDEA: Find areas to optimize and test website with varying data
// TODO: Ask question about offensive/defensive stats for pitchers

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
* La procédure loadDetails génère les éléments obtenus des requêtes sur
* les informations n'appartenant pas aux tables, notamment sur le gérant,
* l'assistance et la masse salariale
*
* @param data La donnée d'intérêt
**/

var loadDetails = function(data) {

    var property = "";
    var value = 0;
    for (var i in data[0]) property = i; value = data[0][i];
    var labelData = $("#" + property + "-data span");
    labelData.html(value != null ? value : "N/A");
};

/*
* La procédure loadTable génère les tables selons la requête initié par
* l'usager
*
* @param data Un tableau d'objets contenant les divers informations de la
* requête SQL que l'usager a choisi
* @param field Booléen indiquant le type de table à construire
**/

var loadTable = function(data, field) {

    //Détermine le type de table à populer
    var table = (field ? $("#field-table") : $("#pitch-table"));

    //Booléen indiquant si l'usager à cocher la case partant pour les lanceurs
    var starting = (field ? false : $("#ppartant"));

    var head  = ""; //String contenant la rangée de titres des colonnes

    //Tableaux des attributs offensifs et défensifs respectivement
    var offStats = $("#offense span").text().split(":");
    var defStats = $("#defence span").text().split(":");

    var selector = ""; //Classe qui identifiera un titre de colonne

    //Première entrée du tableau utilisée pour peupler le titre de colonnes
    for (var i in data[0]) {

        //Type d'attributs seulement applicable pour les joueurs de champs
        if (field) {

            //Vérification si attribut offensif
            for (var j = 0; j < offStats.length; j++) {
                if (i == offStats[j]) {
                    selector = "attroff";
                    break;
                }
            }

            //Vérification si attribut défensif
            for (var k = 0; k < defStats.length; k++) {
                if (i == defStats[k]) {
                    selector = "attrdef";
                    break;
                }
            }
        }

        if (i != "partant") { //Éviter l'ajout de la colonne des partants
            head += '' +
                '<th' + (selector == "" ? '>' : ' class="' + selector + '">') +
                    i +
                '</th>'
            ;
        }

        selector = ""; //Sélecteur réinitialisé pour prochain attribut
    }

    table.append('<tr>' + head + '</tr>');

    //Le tableau est rempli des données d'intérêts
    data.forEach(
        function(entry) {

            var content = "";

            for (var i in entry) {

                //Éviter l'ajout de la colonne des partants
                if (i != "partant") {
                    content += ''  +
                        '<td>' +
                            (entry[i] != null ? entry[i] : "N/A") +
                        '</td>'
                    ;
                }
            }

            if (!starting) { //Si l'usager a sélectionné l'option partant
                table.append('<tr>' + content + '</tr>');
            } else {
                if (entry.partant == 1) { //Si le lanceur est partant
                    table.append( '' +
                        '<tr class="start-pitch">' +
                            content +
                        '</tr>'
                    );
                } else {
                    table.append('<tr>' + content + '</tr>');
                }
            }
        }
    )
};

/*
* La fonction queryDetailCompSql a pour but de générer les informations
* supplémentaires relatives au gérant, à l'assistance de match et la masse
* salariale selon les options fournies par l'usager
* Source: https://stackoverflow.com/questions/1456106/how-to-select-an-empty-result-set
*
* @param queryObj String indiquant ce que désire voir l'usager
* @param table String indiquant la table de la base de donnée où se trouve
* l'information en question
* @param year Integer indiquant l'année choisie par l'usager
* @return query String contenant la requête prête à être acheminées au script
* php
**/

var queryDetailCompSql = function(queryObj, table, year) {

    var query = "SUM(" + queryObj + ") AS '" + queryObj + "' " +
            "FROM " + table + " " +
            "WHERE yearID = " + year + " " +
                "AND teamID = 'MON';"
    ;

    return query;
};

/*
* La fonction querySql s'occupe d'établir la requête SQL selon les
* spécifications de l'usager qui sera acheminée au script php pour fournir
* l'information désirée
*
* @param field Booléen indiquant si la requête désirée était pour les joueurs
* de champ ou non
* @param year Integer représentant l'année sélectionnée par l'usager
* @return query String représentant la requête à être acheminée en format SQL
**/

var querySql = function(field, year) {

    var query = "";

    if (field) { //Requête pour les joueurs de champs

        //Attributs offensifs
        var fbaMoy   = $('#fBA-moy').is(':checked');
        var fslMoy   = $('#fSL-moy').is(':checked');
        var fobMoy   = $('#fOB-moy').is(':checked');
        var fsoMoy   = $('#fSO-moy').is(':checked');
        var fsbMoy   = $('#fSB-moy').is(':checked');
        var fab      = $('#fAB').is(':checked');
        var fh       = $('#fH').is(':checked');
        var fx2b     = $('#f2B').is(':checked');
        var fx3b     = $('#f3B').is(':checked');
        var fhr      = $('#fHR').is(':checked');
        var fbb      = $('#fBB').is(':checked');
        var fr       = $('#fR').is(':checked');
        var fsb      = $('#fSB').is(':checked');
        var fcs      = $('#fCS').is(':checked');

        //Attributs défensifs
        var fpMoy   = $('#fFP-moy').is(':checked');
        var fPOS    = $('#fPOS').is(':checked');
        var fA      = $('#fA').is(':checked');
        var fE      = $('#fE').is(':checked');
        var fsalary = $('#fsalary').is(':checked');

        //Triage
        var sort    = $('input[name="field-sort"]:checked').val();

        if (year >= 1985) { //Années pour lesquelles un salaire est disponible

            query = "" +
                    "m.nameLast AS nom, " +
                    "m.nameFirst AS prenom" +
                    (fbaMoy ? ", b.H/b.AB AS 'BA%'" : "") +
                    (fslMoy ? ", (b.H-b.2B-b.3B-b.HR+2*b.2B+3*b.3B+4*b.HR)" +
                        "/b.AB AS 'SL%'" : "") +
                    (fobMoy ? ", (b.H+b.BB+b.HBP)/(b.AB+b.BB+b.HBP+b.SF) AS " +
                        "'OB%'" : "") +
                    (fsoMoy ? ", b.SO/b.AB AS 'SO%'" : "") +
                    (fsbMoy ? ", b.SB/(b.CS+b.SB) AS 'SB%'" : "") +
                    (fab ? ", b.AB" : "") +
                    (fh ? ", b.H" : "") +
                    (fx2b ? ", b.2B" : "") +
                    (fx3b ? ", b.3B" : "") +
                    (fhr ? ", b.HR" : "") +
                    (fbb ? ", b.BB" : "") +
                    (fr ? ", b.R" : "") +
                    (fsb ? ", b.SB" : "") +
                    (fcs ? ", b.CS" : "") +
                    (fpMoy ? ", SUM(f.A)/(SUM(f.A) + SUM(f.E)) AS 'FP%'" : "")+
                    (fPOS ? ", f2.POS AS 'POS*'" : "") +
                    (fA ? ", SUM(f.A) AS A" : "") +
                    (fE ? ", SUM(f.E) AS E" : "") +
                    (fsalary ? ", s.salary AS salaire" : "") +
                " FROM Master AS m " +
                    "INNER JOIN Fielding AS f ON m.playerID = f.playerID " +
                    "INNER JOIN Salaries AS s ON m.playerID = s.playerID " +
                    "INNER JOIN Batting AS b ON m.playerID = b.playerID " +
                    "INNER JOIN (SELECT playerID, yearID, teamID, POS, GS " +
                                "FROM Fielding " +
                                ") AS f2 ON m.playerID = f2.playerID " +
                "WHERE f.yearID = " + year + " " +
                    "AND f.yearID = s.yearID " +
                    "AND f.yearID = b.yearID " +
                    "AND f.yearID = f2.yearID " +
                    "AND f.teamID = 'MON' " +
                    "AND f.teamID = s.teamID " +
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
                "GROUP BY m.playerID " +
                "ORDER BY " + sort + " DESC;"
            ;

        } else { //Années où les salaires ne sont pas disponibles

            if (sort == "salary") sort = "nom";

            query = "" +
                    "m.nameLast AS nom, " +
                    "m.nameFirst AS prenom" +
                    (fbaMoy ? ", b.H/b.AB AS 'BA%'" : "") +
                    (fslMoy ? ", (b.H-b.2B-b.3B-b.HR+2*b.2B+3*b.3B+4*b.HR)" +
                        "/b.AB AS 'SL%'" : "") +
                    (fobMoy ? ", (b.H+b.BB+b.HBP)/(b.AB+b.BB+b.HBP+b.SF) AS " +
                        "'OB%'" : "") +
                    (fsoMoy ? ", b.SO/b.AB AS 'SO%'" : "") +
                    (fsbMoy ? ", b.SB/(b.CS+b.SB) AS 'SB%'" : "") +
                    (fab ? ", b.AB" : "") +
                    (fh ? ", b.H" : "") +
                    (fx2b ? ", b.2B" : "") +
                    (fx3b ? ", b.3B" : "") +
                    (fhr ? ", b.HR" : "") +
                    (fbb ? ", b.BB" : "") +
                    (fr ? ", b.R" : "") +
                    (fsb ? ", b.SB" : "") +
                    (fcs ? ", b.CS" : "") +
                    (fpMoy ? ", SUM(f.A)/(SUM(f.A) + SUM(f.E)) AS 'FP%'" : "")+
                    (fPOS ? ", f2.POS AS 'POS*'" : "") +
                    (fA ? ", SUM(f.A) AS A" : "") +
                    (fE ? ", SUM(f.E) AS E" : "") +
                    (fsalary ? ", NULL AS salaire" : "") +
                " FROM Master AS m " +
                    "INNER JOIN Fielding AS f ON m.playerID = f.playerID " +
                    "INNER JOIN Batting AS b ON m.playerID = b.playerID " +
                    "INNER JOIN (SELECT playerID, yearID, teamID, POS, GS " +
                                "FROM Fielding " +
                                ") AS f2 ON m.playerID = f2.playerID " +
                "WHERE f.yearID = " + year + " " +
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
                "GROUP BY m.playerID " +
                "ORDER BY " + sort + " DESC;"
            ;
        }

    } else { //Requête pour les lanceurs

        //Attributs
        var pera     = $('#pERA').is(':checked');
        var pbaopp   = $('#pBAOpp').is(':checked');
        var ppartant = $('#ppartant').is(':checked');
        var pg       = $('#pG').is(':checked');
        var pgs      = $('#pGS').is(':checked');
        var pcg      = $('#pCG').is(':checked');
        var pw       = $('#pW').is(':checked');
        var pl       = $('#pL').is(':checked');
        var psv      = $('#pSV').is(':checked');
        var pipouts  = $('#pIPouts').is(':checked');
        var pso      = $('#pSO').is(':checked');
        var ph       = $('#pH').is(':checked');
        var pbb      = $('#pBB').is(':checked');
        var psalary = $('#psalary').is(':checked');

        //Triage
        var sort    = $('input[name="pitch-sort"]:checked').val();

        if (year >= 1985) { //Années pour lesquelles un salaire est disponible

            query = "" +
                    "m.nameLast AS nom, " +
                    "m.nameFirst AS prenom" +
                    (pera ? ", p.ERA" : "") +
                    (pbaopp ? ", p.BAOpp" : "") +
                    (pg ? ", p.G" : "") +
                    (pgs ? ", p.GS" : "") +
                    (pcg ? ", p.CG" : "") +
                    (pw ? ", p.W" : "") +
                    (pl ? ", p.L" : "") +
                    (psv ? ", p.SV" : "") +
                    (pipouts ? ", p.IPouts" : "") +
                    (pso ? ", p.SO" : "") +
                    (ph ? ", p.H" : "") +
                    (pbb ? ", p.BB" : "") +
                    (psalary ? ", s.salary AS salaire" : "") +
                    (ppartant ? ", p.GS > 0 AS partant" : "") +
                " FROM Master AS m " +
                    "INNER JOIN Pitching AS p ON m.playerID = p.playerID " +
                    "INNER JOIN Salaries AS s ON m.playerID = s.playerID " +
                "WHERE p.yearID = " + year + " " +
                    "AND p.yearID = s.yearID " +
                    "AND p.teamID = 'MON' " +
                    "AND p.teamID = s.teamID " +
                "ORDER BY " + sort + " DESC;"
            ;

        } else { //Années où les salaires ne sont pas disponibles

            if (sort == "salary") sort = "nom";

            query = "" +
                    "m.nameLast AS nom, " +
                    "m.nameFirst AS prenom" +
                    (pera ? ", p.ERA" : "") +
                    (pbaopp ? ", p.BAOpp" : "") +
                    (pg ? ", p.G" : "") +
                    (pgs ? ", p.GS" : "") +
                    (pcg ? ", p.CG" : "") +
                    (pw ? ", p.W" : "") +
                    (pl ? ", p.L" : "") +
                    (psv ? ", p.SV" : "") +
                    (pipouts ? ", p.IPouts" : "") +
                    (pso ? ", p.SO" : "") +
                    (ph ? ", p.H" : "") +
                    (pbb ? ", p.BB" : "") +
                    (psalary ? ", NULL AS salaire" : "") +
                    (ppartant ? ", p.GS > 0 AS partant" : "") +
                " FROM Master AS m " +
                    "INNER JOIN Pitching AS p ON m.playerID = p.playerID " +
                "WHERE p.yearID = " + year + " " +
                    "AND p.teamID = 'MON' " +
                "ORDER BY " + sort + " DESC;"
            ;
        }
    }

    return query;
};

/*
* La procédure queryData s'occupe d'acheminé la requête formée par l'usager
* au script php pour ensuite récupérer l'information provenant de la requête
*
* @param query String composé de la requête formée par l'usager en format SQL
* @param type Booléen indiquant le type de données à recueillir selon le type
* de joueurs sélectionnés
**/

var queryData = function(query, type) {

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
                if (obj.data.length <= 1) {
                    loadDetails(obj.data)
                } else {
                    loadTable(obj.data, type);
                }
            } else { //En cas d'erreur
                alert(obj.error);
            }
        }
    );
};

/*
* La procédure checkControl s'occupe de contrôler la présence de certains
* éléments de la page selon les choix entrepris par l'usager dans l'interface
* et entreprends certaines requêtes pour les attributs simples de la page
* Source: https://www.w3schools.com/jquery/eff_hide.asp
**/

var checkControl = function() {

    var yearSelect = $("#year option:selected").text(); //Année sélectionnée

    var mngerSelect = $('#manager').is(':checked');
    var attdSelect  = $('#attendance').is(':checked');
    var paySelect   = $('#salary').is(':checked');

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
        //Need to know what proprio means
    } else {
        $('.detail-comp #manager-data, #prop-data').invisible();
    }

    //Informations relatives à l'assistance
    if (attdSelect) {
        $('.detail-comp #attendance-data').visible();
        queryData(queryDetailCompSql("attendance", "Teams", yearSelect));
    } else {
        $('.detail-comp #attendance-data').invisible();
    }

    //Informations relatives à la masse salariale
    if (paySelect) {
        $('.detail-comp #salary-data').visible();
        queryData(queryDetailCompSql("salary", "Salaries", yearSelect));
    } else {
        $('.detail-comp #salary-data').invisible();
    }
};

/*
* La procédure init prépare la requête sur les joueurs selon les spécifications
* apportées par l'usager et selon le tableau que l'usager désire voir
*
* @param field Booléen indiquant si les informations sur les joueurs de champs
* a été demandé ou non
**/

var init = function(field) {

    var yearSelect = $("#year option:selected").text(); //Année sélectionnée

    if (field) {

        //L'année sélectionnée est mise-à-jour
        $("#field").html(' en ' + yearSelect);

        //Tableau alloqué aux joueurs réinitialisé pour la nouvelle requête
        $("#field-table").html('');
    } else {

        //L'année sélectionnée est mise-à-jour
        $("#pitch").html(' en ' + yearSelect);

        //Tableau alloqué aux lanceurs réinitialisé pour la nouvelle requête
        $("#pitch-table").html('');
    }

    //Une requête selon le type de joueurs sélectionné est lancé
    queryData(querySql(field,yearSelect), field);
};

/*
* La procédure attrSelect gère l'état des options se rapportant à la sélection
* d'attributs des joueurs de champ et lanceurs selon les spécifications de
* l'usager
*
* @param field Booléen indiquant si l'option modifiée était pour les joueurs de
* champ ou non
**/

var attrSelect = function(field) {

    if (field) { //Les attributs des joueurs de champs sont modifiés

        var select = $('input[name="field-select"]:checked').val();

        if (select == "off") { //Attributs à l'offensive sont cochés

            $('#field-attroff input:checkbox').prop('checked', true);
            $('#field-attroff input:checkbox').attr('disabled', true);

            $('#field-attrdef input:checkbox').prop('checked', false);
            $('#field-attrdef input:checkbox').attr('disabled', false);

        } else if (select == "def") { //Attributs à la défensive sont cochés

            $('#field-attroff input:checkbox').prop('checked', false);
            $('#field-attroff input:checkbox').attr('disabled', false);

            $('#field-attrdef input:checkbox').prop('checked', true);
            $('#field-attrdef input:checkbox').attr('disabled', true);

        } else if (select == "all") { //Tous les attributs sont cochés

            $('#field-attroff input:checkbox').prop('checked', true);
            $('#field-attroff input:checkbox').attr('disabled', true);

            $('#field-attrdef input:checkbox').prop('checked', true);
            $('#field-attrdef input:checkbox').attr('disabled', true);

        } else { //Aucun attribut n'est coché

            $('#field-attroff input:checkbox').prop('checked', false);
            $('#field-attroff input:checkbox').attr('disabled', false);

            $('#field-attrdef input:checkbox').prop('checked', false);
            $('#field-attrdef input:checkbox').attr('disabled', false);
        }

    } else { //Les attributs des lanceurs sont modifiés

        var select = $('input[name="pitch-select"]:checked').val();

        if (select == "all") { //Tous les attributs sont cochés

            $('#pitch-attr input:checkbox').prop('checked', true);
            $('#pitch-attr input:checkbox').attr('disabled', true);

        } else { //Aucun attribut n'est coché

            $('#pitch-attr input:checkbox').prop('checked', false);
            $('#pitch-attr input:checkbox').attr('disabled', false);
        }
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