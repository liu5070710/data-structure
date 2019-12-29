//board二维数组表示棋盘位置的二维数组 可以存放数字
var board = new Array();
var score = 0;
var hasConflicted = new Array();//每次移动 每个格子只能叠加一次

$(document).ready(function () {
   newgame();
});


function newgame() {
   //初始化棋盘格
   init();
   //在4*4的格子里随机生成两个数
   generateOneNumber();//随机生成一个数字
   generateOneNumber();
}
function init() {
   for (var i = 0; i < 4; i++)
      for (var j = 0; j < 4; j++) {
         var gridCell = $("#grid-cell-" + i + "-" + j);//拿到每个小方格
         gridCell.css('top', getPosTop(i, j));//由于每个小方格都是绝对定位,这个方法计算出top值
         gridCell.css('left', getPosleft(i, j));
      }
   //初始化board二维数组
   for (var i = 0; i < 4; i++) {
      board[i] = new Array();//把board编程二维数组
      hasConflicted[i] = new Array();
      for (var j = 0; j < 4; j++) {
         board[i][j] = 0;
         hasConflicted[i][j] = false;
      }
   }

   updateBoardView();
   score = 0;
}
function updateBoardView() {
   //根据board二维数组的值,改变前端页面numberCell的显示
   $('.number-cell').remove();
   for (var i = 0; i < 4; i++)
      for (var j = 0; j < 4; j++) {
         $('#grid-container').append('<div class="number-cell" id="number-cell-' + i + '-' + j + '"></div>');
         var theNumberCell = $('#number-cell-' + i + '-' + j);
         if (board[i][j] == 0) {
            //显示宽高
            theNumberCell.css('width', '0px');
            theNumberCell.css('height', '0px');
            //显示位置
            theNumberCell.css('top', getPosTop(i, j) +50 );
            theNumberCell.css('left', getPosleft(i, j) +50);
         } else {
            theNumberCell.css('width', '100px');
            theNumberCell.css('height', '100px');
            theNumberCell.css('top', getPosTop(i, j));
            theNumberCell.css('left', getPosleft(i, j));
            theNumberCell.css('background-color', getNumberBackgroundColor(board[i][j]));
            theNumberCell.css('color', getNumberColor(board[i][j]));
            theNumberCell.text(board[i][j]);
         }
         hasConflicted[i][j] = false;
      }
}
function generateOneNumber() {
   //nosapce函数 表示棋盘中已经没有 空间
   if (nospace(board)) return false;
   //1.随机一个位置
   var randx = parseInt(Math.floor(Math.random() * 4));//生成0 1 2 3中的随机数 
   var randy = parseInt(Math.floor(Math.random() * 4));
   //1.1判断随机位置是否可用
   var times = 0;
   while (times < 50) {
      if (board[randx][randy] == 0) break; //表示可用


      randx = parseInt(Math.floor(Math.random() * 4));
      randy = parseInt(Math.floor(Math.random() * 4));

      times ++;

   }
   if(times == 50){
      for (var i = 0; i < 4; i++)
      for (var j = 0; j < 4; j++) {
         if(board[i][j] == 0){
            randx = i;
            randy = j;
         }
      }
   }
   //2.随机一个数字
   var randNumber = Math.random() < 0.5 ? 2 : 4;//生成2和4的概率都是50%

   //3.在随机位显示随机数字
   board[randx][randy] = randNumber;
   //3.1通知前端显示数字
   showNumberWithAnimation(randx,randy,randNumber);

   return true;
}

//基于玩家响应的游戏循环
$(document).keydown(function(event){
   switch(event.keyCode){
      case 37: // left
         if(moveLeft() == true){
            setTimeout('generateOneNumber()',210);//每次左移随机生成一个数
            
            setTimeout('isGameOver()',300);//每次移动都有可能结束游戏
         }
         break; 
      case 38: // up
         if(moveUp() == true){
            setTimeout('generateOneNumber()',210);
            setTimeout('isGameOver()',300);
         }
         break; 
      case 39: // right
         if(moveRight() == true){
            setTimeout('generateOneNumber()',210);
            setTimeout('isGameOver()',300);
         }
         break; 
      case 40: // down
         if(moveDown() == true){
            setTimeout('generateOneNumber()',210);
            setTimeout('isGameOver()',300);
         }
         break; 

      default: break;
   }
});

function isGameOver(){
   if(nospace(board) && nomove(board)){
      GameOver()
   }
}

