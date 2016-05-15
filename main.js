(function () {
  'use strict';

  window.requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (cb) {
      setTimeout(cb, 17);
    };

  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');

  var NUM = 20;
  var WIDTH = 500;
  var HEIGHT = 500;
  var LIFE_MAX = 100;
  var particles = [];

  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  function Particle(ctx, x, y) {
    this.ctx = ctx;
    this.initialize(x, y);
  }

  Particle.prototype = {
    initialize: function (x, y) {
      this.x = x || 0;
      this.y = y || 0;
      this.radius = 250;
      this.startLife = Math.ceil(LIFE_MAX * Math.random());
      this.life = this.startLife;
      this.v = {
        x: Math.random() * 10 - 5,
        y: Math.random() * 10 - 5
      };
      this.color = {
        r: Math.floor(Math.random() * 255),
        g: Math.floor(Math.random() * 255),
        b: Math.floor(Math.random() * 255),
        a: 1
      };
    },

    updateParams: function() {
      var ratio = this.life / this.startLife;
      this.color.a = 1 - ratio;
      this.radius = 30 / ratio;
      if (this.radius > 300) {
        this.radius = 300;
      }
      this.life -= 1;
      if (this.life === 0) {
        this.initialize();
      }
    },

    draw: function () {
      var ctx = this.ctx;
      ctx.globalCompositeOperation = 'lighter';
      ctx.beginPath();
      ctx.fillStyle = this.gradient();
      ctx.arc(this.x, this.y, this.radius, Math.PI * 2, 0);
      ctx.fill();
      ctx.closePath();
    },

    render: function () {
      this.updateParams();
      this.updatePosition();
      this.wrapPosition();
      this.draw();
    },

    updatePosition: function () {
      this.x += this.v.x;
      this.y += this.v.y;
    },

    wrapPosition: function () {
      if (this.x < 0) {
        this.x = WIDTH;
      }
      if (this.x > WIDTH) {
        this.x = 0;
      }
      if (this.y < 0) {
        this.y = HEIGHT;
      }
      if (this.y > HEIGHT) {
        this.y = 0;
      }
    },

    gradient: function () {
      var col = this.color.r + ', ' + this.color.g + ', ' + this.color.b;
      var g = this.ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
      g.addColorStop(0, 'rgba(' + col + ', ' + this.color.a + ')');
      g.addColorStop(0.5, 'rgba(' + col + ', ' + this.color.a * 0.2 + ')');
      g.addColorStop(1, 'rgba(' + col + ', ' + 0 + ')');
      return g;
    }

  };


  for (var i = 0; i < NUM; i++) {
    var positionX = Math.random() * 120;
    var positionY = Math.random() * 20;
    var particle = new Particle(ctx, positionX, positionY);
    particles.push(particle);
  }

  render();

  function render() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    particles.forEach(function (e) {
      e.render();
    });

    requestAnimationFrame(render);
  }

}());
