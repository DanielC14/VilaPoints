var config = {
    apiKey: "AIzaSyCsz1iOcpccrO1flCUlFYaQpn-TJiKdwVk",
    authDomain: "ptvc-911fd.firebaseapp.com",
    databaseURL: "https://ptvc-911fd.firebaseio.com",
    storageBucket: "ptvc-911fd.appspot.com",
    messagingSenderId: "746182714132"
};
firebase.initializeApp(config);



$(document).ready(function () {



    var selDiv = "";




    $(".locais").click(function (e) {
        e.preventDefault();
        createVC(this.text);

    });

    $("#imgLogo").click(function (e) {
        e.preventDefault();
        document.location.href = 'pagInicial.html';
    });


    $("#closeMLogin").click(function () {

        document.getElementById('modalLogin').style.display = 'none';
        $(".erro").empty();
    });

    $("#closeMSignup").click(function () {

        document.getElementById('modalSignup').style.display = 'none';
        $(".erro").empty();
    });

    $(document).on('click', '.btnAddFavorito', function () {
        if (firebase.auth().currentUser) {
            saveFavorites($(this).val());
            $(this).attr("class", "btnPonto btnRemoveFavorito");
            $(this).html("<span class='glyphicon glyphicon-star yellow'></span> Remover Favorito");
        }
        else {
            document.getElementById('modalLogin').style.display = 'block';
        }
    });


    $(document).on('click', '.btnRemoveFavorito', function () {
        removeFavorite($(this).val());
        $(this).attr("class", "btnPonto btnAddFavorito");
        $(this).html("<span class='glyphicon glyphicon-star'></span> Adicionar Favorito");
    });

    

    $(document).on('click', '.btnRemovePoint', function () {
        for(var i = 0 ; i< pontos.length;i++)
        {
            if(pontos[i].idPonto == $(this).val())
            {
                $("#divIMGEliminar").html("<img class='imgEliminarPonto' src='" + pontos[i].img[0] + "'>");
                $("#divTitleEliminar").html("<h4>" + pontos[i].title + "</h4>");
                $("#btnYes").attr("value", pontos[i].idPonto);
            }
        }
        document.getElementById('modalEliminar').style.display = 'block';
        
    });

    $(document).on('click', '#btnNo', function () {
        
        document.getElementById('modalEliminar').style.display = 'none';
        
    });

    $(document).on('click', '#btnYes', function () {
        
        document.getElementById('modalEliminar').style.display = 'none';
        removePoint($(this).val());

        
    });

    $(document).on('click', '.btnVerMais', function () {
        localStorage.setItem("page", $(this).val());
        document.location.href = 'verMais.html';

    });

    $(document).on('click', '.nextPage', function () {
        nextPage();

    });

    $(document).on('click', '.prevPage', function () {
        previousPage();

    });

    $(".btnShowMyPoints").click(function () {
        document.location.href = 'verAdicionados.html';
    });

    

    $(".btnPagInicial").click(function () {
        document.location.href = 'pagInicial.html';
    });

    $(document).on('click', '#btnSucesso', function () {
        document.getElementById('modalCriado').style.display = 'none';
        $("#inputTitle").val("");
        $("#inputMorada").val("");
        $("#inputDescription").val("");
        $("#selectedPhotos").html("");
        filesArr.length = 0;
    });

    $(".btnFavorito").click(function () {
        document.location.href = 'favoritos.html';
    });

    $(".btnAddPonto").click(function () {
        document.location.href = 'adicionarPonto.html';
    });

    $("#inputSubmit").click(function () {
        addPonto();
    });




    //LOGIN

    $("#btnlogin").click(function () {
        document.getElementById('modalLogin').style.display = 'block';
    });

    $(".btnloginSubmitVM").click(function (e) {
        e.preventDefault();

        var email = $("#emailLogin").val();
        var password = $("#passwordLogin").val();


        var promise = firebase.auth().signInWithEmailAndPassword(email, password).then(
            function () {
                $(".erro").empty();
                initVerMais();

            }

        );

        promise.catch(f =>

            $(".erro").text("Email ou password incorretos!!!"));


    });

    $(".btnloginSubmitPI").click(function (e) {
        e.preventDefault();
        var email = $("#emailLogin").val();
        var password = $("#passwordLogin").val();


        var promise = firebase.auth().signInWithEmailAndPassword(email, password).then(
            function () {
                $(".erro").empty();
                initPagInicial();

            }

        );

        promise.catch(f =>

            $(".erro").text("Email ou password incorretos!!!"));

    });


    //CRIAR CONTA
    $("#btnsignup").click(function () {
        document.getElementById('modalSignup').style.display = 'block';
    });

    $("#btnSignupSubmit").click(function (e) {
        e.preventDefault();
        var email = $("#emailSignup").val();
        var password = $("#passwordSignup").val();
        var passwordRepeat = $("#passwordRepeatSignup").val();

        if (password != passwordRepeat) {
            $(".erro").text("As passwords não coincidem!");
        }
        else {
            if (password.length < 6) {
                $(".erro").text("A password deve conter no mínimo 6 caracteres!")
            }
            else {
                var promise = firebase.auth().createUserWithEmailAndPassword(email, password).then(
                    function (user) {
                        return user.updateProfile({
                            displayName: $("#usernameInput").val()
                        });
                        $(".erro").empty();
                    });
                promise.catch(f => $(".erro").text("Email inválido!!!"));
            }
        }
    });


    //LOGOUT
    $(".btnPILogout").click(function (e) {
        e.preventDefault();
        firebase.auth().signOut();
        favoritos.length = 0;
        localStorage.removeItem("favoritos");
        window.setTimeout(initPagInicial, 500);

    });

    $(".btnVMLogout").click(function (e) {
        e.preventDefault();
        firebase.auth().signOut();
        favoritos.length = 0;
        localStorage.removeItem("favoritos");
        initVerMais();
    });

    $(".btnBadLogout").click(function () {
        firebase.auth().signOut();
        favoritos.length = 0;
        localStorage.removeItem("favoritos");
        document.location.href = 'pagInicial.html';
    });




});

