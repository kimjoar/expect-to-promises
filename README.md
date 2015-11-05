expect-to-promises
==================

Promise assertions for [expect-to](https://github.com/kjbekkelund/expect-to).

Assertions
----------

For now we only have the first basic assertion in place:

- `eventually`

  ```javascript
  const foo = Promise.resolve('foo');

  expect(foo).to(eventually(equal('foo')));
  expect(foo).to(eventually(not(equal('bar'))));

  const obj = Promise.resolve({ name: 'kim' });
  expect(obj).to(eventually(deepEqual({ name: 'kim' })));
  ```