function GameOver(){
   alert('游戏结束')
}

function moveLeft(){
   //首先判断是否可以左移
   if(!canMoveLeft(board)) return false;
   //可以左移的话 对每个数字的左侧位置进行判断,看是否可能为落脚点(落脚点为空或者落脚数字和待判定数字相等并且路径中表是否有障碍)?
   for (var i = 0; i < 4; i++){
      for (var j = 1; j < 4; j++){
         if(board[i][j] != 0){
            for(var k = 0; k<j; k++){
               if(board[i][k] == 0  /*判断没有数字*/  && noBlockHorizontal(i,k,j,board)){//判断是否没有障碍物
                  //move
                  showMoveAnimation(i,j,i,k);
                  board[i][k] = board[i][j];
                  board[i][j] = 0;
                  continue;
               }else if(board[i][k] == board[i][j] && noBlockHorizontal(i,k,j,board) && !hasConflicted[i][k]){
                  //move
                  showMoveAnimation(i,j,i,k);
                  //add
                  board[i][k] += board[i][j];
                  board[i][j] = 0;
                  //add score
                  score += board[i][k];
                  updateScore(score);
                  hasConflicted[i][k] = true;
                  continue;
               }
            }
         }
      }
   }
   setTimeout('updateBoardView()',200);
   return true;
}

function moveRight(){
   if(!canMoveRight(board)) return false;
   //可以左移的话 对每个数字的左侧位置进行判断,看是否可能为落脚点(落脚点为空或者落脚数字和待判定数字相等并且路径中表是否有障碍)?
   for (var i = 0; i < 4; i++){
      for (var j = 2; j >= 0; j--){
         if(board[i][j] != 0){
            for(var k = 3; k>j; k--){
               if(board[i][k] == 0 && noBlockHorizontal(i,j,k,board)){//判断是否没有障碍物
                  //move
                  showMoveAnimation(i,j,i,k);
                  board[i][k] = board[i][j];
                  board[i][j] = 0;
                  continue;
               }else if(board[i][k] == board[i][j] && noBlockHorizontal(i,k,j,board) && !hasConflicted[i][k]){
                  //move
                  showMoveAnimation(i,j,i,k);
                  //add
                  board[i][k] *= 2;
                  board[i][j] = 0;
                  score += board[i][k];
                  updateScore(score);
                  hasConflicted[i][k] = true; //todo
                  continue;
               }
            }
         }
      }
   }
   setTimeout('updateBoardView()',200);
   return true;
}

function moveUp(){
   if(!canMoveUp(board)) return false;
   
   for (var j = 0; j < 4; j++){
      for (var i = 1; i < 4; i++){
         if(board[i][j] != 0){
            for(var k = 0; k < i; k++){
               if(board[k][j] == 0 && noBlockHorizontal(j,k,i,board)){
                  //move
                  showMoveAnimation(i,j,k,j);
                  board[k][j] = board[i][j];
                  board[i][j] = 0;
                  continue;
               }else if(board[k][j] == board[i][j] && noBlockHorizontal(j,k,i,board) && !hasConflicted[k][j]){
                  //move
                  showMoveAnimation(i,j,k,j);
                  //add
                  board[k][j] *= 2;
                  board[i][j] = 0;
                  score += board[k][j];
                  updateScore(score);
                  hasConflicted[k][j] = true;
                  continue;
               }
            }
         }
      }
   }
   setTimeout('updateBoardView()',200);
   return true;
}
function moveDown(){
   if(!canMoveDown(board)) return false;
   
   for (var j = 0; j < 4; j++){
      for (var i = 2; i >= 0; i--){
         if(board[i][j] != 0){
            for(var k = 3; k > i; k--){
               if(board[k][j] == 0 && noBlockHorizontal(j,i,k,board)){
                  //move
                  showMoveAnimation(i,j,k,j);
                  board[k][j] = board[i][j];
                  board[i][j] = 0;
                  continue;
               }else if(board[k][j] == board[i][j] && noBlockHorizontal(j,i,k,board) && !hasConflicted[k][j]){
                  //move
                  showMoveAnimation(i,j,k,j);
                  //add
                  board[k][j] *= 2;
                  board[i][j] = 0;
                  score += board[k][j];
                  updateScore(score);
                  hasConflicted[k][j] = true;
                  continue;
               }
            }
         }
      }
   }
   setTimeout('updateBoardView()',200);
   return true;
}