//VERIFICAR SE EXISTE UTILIZADOR LOGADO
firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {


        document.getElementById("btnlogout").classList.remove('hide');
        document.getElementById("btnlogin").classList.add('hide');
        document.getElementById("btnsignup").classList.add('hide');
        document.getElementById("ddUser").classList.remove('hide');
        if(firebase.auth().currentUser.displayName)
        {
            document.getElementById("btnUser").innerHTML = firebase.auth().currentUser.displayName + " <span class='caret'></span>";
        }
        else
        {
            document.getElementById("btnUser").innerHTML = "... <span class='caret'></span>";
            window.setTimeout(function(){
                document.getElementById("btnUser").innerHTML = firebase.auth().currentUser.displayName + " <span class='caret'></span>";
            },500);
            
        }
        
        document.getElementById('modalLogin').style.display = 'none';
        document.getElementById('modalSignup').style.display = 'none';

    }
    else {

        document.getElementById("btnlogout").classList.add('hide');
        document.getElementById("btnlogin").classList.remove('hide');
        document.getElementById("btnsignup").classList.remove('hide');
        document.getElementById("ddUser").classList.add('hide');
    }
});


//LOAD AND SAVE FAVORITOS

var favoritos = [];



function saveFavorites(favPoint) {
    favoritos.push(favPoint);
    var userID = firebase.auth().currentUser.uid;
    var allFav = "";
    for (var i = 0; i < favoritos.length; i++) {

        if (i == favoritos.length - 1 || favoritos.length == 1) {
            allFav += favoritos[i];
        }
        else {
            allFav += favoritos[i] + "#";
        }


    }

    localStorage.setItem("favoritos", JSON.stringify(favoritos));
    firebase.database().ref().child('fav').child(userID).set({
        favorites: allFav
    });

}

function removeFavorite(favPoint) {
    favoritos.splice(favoritos.indexOf(favPoint), 1);
    var userID = firebase.auth().currentUser.uid;
    if (favoritos.length > 0) {
        var allFav = "";
        for (var i = 0; i < favoritos.length; i++) {

            if (i == favoritos.length - 1 || favoritos.length == 1) {
                allFav += favoritos[i];
            }
            else {
                allFav += favoritos[i] + "#";
            }


        }
        localStorage.setItem("favoritos", JSON.stringify(favoritos));
        firebase.database().ref().child('fav').child(userID).set({
            favorites: allFav
        });
    }
    else {
        localStorage.removeItem("favoritos");
        firebase.database().ref().child('fav').child(userID).set(null);
    }



}


