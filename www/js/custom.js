
var socket;
var users = [];
var dataApi ={
    users : users
};
var board = matrix( 6 , 5, 0);
var refreshControllers = [];
var debug ="nothing";
var userId = null;
var connectedPlayer = null;
function redrawUsersOnline(){
    $('#usersList').html("");
    for(var i=0;i<users.length;i++){
        if(users[i].userId==userId) continue;
        var color = "";
        console.log("BURRRRRRRRRR:"+users[i].userId + "==" + connectedPlayer);
        if(users[i].userId == connectedPlayer) color = "style='background-color:#FC5442'";
        var temp = "<li "+color+" class='userlistLi' data-userId="+users[i].userId+"  onclick='connectUser(this)'>"+users[i].userId+"</li>";
        $('#usersList').append(temp);
    }
}
function connectUser(elem){
    console.log("TRYING TO CONNECT TO:"+elem.getAttribute('data-userId'));
    socket.emit('user connect request', {userId1 : userId, userId2 :elem.getAttribute('data-userId') });
}
function disconnectUser() {
    socket.emit('user disconnect', {user1 : userId, user2:connectedPlayer});
}
function startGame() {
//    socket.emit('command', {user1 : userId, user2:connectedPlayer, cmd : "start"});
}
function startGameCmd() {
    socket.emit('command', {user1 : userId, user2:connectedPlayer, cmd : "start"});

}
function commandPlay(msg) {
//    location.href="#/tab/friends";
//    $ionicSlideBoxDelegate.next()
    redrawGameBoard();
}
function matrix( rows, cols, defaultValue){
    var arr = [];
    for(var i=0; i < rows; i++){
        arr.push([]);
        arr[i].push( new Array(cols));
        for(var j=0; j < cols; j++){
            arr[i][j] = defaultValue;
        }
    }
    return arr;
}
function redrawGameBoard(){
    $('#gameBoard').html("");
    var temp = "";
    for(var i=0;i<board.length;i++){
        temp += "<tr>";
        for(var j=0;j<board[i].length;j++){
            temp += "<td class='gameBox'>";
            temp += "<div class='dummy'></div>";
            temp += "<div class='content'>";
            if(board[i][j]==0)
                temp += "<div class='contentInside0 rotating'><div class='insidecircle'></div></div>";
            if(board[i][j]==1)
                temp += "<div class='contentInside1 rotating'><div class='insidecircle'></div></div>";
            if(board[i][j]==2)
                temp += "<div class='contentInside2 rotating'><div class='semicircle'></div><div class='split2circle'></div><div class='insidecircle'></div></div>";
            if(board[i][j]==3){
                temp += "<div class='contentInside3 rotating'><div class='semicircle1'></div><div class='semicircle2'></div><div class='semicircle3'></div>";
                temp += "<div class='split3circle1'></div><div class='split3circle2'></div><div class='split3circle3'></div><div class='insidecircle'></div></div>";
            }

            temp += "</div>";

//            <div class="content">1</div>
//            if(0 == board[i][j])
//                temp += board[i][j];
            temp += "</td>";
        }
        temp += "</tr>";
//        if(users[i].userId==userId) continue;
//        var color = "";
//        console.log("BURRRRRRRRRR:"+users[i].userId + "==" + connectedPlayer);
//        if(users[i].userId == connectedPlayer) color = "style='background-color:#0f0'";
//        var temp = "<li "+color+" class='userlistLi' data-userId="+users[i].userId+"  onclick='connectUser(this)'>"+users[i].userId+"</li>";
        $('#gameBoard').html(temp);
    }
}
$(document ).ready(function() {
    console.log( "APP ready" );
    socket = io('http://192.168.1.4:9000', {path: '/socket.io'});
    socket.emit('all users', 'hi');
    socket.on('new connection',function(msg){
        userId = msg.id;
        $('#myDetails').html("Your user ID = "+userId);
    });
    socket.on('all users', function(msg){
        console.log("ALL USERS RECEIVED:"+msg);
        dataApi.users.splice(0,dataApi.users.length);
        msg.forEach(function(userIdTemp) {
            users.push({userId: userIdTemp});
        });
        redrawUsersOnline();
        console.log("received users:"+JSON.stringify(users));

    });

    //USER TRYING TO CONNECT
    socket.on('user request', function(msg){
        var open = (connectedPlayer==null);
        if(open){
            connectedPlayer = msg.userId1;
            redrawUsersOnline();
        }else{

        }
        socket.emit('user request reply', { ok : open, userId1:msg.userId1, userId2:userId })

    });
    socket.on('user request reply', function(msg){
        if(msg.ok){
            connectedPlayer = msg.userId2;
            redrawUsersOnline();
        }
        console.log("CONNECTTION ACCEPTED:"+msg.ok);
    })

    //USER TRYING TO DISCONNECT
    socket.on('user disconnect', function(){
        connectedPlayer = null;
        redrawUsersOnline();
    });

    //COMMANDS
    socket.on('command', function(msg){
        console.log("CMD:"+JSON.stringify(msg));
        commandPlay(msg);
    });
});