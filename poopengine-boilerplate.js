import { poopengine } from "../lib/poopengine.mjs";

const originalStart = poopengine.start;
poopengine.start = function () {
  originalStart.apply(this);
  // Code goes here:
}

const originalUpdate = poopengine.update;
poopengine.update = function () {
  originalUpdate.apply(this);
  // Code goes here:
}

poopengine.resize = function () {
  // Code goes here:
}

poopengine.start();