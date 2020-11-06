/*
* @Philippe Gabriel
* @Version 4.3.25  2020-04-28
**/

/*
* Bonjour Monsieur,
*
* Ce commentaire ne fait pas partie du code, il s'agit simplement d'une méthode
* par laquelle je voulais vous écrire un dernier message ce trimestre.
*
* Je voulais vraiment vous remercier pour les efforts que vous avez mis durant
* cette session en dépit des circonstances inhabituelles qui sont survenus.
* J'ai pu apprendre plusieurs nouvelles choses passionnantes avec ce cours
* grâce à vos notes traitant sur divers aspects de l'informatique et grâce aux
* multiples autres ressources externes que j'ai exploré durant cette session.
* J'ai surtout aimé les travail pour le devoir 4 ainsi que pour l'examen final
* qui nous appelait à bâtir nos pages à l'aide de 4 différents langages de
* programmation, c'est vraiment le partie de ce trimestre où j'ai pu apprendre
* le plus et je vous en suis très reconaissant pour les efforts que vous aviez
* mis pour rédiger les énoncés de ces travaux qui n'a sûrement pas été facile.
*
* De plus, concernant le formattage des nombres dont je vous ai parlé
* dernièrement à travers un courriel, en recherchant un peu plus dans la
* documentation de chart js, j'ai découvert l'option de modifier les libellés
* afin que ceux-ci affichent réellement une valeur plus facile à lire en me
* servant de fonctions callback. Ci-suit quelques liens que j'ai exploré :
* https://www.chartjs.org/docs/latest/configuration/tooltip.html#tooltip-callbacks
* https://www.chartjs.org/docs/latest/axes/labelling.html
*
* Merci énormément pour ce trimestre. Passez un bel été et reposez-vous,
*
* - Philippe Gabriel (20120600)
**/

//Paramètres globaux définissant certains aspects des graphiques
Chart.defaults.global.defaultFontFamily  = 'sans-serif';
Chart.defaults.global.defaultFontSize    = 18;
Chart.defaults.global.defaultFontColor   = '#404040';

//Graphique type tarte global afin de pouvoir détruire une instance précédente
var pieChart = {};

//Liste des équipes de la Ligue Nationale Division Est et leur couleur associée
var teamColor = [
    {team: 'MON', color: '#3e95cd'},
    {team: 'CHN', color: '#6600cc'},
    {team: 'NYN', color: '#009933'},
    {team: 'PHI', color: '#cc0000'},
    {team: 'PIT', color: '#cc9900'},
    {team: 'SLN', color: '#cc6699'},
    {team: 'MIA', color: '#999966'},
    {team: 'FLO', color: '#6699ff'},
    {team: 'WAS', color: '#009999'},
    {team: 'ATL', color: '#666699'}
];

/*
* La fonction numFormat s'occupe de bien afficher les valeurs numériques d'une
* façon lisible pour l'usager
*
* @param num Integer à modifier
* @return format String conenant le nombre formaté
**/

var numFormat = function(num) {

    var preFormat = "" + num; //Le nombre est converti en String

    //Array pour les sections de 3 charactères du nombre avec son index
    var section = Array(Math.ceil(preFormat.length / 3)).fill("");
    var count   = 0;

    //Les sections de 3 charactères ou moins sont déterminés
    switch (preFormat.length % 3) {
        case 2:
            section[count] += preFormat.slice(0,1);
            preFormat = preFormat.slice(1);
        case 1:
            section[count++] += preFormat.slice(0,1);
            preFormat = preFormat.slice(1);
        default:
            for (count; count < section.length; count++) {
                section[count] = preFormat.slice(0,3);
                preFormat = preFormat.slice(3);
            }
    }

    var format = section.join(" ");

    return format;
};

/*
* La procédure loadBarGraph génère le graphique à être affiché dans le canevas
* html concernant les données sur l'évolution des victoires des Expos ainsi que
* sur l'assistance à Montréal
*
* @param data Les données à représenter graphiquement
* @param graphId String représentant l'identificateur du canevas où le graph
* résidera
* @param fiche Booléen indiquant le type d'information à représenter
* graphiquement qui est soit celle sur la fiche de victoires, soit celle sur
* l'assistance à Montréal
**/

