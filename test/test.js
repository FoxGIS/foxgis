describe('Data.vue test', function() {
  var should = require('should')
  var Vue = require('vue')
  var DataCardsData = require('../src/components/Data.vue');
  it('Data should render correct contents', function() {
    DataCardsData.data().dataset.length.should.be.eql(4)
  });
  it('Data should set correct default data', function() {
    DataCardsData.data.should.be.type('function')
    //console.log(myComponent);
  });
});