//OBJETO PONTOS
var pontos = [];

function Ponto(idPonto, title, description, img, lat, lng, location, madeby) {
    this.idPonto = idPonto;
    this.title = title;
    this.description = description;
    this.img = img;
    this.lat = lat;
    this.lng = lng;
    this.location = location;
    this.madeby = madeby;


}



//BASE DE DADOS



function getDataBase() {
    favoritos.length = 0;
    var ref = firebase.database().ref();
    ref.child('pontos').on('value', function (snapshot) {
        pontos.length = 0;
        var child = [];

        var allPoints = snapshot.val();
        Object.keys(allPoints).forEach(function (k) {

            child.push(k);

        });

        for (var i = 0; i < child.length; i++) {


            var ponto = child[i];
            var imageschild = [];
            var img = [];

            Object.keys(allPoints[ponto].images).forEach(function (k) {

                imageschild.push(k);

            });

            for (var j = 0; j < imageschild.length; j++) {
                img.push(allPoints[ponto].images[imageschild[j]].url)
            }

            var title = allPoints[ponto].title;
            var description = allPoints[ponto].description;
            var lat = allPoints[ponto].map.lat;
            var lng = allPoints[ponto].map.lng;
            var location = allPoints[ponto].location;
            var idponto = allPoints[ponto].idponto;
            var madeby = allPoints[ponto].madeby;
            pontos.push(new Ponto(idponto, title, description, img, lat, lng, location, madeby));

        }
        pontos.sort(function (a, b) { return (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0); });

        localStorage.setItem("pontos", JSON.stringify(pontos));

        if (firebase.auth().currentUser) {
            var userID = firebase.auth().currentUser.uid;
            ref.child('fav').child(userID).child('favorites').once('value', function (snapshot) {

                var fav = snapshot.val();
                favoritos.length = 0;
                if (fav != null) {
                    var allFav = fav.split("#");
                    for (var i = 0; i < allFav.length; i++) {
                        favoritos.push(allFav[i]);
                    }
                    localStorage.setItem("favoritos", JSON.stringify(favoritos));
                }

                showPoints();
            });
        }
        else {
            showPoints();
        }


    });


}



function makeID() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    for (var i = 0; i < pontos.length; i++) {
        if (text == pontos[i].idPonto) {
            makeID();
        }
    }
    return text;
}

function initFiles() {
    document.querySelector('#inputFile').addEventListener('change', handleFileSelect, false);
    selDiv = document.querySelector("#selectedPhotos");
}


var filesArr;


function handleFileSelect(e) {
    if (!e.target.files || !window.FileReader) return;
    selDiv.innerHTML = "";

    var files = e.target.files;

    filesArr = Array.prototype.slice.call(files);
    filesArr.forEach(function (f) {
        if (!f.type.match("image.*")) {
            return;
        }
        var reader = new FileReader();
        reader.onload = function (e) {
            var html = "<img src=\"" + e.target.result + "\">" + f.name + "<br clear=\"left\"/>";
            selDiv.innerHTML += html;
        }
        reader.readAsDataURL(f);
    });
}

