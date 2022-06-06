export function keyboard(key) {
  let o = {};
  o.key = key;
  o.isDown = false;
  o.isUp = true;
  o.press = undefined;
  o.release = undefined;

  // Down handler
  o.downHandler = function (event) {
    if (event.key === o.key) {
      if (o.isUp && o.press) o.press();

      o.isDown = true;
      o.isUp - false;
    }
    event.preventDefault();
  };

  // upHandler
  o.upHandler = function (event) {
    if (event.key === o.key) {
      if (o.isDown && o.release) o.release();
      o.isDown = false;
      o.isUp = true;

      event.preventDefault();
    }
  };

  // attach event listeners
  window.addEventListener("keydown", o.downHandler.bind(o), false);

  window.addEventListener("keyup", o.upHandler.bind(o), false);

  // return the key ('o') object
  return o;
}
