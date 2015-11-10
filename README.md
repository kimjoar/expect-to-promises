expect-to-promises
==================

Promise assertions for [expect-to](https://github.com/kjbekkelund/expect-to).

Installation
------------

```
npm install --save-dev expect-to-promises
```

Assertions
----------

- `eventually`

  ```javascript
  const foo = Promise.resolve('foo');

  expect(foo).to(eventually(equal('foo')));
  expect(foo).to(eventually(not(equal('bar'))));

  const obj = Promise.resolve({ name: 'kim' });
  expect(obj).to(eventually(deepEqual({ name: 'kim' })));
  ```
- `beFulfilled`

  ```javascript
  const foo = Promise.resolve('foo');
  expect(foo).to(beFulfilled);
  ```
- `beRejected`

  ```javascript
  const err = Promise.reject(new Error('bar'));
  expect(err).to(beRejected);
  ```

