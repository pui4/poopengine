const originalStart = poopengine.start;
poopengine.start = function () {
  originalStart.apply(this);

  const box = poopengine.create_object({
    width: 50,
    height: 50,
    x: 0,
    y: 0,
    colour: 'red'
  });
}

const originalUpdate = poopengine.update;
poopengine.update = function () {
  originalUpdate.apply(this);
  // Code goes here:
  console.log("hello from not_main");
}

poopengine.resize = function () {
  // Code goes here:
}

poopengine.start();
