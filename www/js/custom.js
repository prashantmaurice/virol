
var socket;
var users = [];
var dataApi ={
    users : users
};
var prevMove = null;
var explode_speed = 500;
var boardSIze = { x : 5, y : 6};
var board = matrix( boardSIze.y , boardSIze.x, { player:0,value:0});
for(var i=0;i<board.length;i++){
    for(var j=0;j<board[i].length;j++){
        board[i][j] = { player:0,value:0};
    }
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
        if(users[i].userId == connectedPlayer) color = "style='background-color:#FC5442'";
        var temp = "<li "+color+" class='userlistLi' data-userId="+users[i].userId+"  onclick='connectUser(this)'>"+users[i].userId+"</li>";
        $('#usersList').append(temp);
    }
}
function connectUser(elem){
    console.log("TRYING TO CONNECT TO:"+elem.getAttribute('data-userId'));
    socket.emit('connectUser', {userId1 : userId, userId2 :elem.getAttribute('data-userId') });
}
function disconnectUser() {
    socket.emit('user disconnect', {userId1 : userId});
}

//GAME LOGICS
function startGame() {
//    socket.emit('command', {user1 : userId, user2:connectedPlayer, cmd : "start"});
}
function startGameCmd() {
    socket.emit('command', {user1 : userId, user2:connectedPlayer, cmd : "start"});
}
function clickRing(elem){
    console.log("MOVE:"+elem.getAttribute('data-x')+"=="+elem.getAttribute('data-y'));
    socket.emit('command', {user1 : userId, user2 :connectedPlayer, cmd : "move",moveX : parseInt(elem.getAttribute('data-x')), moveY:parseInt(elem.getAttribute('data-y')), player:userId});
}
function commandPlay(msg) {
//    location.href="#/tab/friends";
//    $ionicSlideBoxDelegate.next()
    redrawGameBoard();
}
function commandMove(msg) {
    if(prevMove==msg.player) return;//TODO:activate this on production
    if(board[msg.moveY][msg.moveX].player==((msg.player==connectedPlayer)?userId:connectedPlayer))return;
    prevMove=msg.player;
    incrementRing(msg.moveX,msg.moveY,msg.player);


}
function incrementRing(x,y, player){
    if((x<0)|(y<0)|(x>=boardSIze.x)|(y>=boardSIze.y)){console.log("LIMITS"+(x<0)+"="+(y<0)+"="+(x>=boardSIze.x)+"="+(y>=boardSIze.y)+"="+x+"="+boardSIze.x);return;}
    var currNum = board[y][x].value;
    var currPlayer = board[y][x].player;
    if(currNum<3) {
        board[y][x].value++;
        board[y][x].player=player;
        redrawGameBoard2();
        return 0;
    }
    else{
        board[y][x].value=0;
        board[y][x].player=player;
        explode(y,x);
        setTimeout(function()
            {
                burst(x,y, player);
                redrawGameBoard2();
            }, explode_speed);
        return explode_speed;
    }
}
function burst(x,y, player){
//    explode(x,y);
//    incrementRing(x-1,y, player,incrementRing(x+1,y, player,incrementRing(x,y-1, player,incrementRing(x,y+1, player))));
//    incrementRing(x+1,y, player);
//    incrementRing(x,y-1, player);
//    incrementRing(x,y+1, player);
    var t1 = incrementRing(x-1,y, player);
    setTimeout(function(){
        var t2 = incrementRing(x+1,y, player);
        setTimeout(function(){
            var t3 = incrementRing(x,y-1, player);
            setTimeout(function(){
                var t4 = incrementRing(x,y+1, player);
                setTimeout(function(){
                    console.log("DONE DISCO");
                },t4);
            },t3);
        },t2);
    },t1);
//
//    incrementRing(x,y-1, player);
//    incrementRing(x,y+1, player);
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
function redrawGameBoard2(){
    console.log("GAMEBOARD UPDATED");
    for(var i=0;i<board.length;i++){
        for(var j=0;j<board[i].length;j++){
            var temp2 = ((board[i][j].player==userId)?'op':'');
            var temp3 = ((board[i][j].value==2)?'rotating':'rotating2');
            var obj = ".box-"+i+"-"+j;
            $(obj+">.val0").hide();
            $(obj+">.val1").hide();
            $(obj+">.val2").hide();
            $(obj+">.val3").hide();

            if((board[i][j].player==userId))
                $(obj).addClass('op')
            else
                $(obj).removeClass('op')
            if(board[i][j].value==0)
                $(obj+">.val0").show();
            if(board[i][j].value==1)
                $(obj+">.val1").show();
            if(board[i][j].value==2)
                $(obj+">.val2").show();
            if(board[i][j].value==3){
                $(obj+">.val3").show();
            }
        }

    }
}
function redrawGameBoard(){
    console.log("GAMEBOARD CREATED");
    $('#gameBoard').html("");
    var temp = "";
    for(var i=0;i<board.length;i++){
        temp += "<tr>";
        for(var j=0;j<board[i].length;j++){
            var temp2 = ((board[i][j].player==userId)?'op':'');
            var temp3 = ((board[i][j].value==2)?'rotating':'rotating2');
            temp += "<td class='gameBox'>";
            temp += "<div class='dummy'></div>";
            temp += "<div class='content box-"+i+"-"+j+"' data-x="+j+" data-y="+i+" onclick='clickRing(this)'>";
//            if(board[i][j].value==0)
                //$(".box-1-1>.val0").css({display:none})
                temp += "<div class='contentInside rotating val0'><div class='insidecircle'></div></div>";
//            if(board[i][j].value==1)
                temp += "<div class='contentInside "+temp2+" type1 val1 "+temp3+"'><div class='insidecircle'></div></div>";
//            if(board[i][j].value==2)
                temp += "<div class='contentInside "+temp2+" type2 val2 "+temp3+"'><div class='semicircle "+temp2+"'></div>" +
                    "<div class='split2circle'></div><div class='insidecircle'></div></div>";
//            if(board[i][j].value==3){
                temp += "<div class='blast blast-"+i+"-"+j+"-left'><div class='blastLeft'></div></div>";
                temp += "<div class='blast blast-"+i+"-"+j+"-right'><div class='blastLeft'></div></div>";
                temp += "<div class='blast blast-"+i+"-"+j+"-top'><div class='blastLeft'></div></div>";
                temp += "<div class='blast blast-"+i+"-"+j+"-bottom'><div class='blastLeft'></div></div>";
                temp += "<div class='contentInside val3 "+temp2+" type3 "+temp3+"'>" +
                    "<div class='semicircle1 "+temp2+"'></div><div class='semicircle2 "+temp2+"'></div><div class='semicircle3 "+temp2+"'></div>";
                temp += "<div class='split3circle t1'></div><div class='split3circle t2'></div><div class='split3circle t3'></div><div class='insidecircle'></div></div>";
            //}

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
    redrawGameBoard2();

}
function explode(i,j){
    console.log("EXPLODE CALLED:"+i+j);
    $('.blast-'+i+'-'+j+'-left').animate({left:"-100%"},explode_speed,function(){$(this).css({left:"0%"},function(){console.log('DONE ANIMATION')})});
    $('.blast-'+i+'-'+j+'-right').animate({left:"100%"},explode_speed,function(){$(this).css({left:"0%"})});
    $('.blast-'+i+'-'+j+'-top').animate({top:"100%"},explode_speed,function(){$(this).css({top:"0%"})});
    $('.blast-'+i+'-'+j+'-bottom').animate({top:"-100%"},explode_speed,function(){$(this).css({top:"0%"})});
//    wait(2000);
}
$(document ).ready(function() {
    console.log( "APP ready" );
    setupSockets();
});
function setupSockets(){
    socket = io('http://192.168.1.43:9000', {path: '/socket.io'});
    socket.emit('all users', 'hi');
    socket.on('new connection',function(msg){
        userId = msg.id;
        $('#myDetails').html("Your user ID = "+userId);
    });
    socket.on('all users', function(msg){
        console.log("ALL USERS RECEIVED:"+msg);
        dataApi.users.splice(0,dataApi.users.length);//remove all
        msg.forEach(function(userIdTemp) {
            users.push({userId: userIdTemp});
        });
        redrawUsersOnline();
        console.log("received all users:"+JSON.stringify(users));
    });

    //USER TRYING TO CONNECT
    socket.on('user connect request', function(msg){
        var open = (connectedPlayer==null);
        if(open){
            connectedPlayer = msg.userId1;
            redrawUsersOnline();
        }else{
            console.log("user denied incoming conn request");
        }
        socket.emit('user request reply', { ok : open, userId1:msg.userId1, userId2:userId })

    });
    socket.on('user request reply', function(msg){
        if(msg.ok){
            connectedPlayer = msg.userId2;
            redrawUsersOnline();
        }
        console.log("CONNECTION ACCEPTED:"+msg.ok);
    })

    //USER TRYING TO DISCONNECT
    socket.on('user disconnect', function(){
        connectedPlayer = null;
        redrawUsersOnline();
    });

    //COMMANDS
    socket.on('command', function(msg){
        console.log("CMD:"+JSON.stringify(msg));
        if(msg.cmd=="start")
            commandPlay(msg);
        if(msg.cmd=="move")
            commandMove(msg);
    });
}