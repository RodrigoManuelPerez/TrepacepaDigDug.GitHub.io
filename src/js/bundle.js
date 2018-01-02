(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var Movable = require('./Class_Movable.js');

var Enemy = function(spritesheet, game, position, id, limiteDerecho, limiteSuperior, player){
    Movable.apply(this, [game, position, id, limiteDerecho, limiteSuperior, spritesheet]);
    
    this._animWalk =this.animations.add('Walking', [0,1], 6, true);
    this._animFant =this.animations.add('Digging', [2,3], 6, true);
    //console.debug(player._id);

    this._animWalk.play(6,true);

    this._distanceXtoPlayer;
    this._distanceYtoPlayer;
    this._Movingright=true;

    this._giros=0;

    this._posOriginalX = position._x;
    this._posOriginalY = position._y;

    this._Fantasma=false;
    this._SemiVelocidad=0;
    this._posicionInicial=0;

    this._player=player;

    this._limiteDerecho=limiteDerecho;
    this._limiteSuperior=limiteSuperior;

    this._bufferBounce=1;

    this._MovementEnable=true;
    //this._animWalk =this.animations.add('Walking');
    //this._animWalk.play(6,true);
    //console.debug(spriteSheet);
    }

    Enemy.prototype = Object.create(Movable.prototype);
    Enemy.prototype.constructor = Enemy;

    Enemy.prototype.update = function() 
    {

        if(this._MovementEnable){

            if(this._giros>25 && !this._Fantasma){
                this._giros=0;
                this._animWalk.stop();
                this._animFant.play(4,true);
                this._Fantasma=true;
                this.angle=0;
                if(this.width<0)
                    this.width=-this.width;
                this.ChangeDirPhantom();
            }

            if((this._Fantasma && this._SemiVelocidad==0) || !this._Fantasma){
                if(this._Movingleft && this.x>15){
                    this.x--;
                    this._distanceX--;
                    if(!this._Fantasma){
                        if(this.width>0)
                            this.width=-this.width;
                        if(this.angle!=0)
                            this.angle=0;
                    }
                }
                else if(this._Movingright && this.x<this._limiteDerecho-15){
                    this.x++;
                    this._distanceX++;
                    if(!this._Fantasma){
                        if(this.width<0)
                            this.width=-this.width;
                        if(this.angle!=0)
                            this.angle=0;
                    }
                }
                if(this._Movingup && this.y>this._limiteSuperior+10){
                    this.y--;
                    this._distanceY--;
                    if(!this._Fantasma){
                        if(this.angle!=-90)
                            this.angle=-90;
                        if(this.width<0)
                            this.width=-this.width;
                    }
                }
                else if(this._Movingdown && this.y<585){
                    this.y++;
                    this._distanceY++;
                    if(!this._Fantasma){
                        if(this.angle!=90)
                            this.angle=90;
                        if(this.width<0)
                            this.width=-this.width;
                    }
                }
                if(this._Fantasma)
                    this._SemiVelocidad++;
            }
            else{
                if(this._SemiVelocidad>=1){
                    this._SemiVelocidad=0;
                }
                else
                    this._SemiVelocidad++;
            }


            if (this._distanceX > 42 || this._distanceX < -42){
                if(this._Fantasma){
                    if(this._posicionInicial<2)
                        this._posicionInicial++;
                    this.ChangeDirPhantom();
                    this._distanceX = 0;
                }
                else{
                    this._distanceX = 0;
                    if(this._bufferBounce==0){
                        this.ChangeDirVer();
                        this._giros++;
                    }
                    else{
                        this._bufferBounce--;
                    }
                }
            }
            if (this._distanceY > 42 || this._distanceY < -42){
                if(this._Fantasma){
                    if(this._posicionInicial<2)
                        this._posicionInicial++;
                    this.ChangeDirPhantom();
                    this._distanceY = 0;
                }
                else{
                    this._distanceY = 0;
                    if(this._bufferBounce==0){
                        this.ChangeDirHor();
                        this._giros++;
                    }
                    else{
                        this._bufferBounce--;
                    }
                }
            }
            // if(!this._Movingdown && !this._Movingup && !this._Movingleft && !this._Movingright){
            //     this._animWalk.paused=false;
            //     }

            
        }
    }


    Enemy.prototype.ChangeDirHor = function() {
        
        this.y-=this._distanceY;
        this._distanceY=0;
        this._bufferBounce=1;
        
        if(this._player.x > this.x){
            this._Movingright=true;
            this._Movingleft=false;
            this._Movingup=false;
            this._Movingdown=false;
        }
        else if (this._player.x < this.x){
            this._Movingright=false;
            this._Movingleft=true;
            this._Movingup=false;
            this._Movingdown=false;
        }
    }

    Enemy.prototype.ChangeDirVer = function() {

        this.x-=this._distanceX;
        this._distanceX=0;
        this._bufferBounce=1;

        if(this._player.y > this.y){
            this._Movingright=false;
            this._Movingleft=false;
            this._Movingup=false;
            this._Movingdown=true;
        }
        else if(this._player.y < this.y){
            this._Movingright=false;
            this._Movingleft=false;
            this._Movingup=true;
            this._Movingdown=false;
        }

    }

    Enemy.prototype.ChangeDirTierra = function() {

        this._giros++;

        if (this._Movingleft){
            this._Movingleft=false;
            this._Movingright=true;
        }
        else if(this._Movingright){
            this._Movingleft=true;
            this._Movingright=false;
        }
        else if(this._Movingup){
            this._Movingdown=true;
            this._Movingup=false;
        }
        else if(this._Movingdown){
            this._Movingup=true;
            this._Movingdown=false;
        }
    }

    Enemy.prototype.resetPos = function() {
        this.x=this._posOriginal.x;
        this.y=this._posOriginal.y;
    }

    Enemy.prototype.ChangeDirPhantom = function() {
        if(this._player.x > this.x){
            this._Movingright=true;
            this._Movingleft=false;
        }
        else if (this._player.x < this.x){
            this._Movingright=false;
            this._Movingleft=true;
        }
        if(this._player.y > this.y){
            this._Movingup=false;
            this._Movingdown=true;
        }
        else if(this._player.y < this.y){
            this._Movingup=true;
            this._Movingdown=false;
        }
    }

    Enemy.prototype.BackToNormal = function(Px,Py) {
        this._giros=0;
        this._posicionInicial=0;
        this._Fantasma=false;
        this._distanceX=0;
        this._distanceY=0;
        this.x=Px;
        this.y=Py;
        this._animFant.stop();
        this._animWalk.play(6,true);
    }

module.exports = Enemy;
},{"./Class_Movable.js":6}],2:[function(require,module,exports){
'use strict';

var Flower = function(game, posx, posy, spriteSheet){
    
    Phaser.Sprite.apply(this,[game ,posx, posy, spriteSheet, 0]);

    this._Anim =this.animations.add('Move', [0,1], 2, true);
    this._Anim.play(2,true);

}
Flower.prototype = Object.create(Phaser.Sprite.prototype);
Flower.prototype.constructor = Flower;

module.exports = Flower;
},{}],3:[function(require,module,exports){
'use strict';

var Enemy = require('./Class_Enemy.js');

var Fygar = function(game, position, sprite, id, limiteDerecho, limiteSuperior, spriteSheet){
    Enemy.apply(this, [game, position, sprite, id, limiteDerecho, limiteSuperior, spriteSheet]);

    //PARA MONTAR LAS ANIMACIONES DEL DRAGON
    this._animWalk =this.animations.add('Walking');
    this._animWalk.play(6,true);
    }

    Fygar.prototype = Object.create(Enemy.prototype);
    Fygar.prototype.constructor = Fygar;

    Fygar.prototype.PlayerRock = function() {
        this._Enable=false;
    }

module.exports = Fygar;
},{"./Class_Enemy.js":1}],4:[function(require,module,exports){
'use strict';

var GameObject = function(game, position, sprite,id,spriteSheet){
    
    if(id=='Player' || id=='Roca')
        Phaser.Sprite.apply(this,[game ,position._x, position._y, spriteSheet, 0]);
    else
        Phaser.Sprite.apply(this,[game ,position._x, position._y, sprite]);

    this._id=id;
    this._posX=position._x;
    this._posY=position._y;

}
GameObject.prototype = Object.create(Phaser.Sprite.prototype);
GameObject.prototype.constructor = GameObject;

GameObject.prototype.Destroy = function()
{
    this.destroy();
}

module.exports = GameObject;
},{}],5:[function(require,module,exports){
'use strict';

var GameObject = require('./Class_GameObject.js');

var Hook = function(game, position, sprite,id, player){
    
    GameObject.apply(this, [game ,position, sprite, id]);
    
        //this.animations.add('Shaking', [0, 1], 5, true);
        //this.animations.add('Breaking', [2, 3, 4, 5], 1, false);
        //this._animShake.play(5,true);

        this._Thrown = false;       //Denota el estado de si está lanzado o recogido por DigDug
        this._Hooked = false;       //Denota cuando el gancho ha codigo a un enemigo
        this._Distance=0;           //Distancia recorrida por el gancho
        this._MaxDistance=43*1.5;     //Distancia máxima que puede recorrer
        
        this._posOriginal=position;
        /*this._HasFallen = false;
        this._FallEnable = false;
        this._timer = this.game.time.create(false);*/
        }
    
        Hook.prototype = Object.create(GameObject.prototype);
        Hook.prototype.constructor = Hook;
    
        Hook.prototype.update=function(){

            if(this._Hooked)        //Coloco primero el estado de enganchado porque es el que tiene prioridad
            {

            }
            else if(this._Thrown)    //Cuando el gancho está volando
            {
                this.width+=2;
                this.x--;
            }
            else                //Cuando el gancho está quiero en dig dug
            {
                if(this.x!=this._posOriginal.x)
                    this.x=this._posOriginal.x;
                if(this.y!=this._posOriginal.y)
                    this.y=this._posOriginal.y;
                //En verdad se queda en la posicion sin mas, posicion hija del player en el 0 0 aprox
            }
            if(this.x>this._MaxDistance){
                this._Thrown=false;
            }

        }
    
        Hook.prototype.Para=function() {
            
          
            
        }
    
        Hook.prototype.EnableFall=function() {

        }
    
        function Fall() {
        
        }
        function BreakRock(){

        }

module.exports = Hook;
},{"./Class_GameObject.js":4}],6:[function(require,module,exports){
'use strict';

var GameObject = require('./Class_GameObject.js');

var Movable = function(game, position, id, limiteDerecho, limiteSuperior, spritesheet){
    
    GameObject.apply(this, [game ,position, spritesheet[0], id, spritesheet]);

    this._MovementEnable = true;

    this._Enableleft = true;
    this._Enableright = true;
    this._Enableup = true;
    this._Enabledown = true;

    this._Movingleft = false;
    this._Movingright = false;
    this._Movingup = false;
    this._Movingdown = false;

    this._distanceX = 0;
    this._distanceY = 0;

    this._LimiteSuperior = limiteSuperior;
    this._LimiteDerecho = limiteDerecho;
    }

    Movable.prototype = Object.create(GameObject.prototype);
    Movable.prototype.constructor = Movable;

    Movable.prototype.Aplastado = function(f) { //Recibe el parametro f que indica el frame
        this.frame=f;
    }
module.exports = Movable;
},{"./Class_GameObject.js":4}],7:[function(require,module,exports){
'use strict';

var Movable = require('./Class_Movable.js');
var GO = require('./Class_GameObject.js');

var playerMusic;
var MusicaCargada=false;

var Player = function(game, position, id, cursors, limiteDerecho, limiteSuperior,posOriginalX,posOriginalY, spriteSheet){
    Movable.apply(this, [game, position, id, limiteDerecho, limiteSuperior, spriteSheet]);
    
    this._cursors = cursors;

    this._animWalk =this.animations.add('Walking', [0,1], 6, true);
    this._animDig =this.animations.add('Digging', [2,3], 6, true);
    this._animDie =this.animations.add('Diying', [5,6,7,8,9], 2, false);

    this._animWalk.play(6,true);
    //this._animDig.play(6,true);

    this._core = new Phaser.Sprite(game, 0, 0, 'Banderita');
    game.physics.enable(this._core, Phaser.Physics.ARCADE);
    this._core.anchor.x = 0.5;
    this._core.anchor.y = 0.5;
    this._core.width = this._core.width/4;
    this._core.height = this._core.height/4;
    this.addChild(this._core);

    this._Muerto=false;
    this._AnimMuerto=false;

    this._MovementEnable=false;
    this._AutomaticMovement=true;
    this._EnPosicion=false;
    this._EsperandoComenzar=false;

    this._posOriginalX=posOriginalX;
    this._posOriginalY=posOriginalY;

    this._posInicial =position;

    this._timer = this.game.time.create(false); //TIMER PARA CONTROLAR MUERTE REAL

    this._Hooked = false; //ESTADO A TRUE CUANDO EL GANCHO HA COGIDO A UN ENEMIGO
    this._Hooking=false;  //LANZANDO EL GANCHO
    this._HookThrow = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    }

    Player.prototype = Object.create(Movable.prototype);
    Player.prototype.constructor = Player;

Player.prototype.Input = function() //Mueve el jugador a la izquierda
    {
    //Comprobación de cursores de Phaser
    if (this._cursors.left.isDown && this.x > 20 && this._Enableleft)
    {
        if (this._Movingright == true)
            this._Movingright = false;
        else if (this._Movingdown == true)
            this._Movingdown = false;
        else if (this._Movingup == true)
            this._Movingup = false;

        if (this._Movingleft == false)
            this._Movingleft = true;

        if (this._Enableright == false)
            this._Enableright = true;
        else if (this._Enabledown==false)
            this._Enabledown = true;
        else if (this._Enableup == false)
            this._Enableup = true;

        this._dirX = -1;

        if (this._distanceY == 0) {
            this.x -= 1;
            this._distanceX -= 1;
            if(this.angle!=0)
                this.angle=0;
            if(this.width<0)
                this.width=-this.width;

        }
        else if (this._dirY == 1) {
            if(this.y < 612 - this.height) {
                this.y += 1;
                this._distanceY += 1;
                if(this.angle!=-90)
                    this.angle=-90;
                if(this.width<0)
                    this.width=-this.width;
            }
        }
        else if (this._dirY == -1) {
            if(this.y > this.height + 24) {
                this.y -= 1;
                this._distanceY -= 1;
                if(this.angle!=90)
                    this.angle=90;
                if(this.width<0)
                    this.width=-this.width;
            }
        }
    }
    else if (this._cursors.right.isDown && this.x < this._LimiteDerecho - 20 && this._Enableright)
    {
        if (this._Movingleft == true)
            this._Movingleft = false;
        else if (this._Movingdown == true)
            this._Movingdown = false;
        else if (this._Movingup == true)
            this._Movingup = false;

        if(this._Movingright == false)
            this._Movingright = true;

        if (this._Enableleft == false)
            this._Enableleft = true;
        else if (this._Enabledown == false)
            this._Enabledown = true;
        else if (this._Enableup == false)
            this._Enableup = true;

        this._dirX = 1;

        if(this._distanceY == 0){
            this.x += 1;
            this._distanceX += 1;
            if(this.angle!=0)
                 this.angle=0;
            if(this.width>0)
                 this.width=-this.width;
        }
        else if (this._dirY == 1){
            if(this.y < 612 - this.height){
                this.y += 1;
                this._distanceY += 1;
                if(this.angle!=90)
                    this.angle=90;
                if(this.width>0)
                    this.width=-this.width;
            }
        }
        else if (this._dirY == -1) {
            if(this.y > this.height + 24) {
                this.y -= 1;
                this._distanceY -= 1;
                if(this.angle!=-90)
                    this.angle=-90;
                if(this.width>0)
                    this.width=-this.width;
            }
        }
    }
    else if (this._cursors.down.isDown && this.y < 612 - this.height && this._Enabledown)
    {   

        if (this._Movingright == true)
        this._Movingright = false;
        else if (this._Movingleft == true)
        this._Movingleft = false;
        else if (this._Movingup == true)
        this._Movingup = false;

        if (this._Movingdown == false)
            this._Movingdown = true;

        if (this._Enableright == false)
            this._Enableright = true;
        else if (this._Enableleft == false)
            this._Enableleft=true;
        else if (this._Enableup == false)
            this._Enableup = true;

        this._dirY = 1;

        if (this._distanceX == 0) {
            this.y += 1;
            this._distanceY += 1;
            if(this.width<0)
                this.width=-this.width;
            if(this.angle!=-90)
                this.angle=-90;
        }
        else if (this._dirX == 1) {
            if (this.x < this._LimiteDerecho - 20) {
                this.x += 1;
                this._distanceX += 1;
            }
        }
        else if (this._dirX == -1) {
            if(this.x > 2) {
                this.x -= 1;
                this._distanceX -= 1;
            }
        }
    }
    else if (this._cursors.up.isDown && this.y > this.height + 24 && this._Enableup)
    {   

        if (this._Movingright == true)
        this._Movingright = false;
        else if (this._Movingleft == true)
        this._Movingleft = false;
        else if (this._Movingdown == true)
        this._Movingdown = false;

        if(this._Movingup == false)
            this._Movingup = true;

        if (this._Enableright == false)
            this._Enableright = true;
        else if (this._Enableleft == false)
            this._Enableleft=true;
        else if (this._Enabledown == false)
            this._Enabledown = true;

        this._dirY =- 1;

        if (this._distanceX == 0) {
            this.y -= 1;
            this._distanceY -= 1;
            if(this.width<0)
                this.width=-this.width;
            if(this.angle!=90)
                this.angle=90;
        }
        else if (this._dirX == 1) {
            if(this.x < this._LimiteDerecho - 20){
                this.x += 1;
                this._distanceX += 1;
            }
        }
        else if (this._dirX == -1) {
            if(this.x > 2) {
                this.x -= 1;
                this._distanceX -= 1;
            }
        }
    }
    else{
        this._Movingleft = false;
        this._Movingright = false;
        this._Movingup = false;
        this._Movingdown = false;
    }

    //PARTE DEL GANCHO QUE VA A HABER QUE CAMBIAR

    /*if (this._HookThrow.isDown && !this._Hooking){
        if(this._MovementEnable){
            this._MovementEnable=false;
            //Pasamos al estado de lanzando con un solo frame
            console.debug(this._Hook._id);
        }
    }*/

    if (this._distanceX > 42 || this._distanceX < -42)
        this._distanceX = 0;
    if (this._distanceY > 42 || this._distanceY < -42)
        this._distanceY = 0;

    if(!this._Movingdown && !this._Movingup && !this._Movingleft && !this._Movingright){
        this._animWalk.paused=false;
        //this._animDig.paused=false;
    }

    /*if(this._fireButton.isDown)
    {
        this._playerWeapon.fire();
    }*/
}
    Player.prototype.update = function() {
        if (this._MovementEnable)
            this.Input();
        else if(this._AutomaticMovement)
            this.AutomaticMovement();

    }
    Player.prototype.AutomaticMovement = function() {
        
        if(this.x > (42*7 - 16)){
            if(this._Movingleft!=true)
                this._Movingleft=true;
            this.x--;
        }
        else if (this.y<(42*8 - 18)){
            if(this._Movingdown!=true)
                this._Movingdown=true;
            if(this.angle!=-90)
                this.angle=-90;
            this.y++;
        }
        else{
            if(this.width>0)
                this.width=-this.width;
            if(this.angle!=0)
                this.angle=0;
            if(!this._EsperandoComenzar){
                this._timer.add(3000, StartGame, this)
                this._timer.start();
                this._animWalk.paused=true;
                this._EsperandoComenzar=true;    
            }
        }
    }
    Player.prototype.PlayerRock = function() {
        this._MovementEnable=false;
    }

    Player.prototype.Muerte = function() {
        this._MovementEnable=false;
        this._AnimMuerto=true;      //Se está realizando la animacion de morir
        this._animDie.play(2,false);
        this._timer.add(2750,PlayerMuerto,this);
        this._timer.start();
    }

    function PlayerMuerto(){
        this._Muerto=true;
    }

    function StartGame(){
        this._MovementEnable=true;  //Esto tiene que activar una funcion contador para lanzar el juego todo a la vez permitiendo a todos los personajes moverse
        this._AutomaticMovement=false;
        this._EnPosicion=true;
        this._animWalk.paused=false;
        this._EsperandoComenzar=false;
    }

    

module.exports = Player;
},{"./Class_GameObject.js":4,"./Class_Movable.js":6}],8:[function(require,module,exports){
'use strict';

var GameObject = require('./Class_GameObject.js');
var PlayScene = require('./play_scene.js');


var Roca = function(game, position,id, spritesheet){
    
    GameObject.apply(this, [game ,position, spritesheet[0], id, spritesheet]);
    
        this.animations.add('Shaking', [0, 1], 5, true);
        this.animations.add('Breaking', [2, 3, 4, 5], 1, false);
        
        this._PuntosEnemigos = [1000, 2500, 4000, 6000, 80000, 10000, 12000, 15000];

        this._Broken=false;
        this._PuntosConseguidos=0;
        this._PuntosActualizados=false;
        this._PuntosContabilizados=false;

        this._RefPlayer;
        this._PlayerAplastado = false;
        this._i;
        this._indicePlayer=0;
        this._PlayerMovido=false;
        this._PlayerMuerto=false;

        this._Falling = false;
        this._HasFallen = false;
        this._FallEnable = false;
        this._timer = this.game.time.create(false);
        }
    
        Roca.prototype = Object.create(GameObject.prototype);
        Roca.prototype.constructor = Roca;
    
        Roca.prototype.update=function(){
            if(this._Falling){
                for(var i=0; i<6; i++){
                    if (this._Falling && this.y<558){
                        this.y ++;
                        if(this._PlayerAplastado)
                            this._RefPlayer.y++;
                    }
                }
            }
            if (this.y > 556)
                this.Para();
        }
    
        Roca.prototype.Para=function() {
            
            this.animations.stop('Shaking');
            this._Falling = false;
            this._HasFallen = true;

            this._timer.add(4000,BreakRock,this);

            if(this.children.length==0 && !this._PlayerAplastado){ //Si la roca no ha cogido ningun monstruo se llama a la cinemática normal de romperse
                this.animations.play('Breaking');
            }
            else
            {
                if(this._PlayerAplastado && !this._PlayerMuerto){
                    this._PlayerMuerto=true;
                    this._RefPlayer.Muerte();
                    this._timer.add(100,BreakRock,this);
                }
                else
                {
                    this._i = this.children.length + 5;
                    if(this._i<14){
                        this._PuntosConseguidos=this._PuntosEnemigos[this.children.length-1];
                        this._PuntosActualizados=true;
                    }else{
                        this._PuntosConseguidos=this._PuntosEnemigos[7];
                        this._PuntosActualizados=true;               
                    }

                    this._timer.add(2000,DestroyEnemies,this,this._i);
                }
            }
            this._timer.start();
            this.body.enable=false;
            
        }
    
        Roca.prototype.EnableFall=function() {
            this.animations.play('Shaking');
            this._timer.add(2000,Fall,this);
            this._timer.start();
        }
    
        function Fall() {
            if(!this._HasFallen){
                this._Falling = true;
                this._timer.stop();
            }
        }
        function BreakRock(){
            if(this._PlayerAplastado && !this._PlayerMovido){
                this._RefPlayer.y-=25;
                this._PlayerMovido=true;
            }
            this.Destroy();
        }

        function DestroyEnemies(I){
            for (var j=this.children.length-1; j>=0; j--){
                this.children[j].Destroy();
            }
            if(I<14)
                this.frame=I;
            else
                this.frame=13;
        }


module.exports = Roca;
},{"./Class_GameObject.js":4,"./play_scene.js":13}],9:[function(require,module,exports){
'use strict';

var GameObject = require('./Class_GameObject.js');


var Tierra = function(game, position,sprite, id, posCentral){
    
    GameObject.apply(this, [game ,position, sprite, id]);
    
        this._posCentralX = posCentral._x;
        this._posCentralY = posCentral._y;
        
        }
    
        Tierra.prototype = Object.create(GameObject.prototype);
        Tierra.prototype.constructor = Tierra;


module.exports = Tierra;
},{"./Class_GameObject.js":4}],10:[function(require,module,exports){
'use strict';

var GameObject = require('./Class_GameObject.js');

var Vegetal = function(game, position, sprite,id, puntos){
    
    GameObject.apply(this, [game ,position, sprite, id]);
    this._puntos = puntos;
    this._timer = this.game.time.create(false);
    }

    Vegetal.prototype = Object.create(GameObject.prototype);
    Vegetal.prototype.constructor = Vegetal;

    Vegetal.prototype.Desaparece = function() 
    {
        this._timer.loop(7500,Destruirse,this);
        this._timer.start();
    }

    function Destruirse(){
        this.Destroy();
    }

module.exports = Vegetal;
},{"./Class_GameObject.js":4}],11:[function(require,module,exports){
'use strict';

var PlayScene = require('./play_scene.js');
var MenuScene = require('./menu.js');

var BootScene = {
  preload: function () {
    //this.game.load.image('preloader_bar', 'images/preloader_bar.png');
  },

  create: function () {
    this.game.state.start('preloader');
  }
};


var PreloaderScene = {
  preload: function () {
     
    // this.loadingBar = this.game.add.sprite(0, 240, 'preloader_bar');
    // this.loadingBar.anchor.setTo(0, 0.5);
    // this.load.setPreloadSprite(this.loadingBar);
    

    this.game.load.baseURL = 'https://raw.githubusercontent.com/RodrigoManuelPerez/TrepacepaDigDug/master/src/';
    this.game.load.crossOrigin = 'anonymous';

    this.game.load.audio('running90s', ['music/Initial_D_Running_in_The_90s.mp3', 'music/Initial_D_Running_in_The_90s.ogg']);
    // TODO: load here the assets for the game

    this.game.load.spritesheet('DigDugWalking', 'images/WalkAnim.png', 36, 36, 10);
    this.game.load.spritesheet('P', 'images/PookaSpriteSheet.png', 36, 36, 10);
    this.game.load.spritesheet('RocaCompletaSpriteSheet', 'images/RocaCompleta.png', 40, 47, 14);
    this.game.load.spritesheet('Bufos', 'images/Bufos.png', 40, 40, 18);  //SpriteSheet de los buffos, se cogeran segun el nivel
    this.game.load.spritesheet('FlorSpriteSheet', 'images/florAnim.png', 42, 46, 2);

    this.game.load.image('Flor', 'images/flor.png');

    //DIFERENTES TIPOS DE TIERRA
    this.game.load.image('tierraSuperficie', 'images/TierraCSuperrficie.png');
    this.game.load.image('tierraHSuperficie', 'images/LaminaTierraSuperficial.png');
    this.game.load.image('tierraVSuperficie', 'images/LaminaTierraVSuperficial.png');

    this.game.load.image('tierraIntermedia', 'images/TierraCIntermedia.png');
    this.game.load.image('tierraHIntermedia', 'images/LaminaTierraIntermedia.png');
    this.game.load.image('tierraVIntermedia', 'images/LaminaTierraVIntermedia.png');

    this.game.load.image('tierraInferior', 'images/TierraCInferior.png');
    this.game.load.image('tierraHInferior', 'images/LaminaTierraInferior.png');
    this.game.load.image('tierraVInferior', 'images/LaminaTierraVInferior.png');

    this.game.load.image('Slime', 'images/Slime.png');
    this.game.load.image('SlimeAplastado', 'images/SlimeAplastado.png');

    this.game.load.image('Gancho', 'images/Gancho.png');

    this.game.load.image('Banderita', 'images/Bandera.png');


    //COSAS DEL MENU
    this.game.load.image('MenuFondo', 'images/Menu.png');
    this.game.load.image('MenuFlecha', 'images/Flecha.png');
  },

  create: function () {
    this.game.state.start('menu');
    //this.game.state.start('play');
  }
};

window.localStorage.setItem( 'highscore', '0' );

window.onload = function () {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

  game.state.add('boot', BootScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('menu', MenuScene);
  game.state.add('play', PlayScene);

  game.state.start('boot');
};
},{"./menu.js":12,"./play_scene.js":13}],12:[function(require,module,exports){

'use strict';

var PlayScene = require('./play_scene.js');

var musicaMenu;
var menu;
var Flechita, parpadeando=false;
var cursors;  //cursores
var PosicionSuperior, PosicionInferior;    //Coordenadas
var PosicionFlecha = true;    //Posicion de la Flecha true para arriba, false para abajo
var timerControl;
var Eleccion=false;


var scoreStringA,scoreTextA,highScoreText;

var MenuScene = {

    preload: function(){

    },

    create: function() {

    timerControl = this.game.time.create(false);

    PosicionSuperior = new Par(300,330);
    PosicionInferior = new Par(300,400);

    //musicaMenu=this.game.add.audio('running90s');
    //musicaMenu.play();

    //Inicializar los cursores.
    cursors = this.game.input.keyboard.createCursorKeys();
    
    menu = new Phaser.Sprite(this.game, 0, 600, 'MenuFondo');
    menu.anchor.x = 0;
    menu.anchor.y = 0;
    Flechita = new Phaser.Sprite(this.game, PosicionSuperior._x, PosicionSuperior._y, 'MenuFlecha');
    Flechita.anchor.x = 0;
    Flechita.anchor.y = 0;
    Flechita.visible=false;
    this.game.world.addChild(menu);
    this.game.world.addChild(Flechita);
    
    //Control de puntuaciones
    scoreStringA = 'HI - SCORE: ';
    scoreTextA = this.game.add.text(20, 20, scoreStringA, { font: '25px Arial', fill: '#fff' });
    scoreTextA.visible=false;
    highScoreText = this.game.add.text(180, 20, '0', { font: "bold 25px Arial", fill: "#46c0f9", align: "center" });
    highScoreText.visible=false;
    highScoreText.text = localStorage.getItem("highscore");
    

},
    update: function(){

        if(menu.y>0){
            menu.y-=2;
        }
        else if(!parpadeando){
            parpadeando=true;
            scoreTextA.visible=true;
            highScoreText.visible=true;
            var timerFlecha = this.game.time.create(false);
            timerFlecha.loop(250,switchFlechita,this);
            timerFlecha.start();
        }


        ///////////////////////HACKS//////////////////////////////////////
        this.game.input.keyboard.game.input.keyboard.onUpCallback = function(key){

            ////////////////////MOVIMIENTO FLECHAS/////////////////
            if(menu.y==0 && !Eleccion){
                if(key.keyCode === Phaser.KeyCode.W || key.KeyCode === cursors.up){
                    if(Flechita.y == PosicionInferior._y){
                        Flechita.y = PosicionSuperior._y;
                        PosicionFlecha=true;
                    }
                }
                if (key.keyCode === Phaser.KeyCode.S || key.keyCode === cursors.down){
                    if(Flechita.y == PosicionSuperior._y){
                        Flechita.y = PosicionInferior._y;
                        PosicionFlecha=false;
                    }
                }
            }

            //////////////////ELECCION//////////////
            if(key.keyCode === Phaser.KeyCode.ENTER || key.keyCode === Phaser.KeyCode.SPACEBAR){
                if(menu.y>0)
                    menu.y=0;
                else{
                    Eleccion=true;
                    timerControl.add(1200,Comienzo,this,this.game);
                    timerControl.start();
                }
            }
        }


        //PUNTUACION
        // highScoreText.text = localStorage.getItem("highscore"); {
        //     if (puntuacion > localStorage.getItem("highscore")) { 
        //         localStorage.setItem("highscore", puntuacion);
        //     }
        // }

    },
    render: function(){
        
    }
}

module.exports = MenuScene;


function Par (x, y) {
    this._x = x;
    this._y = y;
}

function Comienzo(g){
    if(PosicionFlecha)
        g.state.start('play');
}
function switchFlechita(){
    if(!Eleccion)
        Flechita.visible=!Flechita.visible;
    else
    Flechita.visible=true;
}
},{"./play_scene.js":13}],13:[function(require,module,exports){

 'use strict';

var GO = require('./Class_GameObject.js');
var Roca = require('./Class_Roca.js');
var Vegetal = require('./Class_Vegetal.js');
var Movable = require('./Class_Movable.js');
var Player = require('./Class_Player.js');
var Enemy = require('./Class_Enemy.js');
var Fygar = require('./Class_Fygar.js');
var Hook = require('./Class_Hook.js');
var BloqueTierra = require('./Class_Tierra.js');
var Flower = require('./Class_Flor.js');


var player;
var Hook;
var cursors;
var limiteDerecho;
var limiteSuperior;
var tierra, tierraH, tierraV;
var roca, rocasCaidas, VegetalGenerado;
var distanceX, distanceY;
var paredDerecha, paredSuperior;

var tamañoGrupoRocas=0;
var GrupoBanderas;

var mapaNivel;

var GrupoEnemigos;
var PuntosEnemigos = [1000, 2500, 4000, 6000, 80000, 10000, 12000, 15000];

var puntuacion, puntuacionControl;
var scoreTextA, scoreTextB, scoreTextC, score, pauseText;
var maxPuntuacion = 0, highScoreText;
var scoreStringA = '';
var scoreStringB = '';
var scoreStringC = '';
var pauseString = '';
var PAUSED=false;

var vidas=3;
var spriteVidas;
var thisLifes
var lifes;
var i;

var nivel=1;    //Podemos utilizar el nivel para acceder a un array de los sprites de los vegetales segun el nivel facilmente
var levelText;
var levelString = '';
var spriteFlor, flor;

var playerMusic;

var Vegetable;
var PuntosVegetables = [400,600,800,1000,1000,2000,2000,3000,3000,4000,4000,5000,5000,6000,6000,7000,7000,8000];

var PosCentral;

//BOOLEANOS DE CONTROL
var cargado;
var NextLevel;

var timerControl;

var PlayScene = {

    init: function(){
        //rocasCaidas=0;
    },

    preload: function(){
        //this.load.text('level'+ nivel, 'levels/level'+nivel+'1.json');
        this.game.load.text('level1', 'levels/level1.json'); //CAMBIAR ESTO POR EL NUMERO 1 PARA QUE VAYA SEGUN EL VALOR
        this.game.load.text('level2', 'levels/level2.json');
        // this.game.load.text('level3', 'levels/level3.json');
        // this.game.load.text('level4', 'levels/level4.json');
        // this.game.load.text('level5', 'levels/level5.json');
        // this.game.load.text('level6', 'levels/level6.json');
        // this.game.load.text('level7', 'levels/level7.json');
        // this.game.load.text('level8', 'levels/level8.json');
        // this.game.load.text('level9', 'levels/level9.json');

    },

    create: function() {

        //TIMER PARA LA PAUSA
        var timerPause = this.game.time.create(false);
        timerPause.loop(500,switchPause,this);
        timerPause.start();

        //TIMER PARA EL PASO DE NIVEL 
        timerControl= this.game.time.create(false);
        NextLevel=false;

        //MUSICA PARA EL PLAYER AL MOVERSE
        playerMusic=this.game.add.audio('running90s');
        playerMusic.play();
        playerMusic.pause();
        playerMusic.volume -= 0.8;

        //Activar las físicas de Phaser.
        this.game.physics.startSystem(Phaser.ARCADE);
    
        //Poner variables a los limites.
        limiteDerecho = 513;
        limiteSuperior = 44;
        PosCentral = new Par(258, 298);

        //Rocas para vegetal
        cargado=false;
        rocasCaidas=0;
        VegetalGenerado=false;
        
        //Control de puntuaciones
        if(nivel==1){
            puntuacion=0;
            puntuacionControl=0;
        }
        scoreStringA = 'HI -';
        scoreStringB = ' SCORE';
        //scoreStringC = ' SCORE';
        pauseString = 'PAUSED';

        levelString = ' ROUND ';
        scoreTextA = this.game.add.text(556, 44, scoreStringA, { font: '34px Arial', fill: '#fff' });
        scoreTextB = this.game.add.text(599, 87, scoreStringB, { font: '34px Arial', fill: '#fff' });
        //scoreTextC = this.game.add.text(599, 216, scoreStringC, { font: '34px Arial', fill: '#fff' });
        pauseText = this.game.add.text(590, 190, pauseString, { font: '34px Arial', fill: '#fff' });
        pauseText.visible=false;
        
            // Puesto el texto 'Score' en la posicion (x, y) con la fuente y color que se quiera
        score = this.game.add.text(599, 259, puntuacion, { font: '34px Arial', fill: '#fff' });
        highScoreText = this.game.add.text(599, 130, maxPuntuacion, { font: "bold 34px Arial", fill: "#46c0f9", align: "center" });
        levelText = this.game.add.text(513, 517, levelString + nivel, { font: "bold 34px Arial", fill: "#fff", align: "center" });
        score.text=puntuacion;
        //Niveles
        levelText = this.game.add.text(513, 517, levelString + nivel, { font: "bold 34px Arial", fill: "#fff", align: "center" });

        var thisFlor = this.flor;
        thisFlor = this.game.add.group();

        for (i = 0; i < nivel; i++)
        {
            // spriteFlor = thisFlor.create(470 - (43 * i), 44, 'Flor');
            // spriteFlor.anchor.setTo(-0.1, -0.1);
            // spriteFlor.scale.setTo(0.05, 0.05);

            spriteFlor = new Flower(this.game,470 - (43 * i), 34, 'FlorSpriteSheet')
            thisFlor.addChild(spriteFlor);
        }

        //Inicializar los cursores.
        cursors = this.game.input.keyboard.createCursorKeys();

        //Construimos el player
        var PosPlayer = new Par(358, 60);
        player = new Player(this.game,PosPlayer, 'Player',cursors, limiteDerecho, limiteSuperior, 278, 318, 'DigDugWalking');
        this.game.physics.enable(player, Phaser.Physics.ARCADE);
        player.anchor.x = 0.5;
        player.anchor.y = 0.5;
        player.body.enable=true;
        this.game.world.addChild(player);

        



        ///////////////////////Vidas//////////////////////////////
        thisLifes = this.lifes;
        thisLifes = this.game.add.group()
        this.game.add.text(599, 345, 'LIVES ', { font: '34px Arial', fill: '#fff' });

        ActualizaHUD(this.game);

        //Añadir la tierra.
        tierra = this.game.add.physicsGroup();
        //Poner fisicas a la tierra horizontal.
        tierraH = this.game.add.physicsGroup();
        //Poner fisicas a la tierra vertical.
        tierraV = this.game.add.physicsGroup();
        //Grupo de las rocas
        roca = this.game.add.physicsGroup();
        //Grupo de los enemigos
        GrupoEnemigos = this.game.add.physicsGroup();
        //Grupo de las banderas de control
        GrupoBanderas = this.game.add.physicsGroup();
        
        
        LoadMap(nivel,this.game);

        StopEnemies();

},
    update: function(){

        //PLAYER
        this.game.physics.arcade.collide(player, tierra, onCollisionTierra,null, {this:this, g:this.game});
        this.game.physics.arcade.collide(player, tierraH, onCollisionTierra);
        this.game.physics.arcade.collide(player, tierraV, onCollisionTierra);
        this.game.physics.arcade.collide(player, roca, onCollisionRoca);

        //ROCAS
        this.game.physics.arcade.collide(tierra, roca, onCollisionPara);
        this.game.physics.arcade.collide(roca, tierraH, onCollisionTierra);

            //COLISION ROCAS CON ENEMIGOS Y PLAYER
            this.game.physics.arcade.collide(GrupoEnemigos, roca, onCollisionAplasta);
            this.game.physics.arcade.collide(player, roca, onCollisionAplasta);

        //ENEMIGOS
        this.game.physics.arcade.collide(tierra, GrupoEnemigos, onCollisionEnemyTierra);
        this.game.physics.arcade.collide(tierraH, GrupoEnemigos, onCollisionEnemyTierra);
        this.game.physics.arcade.collide(tierraV, GrupoEnemigos, onCollisionEnemyTierra);
        
        //ENEMIGOS CON BANDERITAS DE CONTROL
        this.game.physics.arcade.collide(GrupoBanderas, GrupoEnemigos, onCollisionBandera);

        //ENEMIGOS CON EL PLAYER
        this.game.physics.arcade.collide(GrupoEnemigos, player._core, MuertePlayer);

        //PLAYER CON VEGETAL
        if(VegetalGenerado){
            this.game.physics.arcade.collide(player, Vegetable, onCollisionVegetable,null, {this:this, g:this.game});
        }


        ///////////////////////HACKS//////////////////////////////////////
        this.game.input.keyboard.game.input.keyboard.onUpCallback = function(key){

            //////////////////PRUEBA CAMBIO LEVEL///////////////
            if(key.keyCode === 48){     //El 0
                LevelComplete(this.game);
            }

            ///////////////////NIVEL 1 A FULL VIDAS//////////////////
            if(key.keyCode === 49){     //El 1
                ComenzarJuego(this.game);
            }

            if(key.keyCode === Phaser.KeyCode.ENTER){ //LO NECESARIO PARA RESETEAR LA ESCENA PERDIENDO UNA VIDA
                MuertePlayer();
            }

            if(key.keyCode === Phaser.KeyCode.ESC && !player._AutomaticMovement && !player._animMuerto && !player._Muerto && !player._EsperandoComenzar){ //LO NECESARIO PARA RESETEAR LA ESCENA PERDIENDO UNA VIDA
                if(!PAUSED){
                    player._MovementEnable=false;
                    player._animWalk.paused=true;
                    StopEnemies();
                    PAUSED=true;
                    pauseText.visible=true;
                }
                else{
                    player._MovementEnable=true;
                    player._animWalk.paused=false;
                    StartEnemies();
                    PAUSED=false;
                    pauseText.visible=false;
                }
            }

            if(key.keyCode === Phaser.KeyCode.SPACEBAR){
                for(var gh = GrupoEnemigos.length-1;gh>=0; gh--){
                    GrupoEnemigos.children[gh].Destroy();
                }
            }
        }





        
        //NIVEL COMPLETADO
        if(GrupoEnemigos.length==0 && !NextLevel){
            NextLevel=true;
            timerControl.add(1500,LevelWin,this, this.game);
            timerControl.start();
        }

        //ROCAS CAIDAS
        //Comprobacion de la rotura de rocas
        if(cargado){
            if(roca.length<tamañoGrupoRocas){       //////////////////////////////////////////////////////////
                rocasCaidas++;                      //CUANDO CARGAMOS LA ESCENA DE OTRO NIVEL ESTO SE LLAMA UNA PRIMERA VEZ Y AUMENTA 1
                tamañoGrupoRocas=roca.length;
            }
        }

        if(rocasCaidas==2 && !VegetalGenerado){
            if(nivel<18){
                Vegetable = new Vegetal(this.game,PosCentral,'Bufos','vegetal',PuntosVegetables[nivel-1]);
                Vegetable.frame = nivel-1;
            }
            else{
                Vegetable = new Vegetal(this.game,PosCentral,'Bufos'[PuntosVegetables.length-1],'vegetal',PuntosVegetables[PuntosVegetables.length-1]);
                Vegetable.frame = PuntosVegetables.length-1;
            }
            this.game.physics.enable(Vegetable, Phaser.Physics.ARCADE);
            this.game.world.addChild(Vegetable);
            Vegetable.Desaparece();
            VegetalGenerado=true;
        }

        

        //PUNTUACION
        highScoreText.text = localStorage.getItem("highscore"); {
            if (puntuacion > localStorage.getItem("highscore")) { 
                localStorage.setItem("highscore", puntuacion);
            }
        }

        //PUNTOS QUE DAN LAS ROCAS
        for(var k =0; k<roca.length; k++){

            
            if(roca.children[k]._PlayerAplastado){  //SI SE HA PILLADO AL PLAYER Y ASI NO SUMAMOS PUNTOS POR MATAR A MAS ENEMIGOS SI LOS HUBIERA
                
                //player._muerte();     LLAMARIAMOS A LA FUNCION DE MUERTE DEL PLAYER QUE DEBERIA PARARLO Y HACER LA ANIMACION DE MUERTE Y PONDRIASMOS UN BOOLEANO DE MUERTO A TRUE
            
            }
            else if (roca.children[k]._PuntosActualizados && !roca.children[k]._PuntosContabilizados){  //SI NO SE HA LLAMADO AL PLAYER, YA SE HAN AÑADIDO LOS PUNTOS DE MATAR A X ENEMIGOS Y NO SE HAN AÑADIDO A LA PUNTUACION GLOBAL
                roca.children[k]._PuntosContabilizados=true;
                sumaPuntos(roca.children[k]._PuntosConseguidos,this.game);
            }
        }

        if(player._EnPosicion){
            StartEnemies();
            player._EnPosicion=false;
        }

        if (player._Muerto){
            if (vidas>0){
                ContinuarLevel(this.game, thisLifes); //El player se muere y se restaura su posicion restandole una vida
            }
            else{
                nivel=1;
                this.game.state.start('menu');
            }
        }

        //MUSICA
        if(player._Movingdown || player._Movingup || player._Movingleft || player._Movingright)
            playerMusic.resume();
        else
            playerMusic.pause();

    },
    render: function(){
        
    }
}

module.exports = PlayScene;

function switchPause(){
    if(PAUSED){
        pauseText.visible=!pauseText.visible;
    }
}

function onCollisionBandera(obj1,obj2){
    if(obj2._Fantasma && obj2._posicionInicial>0){
        obj2.BackToNormal(obj1.x,obj1.y);
    }
}

function onCollisionEnemyTierra(obj1,obj2){
    if(!obj2._Fantasma){
        if(obj1._id=='tierra')
            obj2.ChangeDirTierra();
        else if(obj1._id=='tierraH'){
            if(obj2._bufferBounce==0)
                obj2.ChangeDirHor();
            else{
                obj2.ChangeDirTierra();
                obj2._bufferBounce--;
            }
        }
        else if(obj1._id=='tierraV'){
            if(obj2._bufferBounce==0)
                obj2.ChangeDirVer();
            else{
                obj2.ChangeDirTierra();
                obj2._bufferBounce--;
            }
        }
    }
}

function onCollisionAplasta(obj1, obj2){
    if(obj2._Falling){
        if(obj1._id=='Player')  //Si el objeto es el digdug es necesario para su movimiento y asi pausar la cancion
        {
            obj1.y-=15;
            obj1._Movingdown=false;     
            obj1._Movingleft=false;
            obj1._Movingright=false;
            obj1._Movingup=false;
            obj2._PlayerAplastado=true;
            obj2._RefPlayer=player;
            obj1._animWalk.stop();
            obj1._animDig.stop();
            obj1.Aplastado(4);
            obj1.body.enable=false;
        }
        else if(obj1._id=='Enemigo')
        {
            obj1._animWalk.stop();
            obj1._animFant.stop();
            obj1.Aplastado(4);
            obj2.addChild(obj1);    //Ponemos el objeto que choca hijo de la roca
            obj1.x=20;              //En la posicion correcta
            obj1.y=35;
        }
        
        obj1._MovementEnable=false;
        
        if(obj1.angle!=0)
            obj1.angle=0;
          
    }
}

function onCollisionRoca(obj1, obj2)    //Colision del player con la roca que restringe el movimiento
{

    if ((obj1.x-20 == obj2.x && obj1.y<obj2.y+21)||(obj1.x-20 > obj2.x && obj1.y==obj2.y+21)||(obj1.x-20 < obj2.x && obj1.y==obj2.y+21)/*||(obj1.x-20 == obj2.x && obj1.y>obj2.y+58)*/){ //COLISION CON LA PARTE SUPERIOR DE LA ROCA

        if (obj1._Movingleft) {
            obj1._Enableleft = false;
            obj1._dirX = 1;
        }
        else if (obj1._Movingright) {
            obj1._Enableright = false;
            obj1._dirX = -1;
        }
        else if (obj1._Movingdown) {
            obj1._Enabledown = false;
            obj1._dirY = -1
        }
    }
     else if (obj1.x-20 == obj2.x && obj1.y>obj2.y+58){
         if (obj1._Movingup) {
             obj1._Enableup = false;
         }
    }
    else {
        obj2.EnableFall();
    }
}

function onCollisionTierra (obj1, obj2){
    if (obj1._id=='Player'){

        if(obj2._id == 'tierraH' || obj2._id == 'tierraV')
            obj2.Destroy(); //Llamamos la la destructora de la tierra
        else {
            if ((obj1.x-20)>obj2._posX && (obj1.y-20)==obj2._posY){       //ENTRANDO POR LA DERECHA
                obj2.width = obj2.width-1;
                sumaPuntos(1,this.g);
            }
            else if ((obj1.x-20)<obj2._posX && (obj1.y-20)==obj2._posY){
                obj2.x = obj2.x+1;
                obj2.width = obj2.width-1;
                sumaPuntos(1,this.g);
            }
            else if ((obj1.x-20)==obj2._posX && (obj1.y-20)<obj2._posY){
                obj2.y = obj2.y + 1;
                obj2.height = obj2.height-1;
                sumaPuntos(1,this.g);
            }
            else if ((obj1.x-20)==obj2._posX && (obj1.y-20)>obj2._posY){
                obj2.height = obj2.height-1;
                sumaPuntos(1,this.g);
            }
            if (obj2.width<4 || obj2.height<4){
                obj2.Destroy();
                var PosCentralTierra = new Par (obj2._posCentralX, obj2._posCentralY);
                var BanderaControl = new GO(this.g, PosCentralTierra, 'Banderita', 'Bandera'); 

                this.g.physics.enable(BanderaControl, Phaser.Physics.ARCADE);
                BanderaControl.anchor.x = 0.5;
                BanderaControl.anchor.y = 0.5;
                BanderaControl.visible=false;
                this.g.world.addChild(BanderaControl);
                GrupoBanderas.add(BanderaControl);
                BanderaControl.body.immovable = true;
            }
        }
    }
    if (obj1._Falling && obj1._id=='Roca' && obj1.y<obj2.y)         
        obj2.Destroy();
}

function onCollisionPara(obj1, obj2){
    if(obj2._Falling && obj1.y>obj2.y+21){
        if(obj2.y != obj2._posY)
            obj2.Para();
        else
            obj2._Falling=false;
    }
}

function onCollisionVegetable(obj1,obj2){
    sumaPuntos(obj2._puntos, this.g);
    obj2.Destroy();
}

function Par (x, y) {
    this._x = x;
    this._y = y;
}

function sumaPuntos (x,g) {
    puntuacion += x;
    puntuacionControl += x;
    // timerUP = g.time.create(false);
    // timerUP.add(1500,OneUPOFF)
    if(puntuacionControl>=20000){
        puntuacionControl-=20000;
        if(vidas<6){
            vidas++;
            ActualizaHUD(g);
        }
    }
    score.text = puntuacion;
} 

function LoadMap (lvl,g) {
    g.mapaNivel = JSON.parse(g.cache.getText('level'+lvl));

    var posX=-3, posY=80;
    
    var V1 = new Par(-3, posY-43);
    var V2 = new Par(513, posY-43);

    var BloqTierraleft = new GO(g, V1, 'tierraVInferior', 'tierraV');  
    g.physics.arcade.enable(BloqTierraleft);
    BloqTierraleft.body.immovable = true;
    BloqTierraleft.visible=false;
    g.world.addChild(BloqTierraleft);
    tierraV.add(BloqTierraleft);

    var BloqTierraright = new GO(g, V2, 'tierraVInferior', 'tierraV');  
    g.physics.arcade.enable(BloqTierraright);
    BloqTierraright.body.immovable = true;
    BloqTierraright.visible=false;
    g.world.addChild(BloqTierraright);
    tierraV.add(BloqTierraright);
    

    for(var h=0; h<12; h++){
        var PosTierraH = new Par(posX, posY-43);
        var BloqTierraH = new GO(g, PosTierraH, 'tierraHInferior','tierraH');
        BloqTierraH.visible=false;
        g.physics.arcade.enable(BloqTierraH);
        BloqTierraH.body.immovable = true;
        g.world.addChild(BloqTierraH);
        tierraH.add(BloqTierraH);

        var PosCentralTierra = new Par (posX+23, posY-20);
        var BanderaControl = new GO(g, PosCentralTierra, 'Banderita', 'Bandera'); 

        g.physics.enable(BanderaControl, Phaser.Physics.ARCADE);
        BanderaControl.anchor.x = 0.5;
        BanderaControl.anchor.y = 0.5;
        BanderaControl.visible=false;
        g.world.addChild(BanderaControl);
        GrupoBanderas.add(BanderaControl);
        BanderaControl.body.immovable = true;

        posX+=43;
    }
    
    posY=83;
    posX=-3;

    for (var j = 0; j < 25; j++){
        for (var i = 0; i < 25; i++){

            var fila = g.mapaNivel.nivel[j].fila;

            if (j%2==0){   //Si estasmos en una fila par
                if(i%2!=0){     //Si estamos en una columna impar deberia ser 2 para lleno o 0 para vacio
                    if(fila[i]=='2'){

                        var PosTierraH = new Par(posX, posY-3);
                        if(j<9)
                            var BloqTierraH = new GO(g, PosTierraH, 'tierraHSuperficie','tierraH');
                        else if(j<17)
                            var BloqTierraH = new GO(g, PosTierraH, 'tierraHIntermedia','tierraH');
                        else 
                            var BloqTierraH = new GO(g, PosTierraH, 'tierraHInferior','tierraH');

                        g.physics.arcade.enable(BloqTierraH);
                        BloqTierraH.body.immovable = true;
                        g.world.addChild(BloqTierraH);
                        tierraH.add(BloqTierraH);

                        posX+=43;
                    }
                    else{
                        posX+=43;
                    }
                }
            }
            else{   //Si estasmos en una fila impar
                if(i%2==0){     //Si estamos en una columna par 
                    if(fila[i]=='1'){

                        var PosTierraV = new Par(posX, posY-46);

                        if(j<9)
                            var BloqTierraV = new GO(g, PosTierraV, 'tierraVSuperficie', 'tierraV');
                        else if(j<17)
                            var BloqTierraV = new GO(g, PosTierraV, 'tierraVIntermedia', 'tierraV'); 
                        else
                            var BloqTierraV = new GO(g, PosTierraV, 'tierraVInferior', 'tierraV');  
                        g.physics.arcade.enable(BloqTierraV);
                        BloqTierraV.body.immovable = true;
                        g.world.addChild(BloqTierraV);
                        tierraV.add(BloqTierraV);

                        posX+=43;
                    }
                    else{
                        posX+=43;
                    }
                }
                else    //AQUI PARA LAS COLUMNAS IMPARES QUE PUEDEN SER DE TIERRA, TIERRA CON ROCA, VACIA, VACIA CON MONSTRUO
                {
                    if(fila[i]=='0'){    //Bloque de Tierra
                        
                        var PosCentralTierra = new Par(posX-20, posY-23);
                        var BanderaControl = new GO(g, PosCentralTierra, 'Banderita', 'Bandera'); 

                        g.physics.enable(BanderaControl, Phaser.Physics.ARCADE);
                        BanderaControl.anchor.x = 0.5;
                        BanderaControl.anchor.y = 0.5;
                        BanderaControl.visible=false;
                        g.world.addChild(BanderaControl);
                        GrupoBanderas.add(BanderaControl);
                        BanderaControl.body.immovable = true;
                    }
                    else if(fila[i]=='3'){    //Bloque de Tierra
                        
                        var PosTierra = new Par(posX-40, posY-43);
                        var PosCentralTierra = new Par(posX-20, posY-23);

                        if(j<9)
                            var BloqTierra = new BloqueTierra(g, PosTierra, 'tierraSuperficie', 'tierra',PosCentralTierra); 
                        else if(j<17)
                            var BloqTierra = new BloqueTierra(g, PosTierra, 'tierraIntermedia', 'tierra', PosCentralTierra); 
                        else
                            var BloqTierra = new BloqueTierra(g, PosTierra, 'tierraInferior', 'tierra', PosCentralTierra);  
                        
                        g.physics.arcade.enable(BloqTierra);
                        BloqTierra.body.immovable = true;
                        g.world.addChild(BloqTierra);
                        tierra.add(BloqTierra);

                    }
                    else if(fila[i]=='4'){    //Bloque de Tierra + Roca
                        
                        var PosTierra = new Par(posX-40, posY-43);
                        var PosCentralTierra = new Par(posX-20, posY-23);
                        
                        if(j<9)
                            var BloqTierra = new BloqueTierra(g, PosTierra, 'tierraSuperficie', 'tierra', PosCentralTierra); 
                        else if(j<17)
                            var BloqTierra = new BloqueTierra(g, PosTierra, 'tierraIntermedia', 'tierra', PosCentralTierra); 
                        else
                            var BloqTierra = new BloqueTierra(g, PosTierra, 'tierraInferior', 'tierra', PosCentralTierra);  

                        g.physics.arcade.enable(BloqTierra);
                        BloqTierra.body.immovable = true;
                        g.world.addChild(BloqTierra);
                        tierra.add(BloqTierra);

                        var PosRock = new Par(posX-40, posY-44);
                        var Rock = new Roca(g, PosRock, 'Roca', 'RocaCompletaSpriteSheet');
                        g.physics.arcade.enable(Rock); 
                        roca.add(Rock);     //AÑADIMOS AL GRUPO

                        
                        
                    }
                    else if(fila[i]=='5'){    //Enemigo
                        
                        var PosEne = new Par(posX-20,posY-23);
                        var enemigo = new Enemy('P', g, PosEne, 'Enemigo', limiteDerecho, limiteSuperior,player);
                        g.physics.enable(enemigo, Phaser.Physics.ARCADE);
                        enemigo.anchor.x = 0.5;
                        enemigo.anchor.y = 0.5;
                        g.world.addChild(enemigo);
                        GrupoEnemigos.add(enemigo);

                        var PosCentralTierra = new Par(posX-20, posY-23);
                        var BanderaControl = new GO(g, PosCentralTierra, 'Banderita', 'Bandera'); 

                        g.physics.enable(BanderaControl, Phaser.Physics.ARCADE);
                        BanderaControl.anchor.x = 0.5;
                        BanderaControl.anchor.y = 0.5;
                        BanderaControl.visible=false;
                        g.world.addChild(BanderaControl);
                        GrupoBanderas.add(BanderaControl);
                        BanderaControl.body.immovable = true;

                    }
                }
            }
        }
        posX=-3;
        if (j%2==0)
            posY+=43;
    }
    tamañoGrupoRocas=roca.length;
    cargado=true;
} 

function ResetPosition(){       //Coloca al todos los personajes en el lugar original
    
    for (var i=0; i< GrupoEnemigos.length; i++){
        GrupoEnemigos.children[i].x = GrupoEnemigos.children[i]._posOriginalX;
        GrupoEnemigos.children[i].y = GrupoEnemigos.children[i]._posOriginalY;
        GrupoEnemigos.children[i]._distanceX=0;
        GrupoEnemigos.children[i]._distanceY=0;
    }
    player.x=player._posOriginalX;
    player.y=player._posOriginalY;
    player._distanceX=0;
    player._distanceY=0;
    player._Enableright = true;
    player._Enableleft = true;
    player._Enabledown = true;
    player._Enableup = true;
    player._animDig.stop();
    player._animDie.stop();
    player._animWalk.play(6,true);


    if(player.width<0)
        player.width=-player.width;
    if(player.angle!=0)
        player.angle=0;
}

function StopEnemies(){
    for (var t=0; t<GrupoEnemigos.length; t++){
        GrupoEnemigos.children[t]._MovementEnable=false;
        GrupoEnemigos.children[t]._animWalk.stop();
    }
}

function StartEnemies(){
    for (var t=0; t<GrupoEnemigos.length; t++){
        GrupoEnemigos.children[t]._animWalk.play(6,true);
        GrupoEnemigos.children[t]._MovementEnable=true;
        GrupoEnemigos.children[t]._Fantasma=false;
        GrupoEnemigos.children[t]._giros=0;
        GrupoEnemigos.children[t]._posicionInicial=0;
        GrupoEnemigos.children[t]._bufferBounce=1;
    }
}

function LevelComplete(g){
    nivel++;
    g.state.restart('play', false, false);
}

function ActualizaHUD(g){       //ACTUALIZA EL HUD DE LAS VIDAS

    for (i = 0; i < thisLifes.length; i++) 
    {
        thisLifes.removeChildren();
    }

    for (i = 0; i < vidas; i++) 
    {
        spriteVidas = thisLifes.create(556 + (43 * i), 388, 'DigDugWalking');
        spriteVidas.frame=0;
        spriteVidas.alpha = 0.7;
    }
}

function LevelWin(g){    //Para el sonido de victoria
    if(!player._Muerto || !player._animMuerto){
        playerMusic.stop();
        player._animDig.stop();
        player._animWalk.stop();
        player._MovementEnable=false;
        //Lanzar la musiquita de victoria (ajustar el timer a cuando se acabe el sonido)
        timerControl.add(2500,LevelComplete,this,g);
        timerControl.start();
    }
    else{
        MuertePlayer();
    }
    
}

function ContinuarLevel(g,lfs){
    player.body.enable=true;
    player._Muerto=false;
    player._AnimMuerto=false;
    player._MovementEnable=true;
    vidas--;
    PAUSED=false;
    ResetPosition();
    StartEnemies();
    ActualizaHUD(g,lfs);
}

function ComenzarJuego(g){
    playerMusic.stop();
    nivel=1;
    vidas=3;
    puntuacion=0;
    VegetalGenerado=false;
    g.state.restart('play', false, false);
}

function MuertePlayer(){
    if(!player._AnimMuerto){
        player.Muerte();
        StopEnemies();
    }
}
},{"./Class_Enemy.js":1,"./Class_Flor.js":2,"./Class_Fygar.js":3,"./Class_GameObject.js":4,"./Class_Hook.js":5,"./Class_Movable.js":6,"./Class_Player.js":7,"./Class_Roca.js":8,"./Class_Tierra.js":9,"./Class_Vegetal.js":10}]},{},[11]);
