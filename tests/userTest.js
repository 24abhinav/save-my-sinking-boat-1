//should is needed for account.username.should
import should from 'should'
import mongoose from 'mongoose'
import Account from '../models/account.js'
let db

describe('Account', function() {

  before(function(done) {
    db = mongoose.connect('mongodb://localhost/test')
    done()
  })

  after(function(done) {
    mongoose.connection.close()
    done()
  })

  beforeEach(function(done) {
    var account = new Account({
      username: '12345',
      password: 'testy'
    })

    account.save(function(error) {
      if (error) console.log('error' + error.message)
      else console.log('no error')
      done()
    })
  })

  it('find a user by username', function(done) {
      Account.findOne({ username: '12345' }, function(err, account) {
        account.username.should.eql('12345')
        console.log('   username: ', account.username)
        done()
      })
  })

  afterEach(function(done) {
      Account.remove({}, function() {
        done()
      })
   })
})
