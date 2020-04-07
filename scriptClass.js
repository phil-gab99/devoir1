//Cette fonction remplie un tableau html avec identificateur id avec
//contient une colonne par attribut dans donnees et les valeurs dans donnees
//rangees. Chaque colonne est nomme par l'attribut qu'il represente.
function genereTableau(donnees, id){
    var nb = donnees.length;
    if(nb>0){
        var nbattributs = donnees[0].length;
        var htmltable="<tr>";
        for(var attr in donnees[0]){
            htmltable=htmltable+"<th>"+attr+"</th>";
        };
        htmltable=htmltable+"</tr>";
        for(var x=0;x<nb;x++){
            htmltable=htmltable+"<tr>";
            for(var a in donnees[x]){
                htmltable=htmltable+"<td>"+donnees[x][a]+"</td>";
            }
            htmltable=htmltable+"</tr>";
        }
        $("#"+id).html(htmltable);
    }else{
        alert("Le résultat retourné est vide.");
        $("#"+id).html("");
    }
}

function poste(requete){
    var postData = {};
    postData["db"] = "dift6800_baseball";
    postData["query"] = requete;
    //La requête AJAX suit, faisant appel au backend db.php qui se trouve dans le même répertoire
    $.post(
        "http://www-ens.iro.umontreal.ca/~dift6800/baseball/db.php",
        postData,
        function(reponse,status){
            console.log(status);
            var obj = JSON.parse(reponse);
            if(obj.error==""){
                genereTableau(obj.data, "table");
            }else{
                alert("Erreur:"+obj.error);
            }
        }
    );
};

$(document).ready(function(){
    $("#lance").click(function(event){
        poste($("#req").val());	
    });
});