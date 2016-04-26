describe('Data.vue test', function() {
  var should = require('should')
  var Vue = require('vue')
  var Data = require('../src/components/Data.vue');
  var DataCardsData = require('../src/components/DataCards-Data')
  Vue.component('foxgis-data-cards-data', DataCardsData)
  it('Data should render correct contents', function() {
    let vm = new Vue({
        template: '<div><test v-ref:test-component></test></div>',
        components: {
          'test': Data
        }
    }).$mount();
    var modal = vm.$refs.testComponent;
    vm.$el.querySelectorAll('.card').length.should.be.eql(4)
  });
  it('Data should set correct default data', function() {
    Data.data.should.be.type('function')
    //console.log(myComponent);
  });
  it('data-card should render correct contents',function(){
    let vm = new Vue({
        template: "<div><test :dataset='dataset'></test></div>",
        components: {
          'test': DataCardsData
        },
        data: {
          dataset:[{
            filename: '全国人口分布数据',
            type: 'geojson',
            filesize: '200 MB',
            upload_at: '2016-3-25'
          }]
        }
    }).$mount();
    vm.$el.querySelectorAll('.card').length.should.be.eql(1)
  })
});