function addPonto() {

    var idPonto = makeID();
    var allowed = true;
    var title = $("#inputTitle").val();
    var location = $("#inputMorada").val();
    var description = $("#inputDescription").val();
    var lat = markerAddPoint.getPosition().lat();
    var lng = markerAddPoint.getPosition().lng();
    var madeby = firebase.auth().currentUser.uid;
    var url = [];
    var z = 0;
    if (!title || !location || !description) {
        $(".erro").text("Preencha todos os campos!!!");
        allowed = false;
    }
    else if (!filesArr) {
        $(".erro").text("Forneça pelo menos uma imagem!");
        allowed = false;
    }

    if (allowed == true) {
        document.getElementById('modalaCriar').style.display = 'block';
        filesArr.forEach(function (f) {

            if (!f.type.match("image.*")) {
                return;
            }
            var filename = f.name;
            var storageRef = firebase.storage().ref("/" + idPonto + "/" + filename);
            var uploadTask = storageRef.put(f);

            uploadTask.on("state_changed", function (snapshot) {
                $(".erro").empty();
            }, function (error) {
                console.log(error);
            }, function () {
                url.push(uploadTask.snapshot.downloadURL);
                if (z == filesArr.length - 1) {


                    pontos.push(new Ponto(idPonto, title, description, url, lat, lng, location, madeby));
                    pontos.sort(function (a, b) { return (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0); });
                    localStorage.setItem("pontos", JSON.stringify(pontos));


                    firebase.database().ref().child('pontos').child(idPonto).set({
                        madeby: madeby,
                        description: description,
                        idponto: idPonto,
                        location: location,
                        title: title

                    });
                    for (var i = 0; i < url.length; i++) {
                        firebase.database().ref().child('pontos').child(idPonto).child('images').child(i).set({
                            url: url[i]
                        });
                    };



                    firebase.database().ref().child('pontos').child(idPonto).child("map").set({
                        lat: lat,
                        lng: lng
                    });

                    document.getElementById('modalaCriar').style.display = 'none';
                    document.getElementById('modalCriado').style.display = 'block';
                }
                z++;

            });

        });
    }

}



//CRIACAO DA PAGINA DO PONTO

function createVC(local) {

    var btnFav = false;
    var botao = "";
    var imagens = "";

    for (var i = 0; i < pontos.length; i++) {
        if (pontos[i].idPonto == local) {
            if (favoritos) {
                for (var j = 0; j < favoritos.length; j++) {
                    if (local != favoritos[j]) {
                        btnFav = false;
                    }
                    else {
                        btnFav = true;
                        break;
                    }
                }
            }


            if (btnFav == true) {
                botao = "<button class='btnPonto btnRemoveFavorito' value='" + pontos[i].idPonto + "'><span class='glyphicon glyphicon-star yellow'></span> Remover Favorito</button>";
            }
            else {
                botao = "<button class='btnPonto btnAddFavorito' value='" + pontos[i].idPonto + "'><span class='glyphicon glyphicon-star'></span> Adicionar Favorito</button>";
            }

            if (pontos[i].img.length > 0) {

                imagens += "<div class='item active'><img class='carImage' src='" + pontos[i].img[0] + "'></div>";

                if (pontos[i].img.length > 1) {
                    for (var q = 1; q < pontos[i].img.length; q++) {
                        imagens += "<div class='item'><img class='carImage' src='" + pontos[i].img[q] + "'></div>";
                    }
                }

            }

            $("title").html("Vila Points - " + pontos[i].title);
            $("#verMTitle").html(pontos[i].title);
            $("#verMbtnFavorite").html(botao);
            $("#verMDescription").html(pontos[i].description);
            $("#verMImages").html(imagens);


            initMap(parseFloat(pontos[i].lat), parseFloat(pontos[i].lng));


            break;


        }
    }
}





var num = 0;
var totalPoints = 0;






function showPoints() {

    var pag = "";
    var favorite = false;
    var next = false;
    var numPoints;
    num = 0;
    totalPoints = 0;

    totalPoints = pontos.length;

    if (totalPoints > 10) {
        next = true;
        numPoints = 10;
    }
    else
    {
        numPoints = pontos.length;
    }

    for (var i = 0; i < numPoints; i++) {
        favorite = false;

        for (var j = 0; j < favoritos.length; j++) {

            if (pontos[i].idPonto == favoritos[j]) {
                favorite = true;
            }

        }
        if (favorite == true) {
            pag += "<div class='panel panel-body'><div class='col-sm-12' style='border-bottom: solid black; border-bottom-width: 1px;'><h4><span class='glyphicon glyphicon-map-marker'></span> " + pontos[i].title + " </h4></div><div class='col-sm-12 divInfo'><div class='col-sm-4 divIMGPoints'><img class='imgPoint' src='" + pontos[i].img[0] + "'></div><div class='col-sm-6'><p class='descPoint'><span class='glyphicon glyphicon-road'></span> " + pontos[i].location + "</p></div><div class='col-sm-2'><button class='btnPonto btnVerMais' value='" + pontos[i].idPonto + "'>Ver mais</button><br><br><button class='btnPonto btnRemoveFavorito' value='" + pontos[i].idPonto + "'><span class='glyphicon glyphicon-star yellow'></span> Remover Favorito</button></div></div></div>";

        }
        else {
            pag += "<div class='panel panel-body'><div class='col-sm-12' style='border-bottom: solid black; border-bottom-width: 1px;'><h4> <span class='glyphicon glyphicon-map-marker'></span> " + pontos[i].title + " </h4></div><div class='col-sm-12 divInfo'><div class='col-sm-4 divIMGPoints'><img class='imgPoint' src='" + pontos[i].img[0] + "'></div><div class='col-sm-6'><p class='descPoint'><span class='glyphicon glyphicon-road'></span> " + pontos[i].location + "</p></div><div class='col-sm-2'><button class='btnPonto btnVerMais' value='" + pontos[i].idPonto + "'>Ver mais</button><br><br><button class='btnPonto btnAddFavorito' value='" + pontos[i].idPonto + "'><span class='glyphicon glyphicon-star'></span> Adicionar Favorito</button></div></div></div>";

        }



    }
    if(next==true)
    {
        pag += "<div class='col-sm-12' style='text-align:center;'><button class='nextPage btnPonto'>Próxima-></button></div>";
    }
    
    $("#todosPontos").html(pag);

}