var loadBarGraph = function(data, graphId, fiche) {

    var labelsY  = Array(data.length); //Tableau contenant les années

    var mainInfo = Array(data.length); //L'information principale a représenter
    var meanInfo = Array(data.length); //L'information secondaire pour comparer

    //Tableau avec les couleurs de chaque instance d'information principale
    var bckgrdcol = Array(data.length);

    //Tableau avec les couleurs de chaque instance d'information secondaire
    var bckDelta  = Array(data.length);

    data.forEach(
        function(entry,i) {

            labelsY[i]  = entry.Year; //La plage des années à représenter

            //Les informations sont enregistrées dans les tableaux
            mainInfo[i] = entry.Type
            meanInfo[i] = entry.Delta

            //Les couleurs pour chaque instance sont déterminées
            bckgrdcol[i] = (i % 2 == 0 ? "#3e95cd" : "#c45850");
            bckDelta[i]  = (fiche ? "#d1d1e0" : "#33cc33");
        }
    );

    var barChart = new Chart(
        $("#" + graphId),
        {
            type: 'bar',
            data: {
                labels: labelsY,
                datasets: [
                    { //Les données principales
                        //Le titre dépend du type d'information à représenter
                        label: (fiche ?
                            "Victoires annuelle" : "Assistance à Montréal"),
                        type: "bar",
                        backgroundColor: bckgrdcol,
                        borderWidth: 2,
                        borderColor: "#808080",
                        hoverBorderWidth: 3,
                        hoverBorderColor: "#000000",
                        order: +(!fiche), //Précédence selon l'information
                        data: mainInfo
                    },
                    { //Les données secondaires
                        //Le titre dépend du type d'information à représenter
                        label: (fiche ?
                            "Différence annuelle" : "Assistance moyenne"),
                        //Le type de graph varie selon le type d'information
                        type: (fiche ? "bar" : "line"),
                        borderColor: (fiche ? "" : "#228b22"),
                        backgroundColor: bckDelta,
                        data: meanInfo,
                        fill: fiche
                    }
                ]
            },
            options: {
                legend: { //La légende s'affiche selon un ordre spécifique
                    reverse: !fiche
                },
                scales: {
                    xAxes: [
                        {
                            //Les graphs sont empilés selon l'information
                            stacked: fiche,

                            //Le titre de l'axe des x est spécifié
                            scaleLabel: {
                                display: true,
                                labelString: "Année",
                                fontSize: 25,
                                fontStyle: "Bold"
                            }
                        }
                    ],
                    yAxes: [
                        {
                            //Les graphs sont empilés ou selon l'information
                            stacked: fiche,

                            //Le titre de l'axe des y est spécifié
                            scaleLabel: {
                                display: true,
                                labelString: (fiche ?
                                    "Victoires" : "Assistance"),
                                fontSize: 25,
                                fontStyle: "Bold",
                            },
                            ticks: {
                                beginAtZero: true,
                                callback: function(value) {
                                    return numFormat(value);
                                }
                            }
                        }
                    ]
                },
                tooltips: {
                    callbacks: {
                        title: function(item,data) {
                            return item[0].xLabel; //L'année sert de titre
                        },
                        label: function(item,data) {

                            //Valeur non-formattée
                            var value =
                            data.datasets[item.datasetIndex].data[item.index];

                            //Indice indiquant le type de donnée
                            var tag = data.datasets[item.datasetIndex].label;

                            return tag + ": " + numFormat(value);
                        }
                    }
                },
                plugins: {
                    datalabels: {
                        display: false
                    }
                }
            }
        }
    );
};

/*
* La procédure loadLineGraph génère le graphique à être affiché dans le canevas
* html concernant les données sur l'évolution de la masse salariale des Expos
*
* @param data Les données à représenter graphiquement
* @param graphId String représentant l'identificateur du canevas où le graph
* résidera
**/

