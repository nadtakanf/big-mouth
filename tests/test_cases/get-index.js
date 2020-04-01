'use strict'

const { expect } = require('chai')
const when = require('../steps/when')
const { init } = require('../steps/init')
const cheerio = require('cheerio')

describe(`When we invoke GET / endpoint`, () => {

    before(async () => {
      await init()
    })

    it(`Should return the index page with 8 restaurants`, async () => {
				const res = await when.we_invoke_get_index()
				
        expect(res.statusCode).to.equal(200)
        expect(res.headers['content-type']).to.equal('text/html; charset=UTF-8')
				expect(res.body).to.not.be.null
				
				// this testing is for counting element of restaurants jquery 
				let $ = cheerio.load(res.body);
				let restaurants = $('.restaurant', '#restaurantsUl')
				
				expect(restaurants.length).to.equal(8)
		})
})