function nextPage() {
    var pag = "";
    totalPoints -= 10;
    var next = false;
    num += 10;

    if (totalPoints > 10) {
        next = true;
        for (var i = num; i < num + 10; i++) {
            favorite = false;

            for (var j = 0; j < favoritos.length; j++) {

                if (pontos[i].idPonto == favoritos[j]) {
                    favorite = true;
                }

            }
            if (favorite == true) {
                pag += "<div class='panel panel-body'><div class='col-sm-12' style='border-bottom: solid black; border-bottom-width: 1px;'><h4><span class='glyphicon glyphicon-map-marker'></span> " + pontos[i].title + " </h4></div><div class='col-sm-12 divInfo'><div class='col-sm-4 divIMGPoints'><img class='imgPoint' src='" + pontos[i].img[0] + "'></div><div class='col-sm-6'><p class='descPoint'><span class='glyphicon glyphicon-road'></span> " + pontos[i].location + "</p></div><div class='col-sm-2'><button class='btnPonto btnVerMais' value='" + pontos[i].idPonto + "'>Ver mais</button><br><br><button class='btnPonto btnRemoveFavorito' value='" + pontos[i].idPonto + "'><span class='glyphicon glyphicon-star yellow'></span> Remover Favorito</button></div></div></div>";

            }
            else {
                 pag += "<div class='panel panel-body'><div class='col-sm-12' style='border-bottom: solid black; border-bottom-width: 1px;'><h4> <span class='glyphicon glyphicon-map-marker'></span> " + pontos[i].title + " </h4></div><div class='col-sm-12 divInfo'><div class='col-sm-4 divIMGPoints'><img class='imgPoint' src='" + pontos[i].img[0] + "'></div><div class='col-sm-6'><p class='descPoint'><span class='glyphicon glyphicon-road'></span> " + pontos[i].location + "</p></div><div class='col-sm-2'><button class='btnPonto btnVerMais' value='" + pontos[i].idPonto + "'>Ver mais</button><br><br><button class='btnPonto btnAddFavorito' value='" + pontos[i].idPonto + "'><span class='glyphicon glyphicon-star'></span> Adicionar Favorito</button></div></div></div>";

            }
        }
        

    }
    else {
        for (var i = num; i < num + totalPoints; i++) {
            favorite = false;

            for (var j = 0; j < favoritos.length; j++) {

                if (pontos[i].idPonto == favoritos[j]) {
                    favorite = true;
                }

            }
            if (favorite == true) {
                 pag += "<div class='panel panel-body'><div class='col-sm-12' style='border-bottom: solid black; border-bottom-width: 1px;'><h4><span class='glyphicon glyphicon-map-marker'></span> " + pontos[i].title + " </h4></div><div class='col-sm-12 divInfo'><div class='col-sm-4 divIMGPoints'><img class='imgPoint' src='" + pontos[i].img[0] + "'></div><div class='col-sm-6'><p class='descPoint'><span class='glyphicon glyphicon-road'></span> " + pontos[i].location + "</p></div><div class='col-sm-2'><button class='btnPonto btnVerMais' value='" + pontos[i].idPonto + "'>Ver mais</button><br><br><button class='btnPonto btnRemoveFavorito' value='" + pontos[i].idPonto + "'><span class='glyphicon glyphicon-star yellow'></span> Remover Favorito</button></div></div></div>";

            }
            else {
                 pag += "<div class='panel panel-body'><div class='col-sm-12' style='border-bottom: solid black; border-bottom-width: 1px;'><h4> <span class='glyphicon glyphicon-map-marker'></span> " + pontos[i].title + " </h4></div><div class='col-sm-12 divInfo'><div class='col-sm-4 divIMGPoints'><img class='imgPoint' src='" + pontos[i].img[0] + "'></div><div class='col-sm-6'><p class='descPoint'><span class='glyphicon glyphicon-road'></span> " + pontos[i].location + "</p></div><div class='col-sm-2'><button class='btnPonto btnVerMais' value='" + pontos[i].idPonto + "'>Ver mais</button><br><br><button class='btnPonto btnAddFavorito' value='" + pontos[i].idPonto + "'><span class='glyphicon glyphicon-star'></span> Adicionar Favorito</button></div></div></div>";

            }
        }
    }

    if(next==true)
    {
        pag += "<div class='col-sm-12' style='text-align:center;'><button class='prevPage btnConta'><-Anterior</button><button class='nextPage btnConta'>Próxima-></button></div>"
    }
    else
    {
        pag += "<div class='col-sm-12' style='text-align:center;'><button class='prevPage btnConta'><-Anterior</button></div>"
    }
    $('html, body').animate({ scrollTop: 0 }, 'fast');
    $("#todosPontos").html(pag);


}

