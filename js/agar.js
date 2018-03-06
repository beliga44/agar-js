var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
var html = document.documentElement;

canvas.height = html.clientHeight-20;
canvas.width = html.clientWidth-20;

const MAX_CHILD = 400;

var childs = [];

window.addEventListener('mousemove',test,false);

function test(e)
{
    e = e || window.event;
    console.log(e);
}

function Rectangle(color, pos, dimension, size)
{
    this.color = color;
    this.pos = pos;
    this.dimension = dimension;
    this.size = size;
}

Rectangle.prototype.render = function()
{
    ctx.beginPath();
    ctx.rect(this.pos.x,this.pos.y,this.dimension.w,this.dimension.h);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.size;
    ctx.lineCap = 'round';    
    ctx.stroke();
}

function Circle(color, radius, speed, pos)
{
    this.color = color;
    this.radius = radius;
    this.speed = speed;
    this.pos = pos;
}

Circle.prototype.render = function()
{
    ctx.beginPath()
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2.0 * Math.PI, false);
    ctx.fillStyle = this.color;
    ctx.fill();
}

Circle.prototype.move = function() 
{
    this.pos.x += this.speed.x;
    this.pos.y += this.speed.y;
}

Circle.prototype.checkCollide = function()
{
    if (this.pos.y + this.radius > canvas.height)
        this.speed.y = -this.speed.y;
    
    if (this.pos.y - this.radius < 0)
        this.speed.y = Math.abs(this.speed.y);

    if(this.pos.x + this.radius > canvas.width)
        this.speed.x = -this.speed.x;

    if(this.pos.x - this.radius < 0)
        this.speed.x = Math.abs(this.speed.x);
    
    for (let i = 0 ; i < childs.length ; i++)
    {
        var xd = childs[i].pos.x - this.pos.x;
        var yd = childs[i].pos.y - this.pos.y;
        var radiusSum = this.radius + childs[i].radius;

        if (xd * xd + yd * yd <= radiusSum * radiusSum)
        {
            childs.splice(i,1);
            this.radius += 0.3;
        }
    }
}


function initializeChild()
{
    for(let i = 0; i < MAX_CHILD; i++)
    {
        let pos = {
            x: Math.ceil(Math.random() * canvas.width),
            y: Math.ceil(Math. random() * canvas.height)
        };
        let color = 'rgb('+Math.ceil(Math.random()*255)+', '+Math.ceil(Math.random()*255)+', '+Math.ceil(Math.random()*255)+')';
        childs.push(new Circle(color, 3, {x:3, y:3}, pos));
    }    
}

var mother = new Circle('red', 10, {x:3, y:3}, {x:canvas.width/2, y:canvas.height/2});
var fence = new Rectangle('black', {x:0, y:0}, {w: canvas.width, h: canvas.height}, 10);

function update(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    fence.render();
    for(let i = 0 ; i < childs.length ; i++){
        childs[i].render();
    }
    mother.render();
    mother.move();
    mother.checkCollide();
    requestAnimationFrame(update);
}

initializeChild();
mother.render();
update();


// function createBatas(){
//     ctx.beginPath();
//     ctx.rect(0,0,canvas.width,canvas.height);
//     ctx.lineWidth = 6;
//     ctx.strokeStyle = 'green';
//     ctx.stroke();
// }

// var config = {
//     x:canvas.width/2,
//     y:canvas.height/2,
//     vX:5,
//     vY:5
// }

// function createBall(set,r)
// {
//     ctx.beginPath();
//     ctx.arc(config.x,config.y,r,0,2.0 * Math.PI,false);
//     ctx.fill();
// }

// function redraw()
// {
//     ctx.clearRect(0,0,canvas.width,canvas.height);
//     createBatas();
//     createBall(config,40);
//     config.y += config.vY;
//     config.x += config.vX;

//     var value_1 = Math.random() * 255;
//     console.log(Math.ceil(value_1));
//     if ((config.x+40) > canvas.width)
//     {
//         config.vX = -config.vX;
//     }

//     if ((config.x-40) < 0)
//     {
//         config.vX = Math.abs(config.vX);
//     }

//     if ((config.y-40) < 0 )
//     {
//         config.vY = Math.abs(config.vY);
//     }

//     if ((config.y+40) > canvas.height)
//     {
//         config.vY = -(config.vY);
//     }

//     requestAnimationFrame(redraw);
// };

// redraw();
