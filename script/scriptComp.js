/*
* @Vincent Falardeau
* @Philippe Gabriel
* @Version 0.0.0 2020-04-17
**/

/*
* La procédure checkControl s'occupe de contrôler la visibilité de certains
* éléments de la page selon les choix entrepris par l'usager dans l'interface
* Source: https://www.w3schools.com/jquery/eff_hide.asp
**/

var checkControl = function() {

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
};

/*
* La procédure loadUI s'occupe de configurer un élément de sélection par
* l'usager et initie une première requête
**/

var loadUI = function() {

    for(var i = 1969; i <= 2004; i++) {
        $("#year").append('<option>' + i + '</option>');
    }

    // init();
};