function previousPage() {
    var pag = "";
    totalPoints += 10;
    num -= 10;
    var previous = true;

    if(totalPoints == pontos.length)
    {
        previous = false;
    }
    
    if (totalPoints < 10) {
        
        for (var i = num; i < num + 10; i++) {
            favorite = false;

            for (var j = 0; j < favoritos.length; j++) {

                if (pontos[i].idPonto == favoritos[j]) {
                    favorite = true;
                }

            }
            if (favorite == true) {
                pag += "<div class='panel panel-body'><div class='col-sm-12' style='border-bottom: solid black; border-bottom-width: 1px;'><h4><span class='glyphicon glyphicon-map-marker'></span> " + pontos[i].title + " </h4></div><div class='col-sm-12 divInfo'><div class='col-sm-4 divIMGPoints'><img class='imgPoint' src='" + pontos[i].img[0] + "'></div><div class='col-sm-6'><p class='descPoint'><span class='glyphicon glyphicon-road'></span> " + pontos[i].location + "</p></div><div class='col-sm-2'><button class='btnPonto btnVerMais' value='" + pontos[i].idPonto + "'>Ver mais</button><br><br><button class='btnPonto btnRemoveFavorito' value='" + pontos[i].idPonto + "'><span class='glyphicon glyphicon-star yellow'></span> Remover Favorito</button></div></div></div>";

            }
            else {
                pag += "<div class='panel panel-body'><div class='col-sm-12' style='border-bottom: solid black; border-bottom-width: 1px;'><h4> <span class='glyphicon glyphicon-map-marker'></span> " + pontos[i].title + " </h4></div><div class='col-sm-12 divInfo'><div class='col-sm-4 divIMGPoints'><img class='imgPoint' src='" + pontos[i].img[0] + "'></div><div class='col-sm-6'><p class='descPoint'><span class='glyphicon glyphicon-road'></span> " + pontos[i].location + "</p></div><div class='col-sm-2'><button class='btnPonto btnVerMais' value='" + pontos[i].idPonto + "'>Ver mais</button><br><br><button class='btnPonto btnAddFavorito' value='" + pontos[i].idPonto + "'><span class='glyphicon glyphicon-star'></span> Adicionar Favorito</button></div></div></div>";

            }
        }

    }
    else {

        for (var i = num; i < num + 10; i++) {
            favorite = false;

            for (var j = 0; j < favoritos.length; j++) {

                if (pontos[i].idPonto == favoritos[j]) {
                    favorite = true;
                }

            }
            if (favorite == true) {
                 pag += "<div class='panel panel-body'><div class='col-sm-12' style='border-bottom: solid black; border-bottom-width: 1px;'><h4><span class='glyphicon glyphicon-map-marker'></span> " + pontos[i].title + " </h4></div><div class='col-sm-12 divInfo'><div class='col-sm-4 divIMGPoints'><img class='imgPoint' src='" + pontos[i].img[0] + "'></div><div class='col-sm-6'><p class='descPoint'><span class='glyphicon glyphicon-road'></span> " + pontos[i].location + "</p></div><div class='col-sm-2'><button class='btnPonto btnVerMais' value='" + pontos[i].idPonto + "'>Ver mais</button><br><br><button class='btnPonto btnRemoveFavorito' value='" + pontos[i].idPonto + "'><span class='glyphicon glyphicon-star yellow'></span> Remover Favorito</button></div></div></div>";

            }
            else {
                pag += "<div class='panel panel-body'><div class='col-sm-12' style='border-bottom: solid black; border-bottom-width: 1px;'><h4> <span class='glyphicon glyphicon-map-marker'></span> " + pontos[i].title + " </h4></div><div class='col-sm-12 divInfo'><div class='col-sm-4 divIMGPoints'><img class='imgPoint' src='" + pontos[i].img[0] + "'></div><div class='col-sm-6'><p class='descPoint'><span class='glyphicon glyphicon-road'></span> " + pontos[i].location + "</p></div><div class='col-sm-2'><button class='btnPonto btnVerMais' value='" + pontos[i].idPonto + "'>Ver mais</button><br><br><button class='btnPonto btnAddFavorito' value='" + pontos[i].idPonto + "'><span class='glyphicon glyphicon-star'></span> Adicionar Favorito</button></div></div></div>";

            }
        }
    }

    if(previous==true)
    {
        pag += "<div class='col-sm-12' style='text-align:center;'><button class='prevPage btnConta'><-Anterior</button><button class='nextPage btnConta'>Próxima-></button></div>"
    }
    else
    {
        pag += "<div class='col-sm-12' style='text-align:center;'><button class='nextPage btnConta'>Próxima-></button></div>"
    }
    $('html, body').animate({ scrollTop: 0 }, 'fast');
    $("#todosPontos").html(pag);


}

