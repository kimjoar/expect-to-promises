/* eslint-env mocha */

import expect from 'expect-to'
import Promise from 'bluebird'
import { equal, not, throws } from 'expect-to-core'
import { eventually } from './src'

describe('expect-to-promises', () => {
  describe('eventually', () => {
    it('throws when not given a promise', () => {
      expect(() => {
        expect('foo').to(eventually(equal('foo')))
      }).to(throws('Invariant Violation: `actual` is not a promise'))
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
})
