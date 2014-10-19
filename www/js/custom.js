
var socket;
var users = [];
var dataApi ={
    users : users
}
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
        if(users[i].userId == connectedPlayer) color = "style='background-color:#0f0'";
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
$(document ).ready(function() {
    console.log( "APP ready" );
    socket = io('http://192.168.1.10:9000', {path: '/socket.io'});
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



});