function showPointsAdded()
{
    var pag = "";
    var count = 0;


    for(var i = 0 ; i<pontos.length;i++)
    {
        if(pontos[i].madeby == firebase.auth().currentUser.uid)
        {
            count++;
            pag += "<div class='panel panel-body'><div class='col-sm-12' style='border-bottom: solid black; border-bottom-width: 1px;'><h4><span class='glyphicon glyphicon-map-marker'></span> " + pontos[i].title + " </h4></div><div class='col-sm-12 divInfo'><div class='col-sm-4 divIMGPoints'><img class='imgPoint' src='" + pontos[i].img[0] + "'></div><div class='col-sm-6'><p class='descPoint'><span class='glyphicon glyphicon-road'></span> " + pontos[i].location + "</p></div><div class='col-sm-2'><button class='btnPonto btnVerMais' value='" + pontos[i].idPonto + "'>Ver mais</button><br><br><button class='btnPonto btnRemovePoint' value='" + pontos[i].idPonto + "'><span class='glyphicon glyphicon-remove'></span> Eliminar</button></div></div></div>";
        }
    }
    if(count == 0)
    {
        pag = "<div class='panel panel-body'><div class='col-sm-12' style='text-align: center;'><h2>Você ainda não tem pontos criados, adicione-os em Adicionar Ponto Turístico.</h2></div></div>";
        
         window.setTimeout(
            function () {
        $("#pontosAdicionados").html(pag);}
            , 100);
    }
    else
    { 
         $("#pontosAdicionados").html(pag);
    }
   

}

function removePoint(id)
{
    for(var i = 0; i < pontos.length;i++)
    {
        if(pontos[i].idPonto == id)
        {
            pontos.splice(i,1);
        }
    }

    localStorage.setItem("pontos", JSON.stringify(pontos));

    firebase.database().ref().child('pontos').child(id).set(null);
    window.setTimeout(function(){
    location.reload();}
    ,1500);

    
}


function initMap(latitude, longitude) {
    var coordinates = { lat: latitude, lng: longitude };
    var map = new google.maps.Map(document.getElementById('map'), {
        center: coordinates, zoom: 17
    });
    var marker = new google.maps.Marker({
        position: coordinates,
        map: map
    });
}

