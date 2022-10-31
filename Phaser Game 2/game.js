var game = new Phaser.Game(800, 680, Phaser.AUTO, 'TutContainer', { preload: preload, create: create});

//horizontal tile shaped level
var levelData=
[[-1,-1,-1,0,0,0,0,0,0,0,-1,-1,-1],
[-1,-1,0,0,0,0,0,0,0,0,-1,-1,-1],
[-1,-1,0,0,0,0,0,0,0,0,0,-1,-1],
[-1,0,0,0,0,0,0,0,0,0,0,-1,-1],
[-1,0,0,0,0,0,0,0,0,0,0,0,-1],
[0,0,0,0,0,0,0,0,0,0,0,0,-1],
[0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,-1],
[-1,0,0,0,0,0,0,0,0,0,0,0,-1],
[-1,0,0,0,0,0,0,0,0,0,0,-1,-1],
[-1,-1,0,0,0,0,0,0,0,0,0,-1,-1],
[-1,-1,0,0,0,0,0,0,0,0,-1,-1,-1],
[-1,-1,-1,0,0,0,0,0,0,0,-1,-1,-1]];

var bmpText;
var hexTileHeight=52;
var hexTileWidth=61;
var hexGrid;
var infoTxt;
var numMines=20;
var blankTiles=0;
var revealedTiles=0;


function preload() {
    game.load.crossOrigin='Anonymous';
    game.load.bitmapFont('font', 'https://dl.dropboxusercontent.com/s/z4riz6hymsiimam/font.png?dl=0', 'https://dl.dropboxusercontent.com/s/7caqsovjw5xelp0/font.xml?dl=0');
    game.load.image('hex', 'https://dl.dropboxusercontent.com/s/rhwagtrs8o2v0cz/hexsmall.png?dl=0');
}

function create() {
    bmpText = game.add.bitmapText(10, 10, 'font', 'Vertical HexMine', 18);
    game.stage.backgroundColor = '#cccccc';
    levelData=transpose(levelData);
    createLevel();
    infoTxt=game.add.text(10,30,'hi');
    game.input.onTap.add(onTap);
    game.input.onHold.add(onHold);
    game.input.holdRate=500;
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
}

