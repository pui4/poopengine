export const poopengine = {
  canvas: document.createElement("canvas"),
  display: { width: document.body.clientWidth, height: window.innerHeight },
  context: null,
  objects: [],
  input: {
    keydown: null,
    keypressed: null,
    keyup: null,
    click: null,
    mousedown: null,
    mouseup: null,
    mouse_pos: { x: null, y: null },
    hovering: function (object) {
      if (this.mouse_pos.x != null) {
        const index = poopengine.objects.indexOf(object);
        const array = poopengine.objects.slice(index + 1);

        for (let i = 0; i < array.length; i++) {
          if (
            this.mouse_pos.x >= array[i].x &&
            this.mouse_pos.x <= array[i].x + array[i].width &&
            this.mouse_pos.y >= array[i].y &&
            this.mouse_pos.y <= array[i].y + array[i].height
          ) {
            return false;
          }
        }

        if (
          this.mouse_pos.x >= object.x &&
          this.mouse_pos.x <= object.x + object.width &&
          this.mouse_pos.y >= object.y &&
          this.mouse_pos.y <= object.y + object.height
        ) {
          return true;
        } else {
          return false;
        }
      }
    },
  },
  fps: 0,
  deltaTime: 1,
  times: [],

  start: function () {
    this.canvas.click();
    this.canvas.width = document.body.clientWidth;
    this.canvas.height = window.innerHeight;
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);

    this.context = this.canvas.getContext("2d");

    // Event listeners
    window.onresize = () => {
      this.canvas.width = this.display_width = document.body.clientWidth;
      this.canvas.height = this.display_height = window.innerHeight;

      this.display = {
        width: document.body.clientWidth,
        height: window.innerHeight,
      };

      this.resize();
    };

    // Mouse input
    window.addEventListener("mousedown", () => {
      this.input.mousedown = true;
    });
    window.addEventListener("click", () => {
      if (this.input.click == null) {
        this.input.click = true;

        setTimeout(() => {
          this.input.click = null;
        }, 10);
      }
    });
    window.addEventListener("mouseup", () => {
      this.input.mouseup = true;
      this.input.mousedown = null;

      setTimeout(() => {
        this.input.mouseup = null;
      }, 10);
    });

    window.addEventListener("mousemove", (event) => {
      this.input.mouse_pos = { x: event.clientX, y: event.clientY };
    });

    // Input
    window.addEventListener("keydown", (event) => {
      this.input.keydown = event.key;
    });
    window.addEventListener("keypress", (event) => {
      if (this.input.keypressed == null) {
        this.input.keypressed = event.key;

        setTimeout(() => {
          this.input.keypressed = null;
        }, 10);
      }
    });
    window.addEventListener("keyup", (event) => {
      this.input.keyup = event.key;
      this.input.keydown = null;

      setTimeout(() => {
        this.input.keyup = null;
      }, 10);
    });

    window.requestAnimationFrame(() => this.update());
  },

  update: function () {
    window.requestAnimationFrame(() => this.update());
    this.context.clearRect(0, 0, this.display.width, this.display.height);

    // Fps and delta calculation
    const now = performance.now();

    if (this.times.length > 0) {
      this.deltaTime = now - this.times[this.times.length - 1];
    }

    while (this.times.length > 0 && this.times[0] <= now - 1000) {
      this.times.shift();
    }
    this.times.push(now);
    this.fps = this.times.length;

    // Update object drawing
    for (let i = 0; i < this.objects.length; i++) {
      this.objects[i].update();
    }
  },

  // Utitlty functions
  object: function ({
    width,
    height,
    x,
    y,
    colour,
    image,
    tile,
    text,
    text_size,
    font,
    word_wrap,
    line_height,
  }) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.colour = colour;

    let ctx = poopengine.context;

    // Image logic
    if (image != undefined) {
      this.image = new Image();
      this.image.src = image;
      if (tile == undefined || tile == false) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
      } else {
        this.pattern = ctx.createPattern(this.image, "repeat");
        ctx.fillStyle = this.pattern;
        ctx.fillRect(this.x, this.y, this.width, this.height);
      }
    }
    // Text logic
    else if (text != undefined) {
      ctx.fillStyle = this.colour;
      this.text = text;
      this.text_size = text_size;
      if (font != undefined) {
        this.font = font;
        ctx.font = String(text_size + "px " + font);
      } else {
        ctx.font = String(text_size + "px Arial");
      }

      ctx.fillText(this.text, this.x, this.text_size + this.y, this.width);
    }
    // Box logic
    else {
      ctx.fillStyle = this.colour;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    this.update = function () {
      // Image logic
      if (image != undefined) {
        if (tile == undefined || tile == false) {
          ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        } else {
          this.pattern = ctx.createPattern(this.image, "repeat");
          ctx.fillStyle = this.pattern;
          ctx.fillRect(this.x, this.y, this.width, this.height);
        }
      }
      // Text logic
      else if (text != undefined) {
        ctx.fillStyle = this.colour;
        if (this.font != undefined) {
          ctx.font = String(this.text_size + "px " + this.font);
        } else {
          ctx.font = String(this.text_size + "px Arial");
        }

        if (word_wrap == true) {
          this.line_height = line_height;

          const words = this.text.split(" ");
          let currentLine = words[0];
          let lineCount = 0;

          for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = ctx.measureText(currentLine + " " + word).width;

            if (width < this.width) {
              currentLine += " " + word;
            } else {
              ctx.fillText(
                currentLine,
                this.x,
                this.y + this.line_height * lineCount++ + this.text_size
              );
              currentLine = word;
            }
          }

          ctx.fillText(
            currentLine,
            this.x,
            this.y + this.line_height * lineCount + this.text_size
          );
        } else {
          ctx.fillText(this.text, this.x, this.y + this.text_size, this.width);
        }
      }
      // Box logic
      else {
        ctx.fillStyle = this.colour;
        ctx.fillRect(this.x, this.y, this.width, this.height);
      }
    };

    this.destroy = function () {
      const index = poopengine.objects.indexOf(this);

      poopengine.objects.splice(index, 1);
    };

    poopengine.objects.push(this);
    this.index = poopengine.objects.indexOf(this);
  },

  audio: function (src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function () {
      this.sound.play();
    };
    this.stop = function () {
      this.sound.pause();
      this.sound.currentTime = 0;
    };
    this.pause = function () {
      this.sound.pause();
    };
    this.loop = function (option) {
      this.sound.loop = option;
    };
  },

  // Z index logic
  move_to_top: function (object) {
    const index = this.objects.indexOf(object);
    if (index !== -1) {
      this.objects.splice(index, 1);
    }

    this.objects.push(object);
  },

  send_to_back_bg: function (object) {
    const index = this.objects.indexOf(object);

    if (index !== -1) {
      this.objects.splice(index, 1);
      this.objects.splice(1, 0, object);
    }
  },

  send_to_back: function (object) {
    const index = this.objects.indexOf(object);
    if (index !== -1) {
      this.objects.splice(index, 1);
    }

    this.objects.unshift(object);
  },

  change_index: function (object, change) {
    const index = this.objects.indexOf(object);
    const new_index = index + change;

    if (index !== -1) {
      this.objects.splice(index, 1);
      this.objects.splice(new_index, 0, object);
    }
  },

  set_index: function (object, new_index) {
    const index = this.objects.indexOf(object);

    if (index !== -1) {
      this.objects.splice(index, new_index);
      this.objects.splice(new_index, 0, object);
    }
  },

  revert_index: function (object) {
    const currentIndex = this.objects.indexOf(object);

    if (currentIndex !== -1 && typeof object.index === "number") {
      this.objects.splice(currentIndex, 1);

      this.objects.splice(object.index, 0, object);
    }
  },

  resize: function () {},

  // Animation
  animating_vals: [],
  animate_value: function (id, val, increase, speed, until, callback, finsish) {
    let isBigger;
    if (val < until) {
      isBigger = true;
    } else {
      isBigger = false;
    }
    if (!this.animating_vals.includes(id)) {
      this.animating_vals.push(id);
      const inter = setInterval(() => {
        val += increase;
        if (val >= until && isBigger) {
          if (finsish != undefined) {
            finsish()
          }
          clearInterval(inter);
          val = until;
        } else if (val <= until && !isBigger) {
          if (finsish != undefined) {
            finsish()
          }
          clearInterval(inter);
          val = until;
        }
        callback(val);
      }, speed);
    }
  },
};