var posGPS;
var markerAddPoint;
function initMapAddPonto() {

    var coordinates = { lat: 41.3531731, lng: -8.7493992 };

    var map = new google.maps.Map(document.getElementById('inputMap'), {
        center: coordinates, zoom: 15
    });



    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            posGPS = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            map.setCenter(posGPS);
            markerAddPoint = new google.maps.Marker({
                position: posGPS,
                draggable: true,
                map: map
            });
        }, function () {
            var infoWindow = new google.maps.InfoWindow({ map: map });
            handleLocationError(true, infoWindow, map.getCenter());
            markerAddPoint = new google.maps.Marker({
                position: coordinates,
                draggable: true,
                map: map
            });
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }



}

function handleLocationError(browserHasGeolocation, infoWindow, posGPS) {
    infoWindow.setPosition(posGPS);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
}


function initPagInicial() {
    getDataBase();
}

function initVerMais() {

    pontos = JSON.parse(localStorage.getItem("pontos"));
    if (localStorage.getItem("favoritos")) {

        favoritos = JSON.parse(localStorage.getItem("favoritos"));
        window.setTimeout(
            function () {
                
                createVC(localStorage.getItem("page"));
            }
            , 500);

    }
    else {
        window.setTimeout(function () {

            if (firebase.auth().currentUser) {
                var ref = firebase.database().ref();
                var userID = firebase.auth().currentUser.uid;
                ref.child('fav').child(userID).child('favorites').once('value', function (snapshot) {
                    
                    var fav = snapshot.val();
                    favoritos.length = 0;
                    if (fav != null) {

                        var allFav = fav.split("#");
                        for (var i = 0; i < allFav.length; i++) {
                            favoritos.push(allFav[i]);
                        }
                        localStorage.setItem("favoritos", JSON.stringify(favoritos));
                    }

                    createVC(localStorage.getItem("page"));
                });
            }
            else {
                createVC(localStorage.getItem("page"));
            }
        }, 500);

    }



}

function initFavoritos() {
    
    var pag = "";

    pontos = JSON.parse(localStorage.getItem("pontos"));
    if (!localStorage.getItem("favoritos")) {
        
        pag = "<div class='panel panel-body'><div class='col-sm-12' style='text-align: center;'><h2>Você ainda não tem favoritos, adicione-os na página principal.</h2></div></div>";
        
         window.setTimeout(
            function () {
        $("#pontosFavoritos").html(pag);}
            , 100);
    }
    else {
        favoritos = JSON.parse(localStorage.getItem("favoritos"));



        
        window.setTimeout(
            function () {
                for (var i = 0; i < pontos.length; i++) {
                    for (var k = 0; k < favoritos.length; k++) {
                        if (pontos[i].idPonto == favoritos[k]) {
                            pag += "<div class='panel panel-body'><div class='col-sm-12' style='border-bottom: solid black; border-bottom-width: 1px;'><h4><span class='glyphicon glyphicon-map-marker'></span> " + pontos[i].title + " </h4></div><div class='col-sm-12 divInfo'><div class='col-sm-4 divIMGPoints'><img class='imgPoint' src='" + pontos[i].img[0] + "'></div><div class='col-sm-6'><p class='descPoint'><span class='glyphicon glyphicon-road'></span> " + pontos[i].location + "</p></div><div class='col-sm-2'><button class='btnPonto btnVerMais' value='" + pontos[i].idPonto + "'>Ver mais</button><br><br><button class='btnPonto btnRemoveFavorito' value='" + pontos[i].idPonto + "'><span class='glyphicon glyphicon-star yellow'></span> Remover Favorito</button></div></div></div>";


                        }
                    }
                }

                $("#pontosFavoritos").html(pag)


            }
            , 1500);
    }

}

function initAddPonto() {
    pontos = JSON.parse(localStorage.getItem("pontos"));
    document.addEventListener("DOMContentLoaded", initFiles, false);
    window.setTimeout(initMapAddPonto, 500);

}

function initAdicionados(){
    pontos = JSON.parse(localStorage.getItem("pontos"));
    window.setTimeout(showPointsAdded,1500);
}