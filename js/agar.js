var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
var html = document.documentElement;

canvas.height = html.clientHeight-20;
canvas.width = html.clientWidth-20;

const MAX_CHILD = 1000;
const MAX_X = 3000;
const MAX_Y = 3000;
const SPEED = 2;

var childs = [];

/**
 * RECTANGLE Class
 */

function Rectangle(color, pos, dimension, size)
{
    this.color = color;
    this.pos = pos;
    this.dimension = dimension;
    this.size = size;
}

Rectangle.prototype.renderStrip = function()
{
    ctx.beginPath();
    ctx.rect(this.pos.x,this.pos.y,this.dimension.w,this.dimension.h);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.size;
    ctx.stroke();
}


Rectangle.prototype.renderFill = function()
{
    ctx.beginPath();
    ctx.rect(this.pos.x,this.pos.y,this.dimension.w,this.dimension.h);
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.size;
    ctx.fill();
    ctx.stroke();
}

Rectangle.prototype.renderFillImage = function(src)
{
    var image = new Image();

    image.onload = function()
    {
        var pattern = ctx.createPattern(image, 'repeat');
        ctx.rect(0, 0, MAX_X, MAX_Y);
        ctx.strokeStyle = pattern;
        ctx.stroke();
    }
    image.src = src;
}

function Circle(color, radius, speed, pos)
{
    this.color = color;
    this.radius = radius;
    this.speed = speed;
    this.pos = pos;
}

Circle.prototype.render = function(mother)
{
    ctx.beginPath();
    ctx.arc(this.pos.x - offsetX, this.pos.y - offsetY, this.radius, 0, 2.0 * Math.PI, false);
    ctx.shadowColor = 'grey';
    ctx.shadowBlur = 3;
    ctx.fillStyle = this.color;
    ctx.fill();
}

Circle.prototype.move = function() 
{
    this.render();
    
    if (this.pos.x > MAX_X)
    {
        this.speed.x -= 2; 
    }

    if (this.pos.x < 0)
    {
        this.speed.x += 2;
    }

    if (this.pos.y > MAX_Y)
    {
        this.speed.y -= 2;         
    }

    if (this.pos.y < 0)
    {
        this.speed.y += 2;
    }

    this.pos.x += this.speed.x;
    this.pos.y += this.speed.y;
}

Circle.prototype.checkCollide = function()
{
    for (let i = 0 ; i < childs.length ; i++)
    {
        var xd = childs[i].pos.x - this.pos.x;
        var yd = childs[i].pos.y - this.pos.y;
        var radiusSum = this.radius + childs[i].radius;

        if (xd * xd + yd * yd <= radiusSum * radiusSum)
        {
            childs.splice(i, 1);
            this.radius += 0.3;
        }
    }
}

function initializeChild()
{
    for (let i = 0; i < MAX_CHILD; i++)
    {
        let pos = {
            x: Math.ceil(Math.random() * MAX_X),
            y: Math.ceil(Math. random() * MAX_Y)
        };
        let color = 'rgb('+Math.ceil(Math.random()*255)+', '+Math.ceil(Math.random()*255)+', '+Math.ceil(Math.random()*255)+')';
        childs.push(new Circle(color, 5, {x:3, y:3}, pos));
    }
}

var mother = new Circle('red', 20, {x:3, y:3}, {x: Math.random() * MAX_X, y: Math.random() * MAX_Y});
var fence = new Rectangle('red', {x:0, y:0}, {w: MAX_X, h: MAX_Y}, 10);

var offsetX = 0;
var offsetY = 0;

function update() {
    ctx.clearRect(0, 0, MAX_X, MAX_Y);

    for (let i = 0 ; i < childs.length ; i++)
    {
        childs[i].render();
    }
        
    mother.render();
    mother.checkCollide();
    mother.move();

    console.log(mother.speed);

    // Dapetin arah vektor
    var direction = {x: mouseX - canvas.width / 2, y: mouseY - canvas.height / 2};

    // Membuat panjang dari setiap vektor sama
    var directionMagnitude = Math.sqrt(direction.x * direction.x + direction.y * direction.y);

    // Validasi vector ketika 0
    if(Math.abs(directionMagnitude) > 0.000001) {
        // Perpindahan
        mother.speed = {x: direction.x / directionMagnitude * SPEED, y: direction.y / directionMagnitude * SPEED};
    }
    
    // Kamera
    offsetX = mother.pos.x - canvas.width / 2;
    offsetY = mother.pos.y - canvas.height / 2;
    
    requestAnimationFrame(update);
}

canvas.addEventListener('mousemove',mouseHandling,false);

var mouseX = 0;
var mouseY = 0;

function mouseHandling(e) {
    mouseX = e.pageX;
    mouseY = e.pageY;
}

initializeChild();
mother.render();
update();

