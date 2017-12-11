/**
 * @fileOverview Utility to memoize functions
 * @author Nishant Jain
 */

/**
 * Memoize stores the results of expensive function calls
 * and returns the cached result when the same inputs occur again.
 * @param  {Function} fn Accepts the function to be memoized.
 * @return {Function} memoizedFunction
 */
const memoize = (fn) => {
  const cache = {};
  return (...args) => {
    const stringifiedArgs = JSON.stringify(args);
    cache[stringifiedArgs] = cache[stringifiedArgs] || fn(...args);
    return cache[stringifiedArgs];
  };
};

module.exports = memoize;