var loadLineGraph = function(data, graphId) {

    var labelsY    = Array(data.length); //Tableau contenant les années

    //Tableaux contenant les salaires de chaque nature d'intérêt
    var salaryExpo = Array(data.length);
    var salaryAvg  = Array(data.length);
    var salaryMax  = Array(data.length);

    data.forEach(
        function(entry,i) {

            labelsY[i]  = entry.Year; //La plage des années à représenter

            //Les informations sont enregistrées dans les tableaux
            salaryExpo[i] = entry.Expos;
            salaryAvg[i]  = entry.AvgNL;
            salaryMax[i]  = entry.MaxNL;
        }
    );

    var lineChart = new Chart(
        $("#" + graphId),
        {
            type: 'line',
            data: {
                labels: labelsY,
                datasets: [
                    { //La masse salariale des Expos
                        label: "Masse salariale Expos",
                        type: "line",
                        data: salaryExpo,
                        fill: false,
                        borderColor: "#00529b",
                        backgroundColor: "#80c3ff"
                    },
                    { //La masse salariale moyenne de la Ligue Nationale
                        label: "Masse salariale moyenne Ligue Nationale",
                        type: "line",
                        data: salaryAvg,
                        fill: false,
                        borderColor: "#ff1a1a",
                        backgroundColor: "#ff8080"
                    },
                    { //La masse salariale maximale de la Ligue Nationale
                        label: "Masse salariale maximale Ligue Nationale",
                        type: "line",
                        data: salaryMax,
                        fill: false,
                        borderColor: "#ffcc00",
                        backgroundColor: "#ffe680"
                    }
                ]
            },
            options: {
                legend: {
                    display: true,
                    position: "right",
                    reverse: true
                },
                scales: { //Le titre des axes est spécifié
                    xAxes: [
                        {
                            scaleLabel: {
                                display: true,
                                labelString: "Année",
                                fontSize: 25,
                                fontStyle: "Bold"
                            }
                        }
                    ],
                    yAxes: [
                        {
                            scaleLabel: {
                                display: true,
                                labelString: "Masse Salariale (USD)",
                                fontSize: 25,
                                fontStyle: "Bold"
                            },
                            ticks: {
                                callback: function(value) {
                                    return numFormat(value);
                                }
                            }
                        }
                    ]
                },
                tooltips: {
                    callbacks: {
                        title: function(item,data) {
                            return item[0].xLabel; //L'année sert de titre
                        },
                        label: function(item,data) {

                            //Valeure non-formattée
                            var value =
                            data.datasets[item.datasetIndex].data[item.index];

                            //Indice indiquant le type de masse salariale
                            var tag = data.datasets[item.datasetIndex].label;

                            return tag + ": " + numFormat(value) + " $";
                        }
                    }
                },
                plugins: {
                    datalabels: {
                        display: false
                    }
                }
            }
        }
    );
};

/*
* La procédure loadPieGraph génère le graphique à être affiché dans le canevas
* html concernant les données sur la masse salariale de chaque équipe de la
* Division Est de la Ligue Nationale
*
* @param data Les données à représenter graphiquement
* @param graphId String représentant l'identificateur du canevas où le graph
* résidera
**/