function createLevel(){
    hexGrid=game.add.group();
   
    var verticalOffset=hexTileHeight;
    var horizontalOffset=hexTileWidth*3/4;
    var startX;
    var startY;
    var startXInit=hexTileWidth/2;
    var startYInit=hexTileHeight/2;
    
    addMines();
    
    var hexTile;
    for (var i = 0; i < levelData.length; i++)
    {
        startX=startXInit;
        startY=2*startYInit+(i*verticalOffset);
        for (var j = 0; j < levelData[0].length; j++)
        {
            if(j%2!=0){
                startY=startY+startYInit;
            }else{
                startY=startY-startYInit;
            }
            if(levelData[i][j]!=-1){
                hexTile= new HexTile(game, startX, startY, 'hex', true,i,j,levelData[i][j]);
                hexGrid.add(hexTile);
                if(levelData[i][j]!=10){
                    blankTiles++;
                }
            }
            startX+=horizontalOffset;
        }
        
    }

    hexGrid.x=50;
    hexGrid.y=0;
}
function addMines(){
    var tileType=0;
    var tempArray=[];
    var newPt=new Phaser.Point();
    for (var i = 0; i < levelData.length; i++)
    {
        for (var j = 0; j < levelData[0].length; j++)
        {
            tileType=levelData[i][j];
            if(tileType==0){
                newPt=new Phaser.Point();
                newPt.x=i;
                newPt.y=j;
                tempArray.push(newPt);
            }
        }
    }
    for (var i = 0; i < numMines; i++)
    {
        newPt=Phaser.ArrayUtils.removeRandomItem(tempArray);
        levelData[newPt.x][newPt.y]=10;//10 is mine
        updateNeighbors(newPt.x,newPt.y);
    }
}
function updateNeighbors(i,j){
    var tileType=0;
    var tempArray=getNeighbors(i,j);
    var tmpPt;
    for (var k = 0; k < tempArray.length; k++)
    {
        tmpPt=tempArray[k];
        tileType=levelData[tmpPt.x][tmpPt.y];
        levelData[tmpPt.x][tmpPt.y]=tileType+1;
    }
}
function getNeighbors(i,j){
    var tempArray=[];
    var newi=i-1;
    var newj=j;
    populateNeighbor(newi,newj,tempArray);
    newi=i+1;
    newj=j;
    populateNeighbor(newi,newj,tempArray);
    newi=i;
    newj=j-1;
    populateNeighbor(newi,newj,tempArray);
    newi=i;
    newj=j+1;
    populateNeighbor(newi,newj,tempArray);
    if(j%2==0){
        newi=i-1;
        newj=j-1;
        populateNeighbor(newi,newj,tempArray);
        newj=j+1;
        populateNeighbor(newi,newj,tempArray);
    }else{
        newi=i+1;
        newj=j-1;
        populateNeighbor(newi,newj,tempArray);
        newj=j+1;
        populateNeighbor(newi,newj,tempArray);
    }
    
    return tempArray;
}
function checkForOccuppancy(i,j){
    var tileType=levelData[i][j];
    if(tileType==-1 || tileType==10){
        return true;
    }
    return false;
}
function checkforBoundary(i,j){
    if(i<0 || j<0 || i >levelData.length-1 || j>levelData[0].length-1){
        return true;
    }
    return false;
}
function populateNeighbor(i,j, tempArray){
    var newPt=new Phaser.Point();
    if(!checkforBoundary(i,j)){
        if(!checkForOccuppancy(i,j)){
            newPt=new Phaser.Point();
            newPt.x=i;
            newPt.y=j;
            tempArray.push(newPt);
        }
    }
}
function onHold(){
    var tile= findHexTile();
    if (game.input.activePointer.duration > 400) {
        var hexTile=hexGrid.getByName("tile"+tile.x+"_"+tile.y);
        hexTile.toggleMark();
        return;
    }
}
function onTap(){
    var tile= findHexTile();
    /*if (game.input.activePointer.duration > 400) {
        var hexTile=hexGrid.getByName("tile"+tile.x+"_"+tile.y);
        hexTile.toggleMark();
        return;
    }*/
    if(!checkforBoundary(tile.x,tile.y)){
        if(checkForOccuppancy(tile.x,tile.y)){
            if(levelData[tile.x][tile.y]==10){
                console.log('boom');
                var hexTile=hexGrid.getByName("tile"+tile.x+"_"+tile.y);
                if(!hexTile.revealed){
                    hexTile.reveal();

                }
            }
        }else{
            var hexTile=hexGrid.getByName("tile"+tile.x+"_"+tile.y);
                    
            if(!hexTile.revealed){
                if(levelData[tile.x][tile.y]==0){
                    console.log('recursive reveal');
                    recursiveReveal(tile.x,tile.y);
                }else{
                    //console.log('reveal');
                    hexTile.reveal();
                    revealedTiles++;
                }
                
            }
        }
    }
    infoTxt.text='found '+revealedTiles +' of '+blankTiles;
}
function findHexTile(){
    var pos=game.input.activePointer.position;
    pos.x-=hexGrid.x;
    pos.y-=hexGrid.y;
    var xVal = Math.floor((pos.x)/(hexTileWidth*3/4));
    var yVal = Math.floor((pos.y)/(hexTileHeight));
    var dX = (pos.x)%(hexTileWidth*3/4);
    var dY = (pos.y)%(hexTileHeight); 
    var slope = (hexTileHeight/2)/(hexTileWidth/4);
    var caldX=dY/slope;
    var delta=hexTileWidth/4-caldX;
    if(xVal%2==0){
        if(dX>Math.abs(delta)){
            
        }else{//odd right
            if(delta>0){
                xVal--;
                yVal--;
            }else{
                xVal--;
            }
        }
    }else{
        if(delta>0){
            if(dX<caldX){
                xVal--;
            }else{
               yVal--; 
            }
        }else{
           if(dX<((hexTileWidth/2)-caldX)){
                xVal--;
           }
        }
        
    }
   
   //infoTxt.text='i'+yVal +'j'+xVal;
   pos.x=yVal;
   pos.y=xVal;
   return pos;
}
function recursiveReveal(i,j){
    var newPt=new Phaser.Point(i,j);
    var hexTile;
    var tempArray=[newPt];
    var neighbors;
    while (tempArray.length){
        newPt=tempArray[0];
        var neighbors=getNeighbors(newPt.x,newPt.y);
        
        while(neighbors.length){
            newPt=neighbors.shift();
            hexTile=hexGrid.getByName("tile"+newPt.x+"_"+newPt.y);
            if(!hexTile.revealed){
                hexTile.reveal();
                revealedTiles++;
                if(levelData[newPt.x][newPt.y]==0){
                    tempArray.push(newPt);
                }
            }
        }
        newPt=tempArray.shift();
        hexTile=hexGrid.getByName("tile"+newPt.x+"_"+newPt.y);
        if(!hexTile.revealed){
            hexTile.reveal();
            revealedTiles++;
        }
    }
}
function transpose(a) {
    return Object.keys(a[0]).map(
        function (c) { return a.map(function (r) { return r[c]; }); }
        );
}