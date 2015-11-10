/* eslint-env mocha */

import expect from 'expect-to'
import Promise from 'bluebird'
import { equal, not, throws } from 'expect-to-core'
import { eventually, beFulfilled, beRejected } from './src'

describe('expect-to-promises', () => {
  describe('eventually', () => {
    it('throws when not given a promise', () => {
      expect(() => {
        expect('foo').to(eventually(equal('foo')))
      }).to(throws('Invariant Violation: `actual` is not a promise'))
    })

    it('throws when eventually is wrapped in a not', () => {
      expect(() => {
        expect('foo').to(not(eventually(equal('foo'))))
      }).to(throws("Invariant Violation: `eventually` can't be wrapped in a `not`, use `eventually(not(...))` instead"))
    })

    context('when resolved', () => {
      it('handles inner assertion', (done) => {
        const exp = Promise.resolve('foo')
        expect(exp).to(eventually(equal('foo')))
          .then(done)
      })

      it('handles inner assertion with not', (done) => {
        const exp = Promise.resolve('foo')
        expect(exp).to(eventually(not(equal('bar'))))
          .then(done)
      })

      it('handles inner assertion', (done) => {
        const exp = Promise.resolve('foo')
        expect(exp).to(eventually(equal('bar')))
          .catch(e => {
            expect(e.message).to(equal('Expected "foo" to equal "bar"'))
            done()
          })
      })
    })

    context('when rejected', () => {
      it('rejects with the expected error', (done) => {
        const exp = Promise.reject(new Error('test'))
        expect(exp).to(eventually(equal('foo')))
          .catch(e => {
            expect(e.message).to(equal('Expected to eventually resolve, but was rejected'))
            done()
          })
      })
    })
  })

  describe('beFulfilled', () => {
    context('when fulfilled', () => {
      it('succeeds', (done) => {
        const exp = Promise.resolve('foo')
        expect(exp).to(beFulfilled)
          .then(done)
      })
    })

    context('when rejected', () => {
      it('fails', (done) => {
        const exp = Promise.reject(new Error('test'))
        expect(exp).to(beFulfilled)
          .catch(e => {
            expect(e.message).to(equal('Expected promise to be fulfilled'))
            done()
          })
      })
    })
  })

  describe('beRejected', () => {
    context('when rejected', () => {
      it('succeeds', (done) => {
        const exp = Promise.reject(new Error('test'))
        expect(exp).to(beRejected)
          .then(done)
      })
    })

    context('when fulfilled', () => {
      it('succeeds', (done) => {
        const exp = Promise.resolve('foo')
        expect(exp).to(beRejected)
          .catch(e => {
            expect(e.message).to(equal('Expected promise to be rejected, but resolved to "foo"'))
            done()
          })
      })
    })
  })
})