var loadPieGraph = function(data, graphId) {

    var labelsT    = Array(data.length); //Tableau contenant les équipes
    var salaryT    = Array(data.length); //Tableau contenant leur salaire
    var usedColors = Array(data.length); //Tableau contenant leur couleur

    //Élément html indiquant l'année pour laquelle une requête a été généré
    var yearIndicate = $("#salaire-annee")

    //Si l'élément est vide, aucune requête n'a encore été généré
    if (yearIndicate.text() != "") pieChart.destroy();

    //L'élément est mis-à-jour pour indiquer l'année sélectionnée
    yearIndicate.html(' en ' + $("#year option:selected").text());

    data.forEach(
        function(entry,i) {

            labelsT[i] = entry.team; //La plage des équipes à représenter

            //Les informations sur le salaire sont enregistrées dans le tableau
            salaryT[i] = entry.salary;

            //Les couleurs correspondantes aux équipes sont sélectionnées
            usedColors[i] = teamColor[teamColor.map(
                function(element) {return element.team;}
            ).indexOf(entry.team)].color;
        }
    );

    pieChart = new Chart(
        $('#' + graphId),
        {
            type: 'pie',
            data: {
                labels: labelsT,
                datasets: [
                    {
                        data: salaryT,
                        backgroundColor: usedColors,
                        borderWidth: 2,
                        borderColor: "#000000"
                    }
                ]
            },
            options: {
                legend: {
                    display: false,
                },
                tooltips: {
                    callbacks: {
                        label: function(item,data) {

                            //Valeure non-formattée
                            var value =
                            data.datasets[item.datasetIndex].data[item.index];

                            //Indice indiquant l'ID de l'équipe
                            var tag = data.labels[item.index];

                            return tag + ": " + numFormat(value) + " $";
                        }
                    }
                },
                plugins: {
                    datalabels: {
                        formatter: function(value,canvas) {

                            //Source: http://www.java2s.com/example/javascript/chart.js/chartjs-and-data-labels-to-show-percentage-value-in-pie-piece.html

                            //Données du graphique type tarte sont récupérées
                            var chart = canvas.chart.data.datasets[0];

                            var sum = 0;  //Somme des valeurs
                            var pct = ""; //Pourcentage à afficher

                            //La somme des valeurs est calculée
                            sum = chart.data.reduce(
                                function(x,y) {
                                    return +x + +y;
                                },0
                            );

                            //Calcul du pourcentage
                            pct += Math.round((value / sum) * 10000) / 100;

                            //Afin d'ajouter 2 décimales après la virgule
                            if (pct.split(".").length < 2) pct += ".";

                            switch (pct.split(".")[1].length) {
                                case 0:  pct += "0";
                                case 1:  pct += "0";
                                default: pct += "%";
                            }

                            return pct;
                        },
                        color: '#ffff66'
                    }
                }
            }
        }
    );
};

/*
* La procédure generateTeamLegend génère la légende informant l'usager de
* l'association entre l'id d'une équipe et de son nom
*
* @param data Tableau d'objets contenant les données
* @param tableId String représentant l'identificateur du tableau où la légende
* résidera
**/

var generateTeamLegend = function(data,tableId) {

    var content = ""; //Contenu de la légende

    data.forEach(

        function(entry) {

            //Recherche de la couleur associée à l'équipe
            var color = teamColor[teamColor.map(
                function(element) {return element.team;}
            ).indexOf(entry.team)].color;

            content += "" +
            "<tr>" +
                "<td style='background-color: " + color + "'>" +
                    entry.team +
                "</td>" +
                "<td>" +
                    entry.name +
                "</td>" +
            "</tr>";
        }
    );

    $("#" + tableId).html(content);
};

/*
* La procédure manageData s'occupe de gérer la façon par laquelle les
* informations fournies seront représentés graphiquement
*
* @param data Les données à représenter
* @param graphId String représentant l'identificateur du canevas où le graph
* résidera
* @param type Le type de donnée à représenter
**/

var manageData = function(data, graphId, type) {

    //Requête sur victoires accumulées
    if (type == "Wins") {
        loadBarGraph(data, graphId, true);

    //Requête sur assistance aux matchs
    } else if (type == "Att") {
        loadBarGraph(data, graphId, false);

    //Requête sur masse salariale
    } else if (type == "Sal") {
        loadLineGraph(data, graphId);

    //Requête sur masse salariale des équipes de la ligue et division des Expos
    } else if (type == "SalNl") {
        loadPieGraph(data,graphId);
        generateTeamLegend(data,"team-legend");
    }
};

/*
* La procédure queryData s'occupe d'acheminé la requête au script php pour
* ensuite récupérer l'information provenant de la requête prête à être
* convertie en graphique
*
* @param query String composé de la requête
**/

var queryData = function(query, graphId, type) {

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
                manageData(obj.data, graphId, type);
            } else { //En cas d'erreur
                alert(obj.error);
            }
        }
    );
};


/*
* La fonction querySql s'occupe d'établir la requête SQL selon le type
* d'information à représenter qui sera acheminée au script php pour fournir
* l'information désirée
*
* @param type String indiquant le type d'information d'intérêt
* @return query String représentant la requête à être acheminée en format SQL
**/

