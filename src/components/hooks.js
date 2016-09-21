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
export function call_hook(hook) {
  var result;
  const call_args = Array.prototype.slice.call(arguments, 1);

  if (hook in registry) {
    result = registry[hook].reduce((function(args) {

      return function(previousResult, currentAction) {
        const interimResult = currentAction.apply({
          state: previousResult,
          hook: hook,
        }, args);
        return (interimResult !== undefined)? interimResult : previousResult;
      };

    })(call_args), result);
  }

  return result;
}

/**
 * Filter a value through hooked functions
 *
 * Allows for additional parameters:
 * js> do_filter('foo', null, current_element)
 */
export function do_filter(hook, initial_value) {
  var result = initial_value;
  var call_args = Array.prototype.slice.call(arguments, 1);

  if (hook in registry) {
    result = registry[hook].reduce(function(previousResult, currentAction) {
      call_args[0] = previousResult;
      const interimResult = currentAction.apply({
        state: previousResult,
        hook: hook,
      }, call_args);
      return (interimResult !== undefined)? interimResult : previousResult;
    }, result);
  }

  return result;
}

/**
 * remove an action again
 */
export function remove_hook(hook, action) {
  if (hook in registry) {
    for (let i = 0; i < registry[hook].length; i++) {
      if (registry[hook][i] === action) {
        registry[hook].splice(i, 1);
        break;
      }
    }
  }
}
export { remove_hook as remove_filter };

/**
 * add an action to a hook
 */
export function add_hook(hook, action, position) {
  if (! (hook in registry)) {
    registry[hook] = [];
  }
  if (position === undefined) {
    position = registry[hook].length;
  }
  registry[hook].splice(position, 0, action);
}
export { add_hook as add_filter };
