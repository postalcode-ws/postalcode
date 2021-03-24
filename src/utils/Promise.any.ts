const reverse = <R>(promise: R | PromiseLike<R>): Promise<any> =>
  new Promise((resolve, reject) =>
    Promise.resolve(promise).then(reject, resolve)
  );

Promise.any = <T>(
  values: (T | PromiseLike<T>)[] | Iterable<T | PromiseLike<T>>
): Promise<T> => {
  return reverse(Promise.all([...values].map(reverse)));
};

export default Promise;