var querySql = function(type) {

    var query = "";

    if (type == "Wins") { //Requête portant sur la fiche de victoires

        query = "" +
                "t1.yearID AS Year, " +
                "t1.W AS Type, " +
                "t2.MaxWins - t1.W AS Delta " +
            "From Teams AS t1 " +
                "INNER JOIN (SELECT yearID, " +
                        "MAX(W) AS MaxWins " +
                    "FROM Teams " +
                    "WHERE lgID = 'NL' " +
                        "AND divID = 'E' " +
                    "GROUP BY yearID " +
                    "HAVING yearID >= 1969 " +
                ") AS t2 " +
                "ON t1.yearID = t2.yearID " +
            "WHERE t1.teamID = 'MON';"
        ;

    } else if (type == "Att") { //Requête portant sur l'assistance aux matchs

        query = "" +
                "t.yearID AS Year, " +
                "t.attendance AS Type, " +
                "tAvgYear.AvgAssist AS Delta " +
            "FROM Teams AS t " +
                "INNER JOIN (SELECT yearID, " +
                        "ROUND(AVG(attendance)) AS AvgAssist " +
                    "FROM Teams " +
                    "WHERE lgID = 'NL' " +
                    "GROUP BY yearID " +
                ") AS tAvgYear " +
                "ON t.yearID = tAvgYear.yearID " +
            "WHERE t.teamID='MON';"
        ;

    } else if (type == "Sal") { //Requête portant sur la masse salariale

        query = "" +
                "t.yearID AS Year, " +
                "SUM(s.salary) AS Expos, " +
                "Gen.Avg AS AvgNL, " +
                "Gen.Max AS MaxNL " +
            "FROM Teams AS t " +
                "INNER JOIN Salaries AS s " +
                    "ON t.teamID = s.teamID " +
                        "AND t.yearID = s.yearID " +
                "INNER JOIN (SELECT yearID, " +
                        "ROUND(AVG(MS.SalaryMass)) AS Avg, " +
                        "MAX(MS.SalaryMass) AS Max " +
                    "FROM (SELECT t2.yearID, " +
                                "t2.teamID, " +
                                "SUM(s2.salary) AS SalaryMass " +
                            "FROM Teams AS t2 " +
                                "INNER JOIN Salaries AS s2 " +
                                    "ON t2.teamID = s2.teamID " +
                                        "AND t2.yearID = s2.yearID " +
                            "WHERE t2.lgID = 'NL' " +
                            "GROUP BY t2.yearID, t2.teamID " +
                        ") AS MS " +
                    "GROUP BY yearID " +
                ") AS Gen " +
                "ON t.yearID = Gen.yearID " +
            "WHERE t.teamID = 'MON' " +
            "GROUP BY t.yearID;"
        ;

    //Requête portant sur la masse salariale des équipes de la Ligue Nationale
    //Division Est
    } else if (type == "SalNl") {

        //Année sélectionnée par l'usager
        var year = $("#year option:selected").text();

        query = "" +
                "t.teamID AS team, " +
                "t.name, " +
                "SUM(s.salary) AS salary " +
            "FROM Teams AS t " +
                "INNER JOIN Salaries AS s " +
                    "ON t.teamID = s.teamID " +
                        "AND t.lgID = s.lgID " +
                        "AND t.yearID = s.yearID " +
            "WHERE t.lgID = 'NL' " +
                "AND t.divID = 'E' " +
                "AND t.yearID = " + year + " " +
            "GROUP BY s.teamID;"
        ;
    }

    return query;
};

/*
* La procédure init génère les graphiques ne nécessitant pas une action de
* l'usager en plus de configurer l'élément de sélection d'une année pour la
* génération du dernier graphique ainsi que sa légende
**/

var init = function() {

    //Les trois premiers graphiques sont générés automatiquement
    queryData(querySql("Wins"), "fiche-Expos", "Wins");
    queryData(querySql("Att"), "assist-Expos", "Att");
    queryData(querySql("Sal"), "salaire-Expos", "Sal");

    //La plage des années que l'usager pourra sélectionner est générée
    for(var i = 1985; i <= 2004; i++) {
        $("#year").append('<option>' + i + '</option>');
    }
};