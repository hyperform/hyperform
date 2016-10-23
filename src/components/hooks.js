'use strict';


const registry = Object.create(null);


/**
 * run all actions registered for a hook
 *
 * Every action gets called with a state object as `this` argument and with the
 * hook's call arguments as call arguments.
 *
 * @return mixed the returned value of the action calls or undefined
 */
export function callHook(hook) {
  var result;
  const callArgs = Array.prototype.slice.call(arguments, 1);

  if (hook in registry) {
    result = registry[hook].reduce((function(args) {

      return function(previousResult, currentAction) {
        const interimResult = currentAction.apply({
          state: previousResult,
          hook: hook,
        }, args);
        return (interimResult !== undefined)? interimResult : previousResult;
      };

    })(callArgs), result);
  }

  return result;
}

/**
 * Filter a value through hooked functions
 *
 * Allows for additional parameters:
 * js> doFilter('foo', null, currentElement)
 */
export function doFilter(hook, initialValue) {
  var result = initialValue;
  var callArgs = Array.prototype.slice.call(arguments, 1);

  if (hook in registry) {
    result = registry[hook].reduce(function(previousResult, currentAction) {
      callArgs[0] = previousResult;
      const interimResult = currentAction.apply({
        state: previousResult,
        hook: hook,
      }, callArgs);
      return (interimResult !== undefined)? interimResult : previousResult;
    }, result);
  }

  return result;
}

/**
 * remove an action again
 */
export function removeHook(hook, action) {
  if (hook in registry) {
    for (let i = 0; i < registry[hook].length; i++) {
      if (registry[hook][i] === action) {
        registry[hook].splice(i, 1);
        break;
      }
    }
  }
}
export { removeHook as removeFilter };

/**
 * add an action to a hook
 */
export function addHook(hook, action, position) {
  if (! (hook in registry)) {
    registry[hook] = [];
  }
  if (position === undefined) {
    position = registry[hook].length;
  }
  registry[hook].splice(position, 0, action);
}
export { addHook as addFilter };
