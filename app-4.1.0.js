'use strict';

(function () {
    var animation = {};

    window.onload = function () {
        startAnimation();
    };

    function startAnimation() {
        animation.canvas = document.getElementById('topCanvas');
        if (!animation.canvas.getContext) {
            return;
        }
        document.getElementById('topLogo').style.backgroundImage = 'none';

        setCanvasSize();
        animation.logo = createLogo();
        animation.context = animation.canvas.getContext('2d');
        animation.balls = [new Ball()];

        window.onresize = setCanvasSize;
        animation.canvas.onclick = function (event) {
            animation.balls.push(new Ball(event.offsetX, event.offsetY));
        };
        document.getElementById('topLogo').onclick = function () {
            animation.balls = [];
        };
        setInterval(function () {
            if (animation.balls.length < 12) {
                animation.balls.push(new Ball());
            }
        }, 20000);

        requestAnimationFrame(stepAnimation);

        function setCanvasSize() {
            animation.canvas.height = animation.canvas.offsetHeight;
            animation.canvas.width = animation.canvas.offsetWidth;
        }

        function createLogo() {
            var canvas = document.createElement('canvas');
            canvas.height = 320;
            canvas.width = 320;
            var context = canvas.getContext('2d');
            context.beginPath();
            context.moveTo(214.02012, 214.02012);
            context.arc(160, 160, 123.2, 0.785398111, 5.497787196);
            context.arc(-185.570367951, -185.570367951, 504, 0.538451436, 1.032344891);
            context.moveTo(171.2, 171.2);
            context.lineTo(130.02012, 130.02012);
            context.lineWidth = 28;
            context.stroke();
            context.beginPath();
            context.moveTo(216, 216);
            context.arc(160, 160, 123.2, 0.785398111, 5.497787196);
            context.arc(-185.570367951, -185.570367951, 504, 0.538451436, 1.032344891);
            context.moveTo(171.2, 171.2);
            context.lineTo(132, 132);
            context.strokeStyle = '#EE0055';
            context.lineWidth = 22.4;
            context.stroke();
            context.beginPath();
            context.arc(193.6, 87.2, 9.8, 0, 6.283185307);
            context.strokeStyle = '#000000';
            context.lineWidth = 2.8;
            context.stroke();
            return canvas;
        }
    }

    function stepAnimation(timestamp) {
        if (!animation.timestamp) {
            animation.timestamp = timestamp;
        }
        var elapsed = timestamp - animation.timestamp;
        if (elapsed > 100) {
            elapsed = 40;
        }
        animation.timestamp = timestamp;
        animation.context.clearRect(0, 0, animation.canvas.width, animation.canvas.height);
        animation.context.drawImage(animation.logo, 0, 0);
        for (var i = animation.balls.length - 1; i >= 0; i--) {
            animation.balls[i].step(elapsed);
        }
        requestAnimationFrame(stepAnimation);
    }

    class Ball {
        constructor(x, y) {
            this.width = 0.1 + 4 * Math.random();
            this.r = 10 - this.width / 2;
            this.phase = 0;
            this.x = x > 310 ? x : animation.canvas.width - 10;
            this.y = y || Math.random() * 320;
            this.xSpeed = 0.02 + Math.random() * 0.18;
            this.ySpeed = 0;
        }

        step(elapsed) {
            if (this.phase === 0) {
                this.x -= this.xSpeed * elapsed;
                this.y += this.ySpeed * elapsed;
                if (this.x > 330) {
                    if (this.y < 10) {
                        this.y = 10 + (10 - this.y) * 1.6;
                        this.ySpeed *= -1.6;
                    } else if (this.y > 310) {
                        this.y = 310 - (this.y - 310) * 1.6;
                        this.ySpeed *= -1.6;
                    } else {
                        this.ySpeed += (0.5 - Math.random()) * 0.1;
                    }
                    if (this.ySpeed < -0.4) {
                        this.ySpeed = -0.3;
                    } else if (this.ySpeed > 0.4) {
                        this.ySpeed = 0.3;
                    }
                } else if (this.x > 255) {
                    if (this.y < -2 * this.x + 670) {
                        // (330, 10), (255, 160), y = -2x + 670
                        this.y = -2 * this.x + 670 + (-2 * this.x + 670 - this.y) * 0.5;
                        this.ySpeed = this.xSpeed * 2.8;
                    } else if (this.y > 2 * this.x - 350) {
                        // (330, 310), (255, 160), y = 2x - 350
                        this.y = 2 * this.x - 350 - (this.y - 2 * this.x + 350) * 0.5;
                        this.ySpeed = this.xSpeed * -2.8;
                    }
                    this.ySpeed += (0.5 - Math.random()) * 0.1;
                    if (this.ySpeed < this.xSpeed * -6) {
                        this.ySpeed = this.xSpeed * -3.1;
                    } else if (this.ySpeed > this.xSpeed * 6) {
                        this.ySpeed = this.xSpeed * 3.1;
                    }
                } else {
                    this.phase = 1;
                    if (this.x < 250) {
                        this.x = 250;
                    }
                    if (this.y < 155) {
                        this.y = 155;
                    } else if (this.y > 165) {
                        this.y = 165;
                    }
                }
            } else if (this.phase === 1) {
                this.x -= this.xSpeed * elapsed;
                this.y += this.xSpeed * elapsed * (0.65 - 0.05 * (0.5 - Math.random()));
                if (this.x <= this.y) {
                    this.phase = 2;
                    this.x = this.y;
                }
            } else if (this.phase === 2) {
                this.x += this.xSpeed * elapsed;
                if (this.x > 247.11556) {
                    this.phase = 3;
                    this.x = 247.11556;
                    this.a = 0.785398111;
                }
                this.y = this.x;
            } else if (this.phase === 3) {
                this.a += (this.xSpeed * elapsed) / 123.2;
                if (this.a >= 5.497787196) {
                    this.phase = Math.random() > 0.6 ? 4 : 6;
                    this.a = 5.497787196;
                }
                this.x = 160 + 123.2 * Math.cos(this.a);
                this.y = 160 + 123.2 * Math.sin(this.a);
                if (this.phase !== 3) {
                    this.a = 0.538451436;
                }
            } else if (this.phase === 4) {
                this.a += (this.xSpeed * elapsed) / 504;
                if (this.a >= 1.032344891) {
                    this.phase = 5;
                    this.a = 1.032344891;
                }
                this.x = -185.570367951 + 504 * Math.cos(this.a);
                this.y = -185.570367951 + 504 * Math.sin(this.a);
                if (this.phase === 5) {
                    this.a = 2.356194542;
                }
            } else if (this.phase === 5) {
                this.a += (this.xSpeed * elapsed) / 123.2;
                if (this.a >= 5.497787196) {
                    this.phase = Math.random() > 0.7 ? 6 : 4;
                    this.a = 5.497787196;
                }
                this.x = 160 + 123.2 * Math.cos(this.a);
                this.y = 160 + 123.2 * Math.sin(this.a);
                if (this.phase !== 5) {
                    this.a = 0.538451436;
                }
            } else if (this.phase === 6) {
                this.a += (this.xSpeed * elapsed) / 504;
                if (this.a >= 0.785398163) {
                    this.phase = 7;
                    this.a = 0.785398163;
                }
                this.x = -185.570367951 + 504 * Math.cos(this.a);
                this.y = -185.570367951 + 504 * Math.sin(this.a);
            } else if (this.phase === 7) {
                this.x -= this.xSpeed * elapsed;
                if (this.x < 100) {
                    this.phase = 8;
                    this.x = 100;
                    this.ySpeed = -0.1 * Math.random();
                }
                this.y = this.x;
            } else if (this.phase === 8) {
                this.x += this.xSpeed * elapsed;
                this.y += this.ySpeed * elapsed;
                if (this.y < 87.2) {
                    this.ySpeed += this.xSpeed * 0.1;
                } else if (this.y > 87.2) {
                    this.ySpeed -= this.xSpeed * 0.1;
                }
                if (this.x > 180) {
                    this.y = (this.y + 87.2) / 2;
                }
                if (this.x >= 193.6) {
                    this.phase = 9;
                    this.x = 193.6;
                    this.y = 87.2;
                    this.a = 10;
                }
            } else if (this.phase === 9) {
                this.a += this.xSpeed * 10;
                if (this.a > 1400) {
                    this.phase = 0;
                    this.x = animation.canvas.width - 10;
                    this.y = Math.random() * animation.canvas.height;
                    this.ySpeed = 0;
                }
            }
            if (this.phase !== 9) {
                animation.context.beginPath();
                animation.context.arc(this.x, this.y, this.r, 0, 6.283185307);
                animation.context.lineWidth = this.width;
                animation.context.stroke();
            } else {
                animation.context.beginPath();
                animation.context.arc(this.x, this.y, this.r + this.a, 0, 6.283185307);
                animation.context.lineWidth = this.width;
                animation.context.stroke();
            }
        }
    }
})();
