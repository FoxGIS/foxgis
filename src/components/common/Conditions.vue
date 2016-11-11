<template>
  <div class="filter">
    <div style="width: 980px;">
      <div class="condition" v-if="theme_tags.length>0">
        <strong>主题词：</strong>
        <div class="items">
          <a v-for="tag in theme_tags" @click="conditionClick($event,1)">{{ tag.tag }}
            <span>({{ tag.total }})</span>
          </a>
        </div>
        <div class="more">
          <a v-on:click.prevent="showMore" style="color: #b15ab1;">更多</a>
        </div>
      </div>
      <div class="condition" v-if="location_tags.length>0">
        <strong>制图区域：</strong>
        <div class="items">
          <a v-for="location in location_tags"
                @click="conditionClick($event,2)">{{ location.location }}
                <span>({{ location.total }})</span>
          </a>
        </div>
        <div class="more">
          <a v-on:click.prevent="showMore" style="color: #b15ab1;">更多</a>
        </div>
      </div>
      <div class="condition" v-if="year_tags.length>0">
        <strong>制图年份：</strong>
        <div class="items">
          <a v-for="year in year_tags | orderBy" @click="conditionClick($event,3)">{{ year.year }}
            <span>({{ year.total }})</span>
          </a>
        </div>
        <div class="more">
          <a v-on:click.prevent="showMore" style="color: #b15ab1;">更多</a>
        </div>
      </div>
    </div>
  </div> 
</template>


<script>
import Cookies from 'js-cookie'
export default {
  methods:{
    showMore:function(e){//隐藏或显示“标签”的“更多”按钮
      var $item = $(e.target).parent(".more").prev();
      if(e.target.innerHTML==="更多"){
        $item.css({
          "max-height":"none",
          "overflow":"auto"
        });
        e.target.innerHTML = "收起";
      }else{
        $item.scrollTop(0);
        $item.css({
          "max-height":"40px",
          "overflow":"hidden"
        });
        e.target.innerHTML = "更多";
      }
    }
  },
  attached() {
    var username = Cookies.get('username');
    if(username === undefined){
      window.location.href = "#!/login";
    }
    var access_token = Cookies.get('access_token');

    //获取制图区域统计信息
    var locationUrl = SERVER_API.stats+"/location";
    this.$http({ url: locationUrl, method: 'GET', headers: { 'x-access-token': access_token } })
    .then(function(response) {
      if (response.data.length > 0) {
        var data = response.data;
        for(let i=0;i<data.length;i++){
          if(!data[i].location){
            data[i].location = "未指定";
          }
        }
        this.location_tags = data;
      }
    },function(response){
      this.$broadcast('mailSent', { message: '获取制图地区失败！',timeout:3000 });
    });

    //获取制图年份统计信息
    var yearUrl = SERVER_API.stats+"/year";
    this.$http({ url: yearUrl, method: 'GET', headers: { 'x-access-token': access_token } })
    .then(function(response) {
      if (response.data.length > 0) {
        var data = response.data;
        for(let i=0;i<data.length;i++){
          if(!data[i].year){
            data[i].year = "未指定";
          }
        }
        this.year_tags = data;
      }
    },function(response){
      this.$broadcast('mailSent', { message: '获取制图年份失败！',timeout:3000 });
    });

    //获取主题词统计信息
    var tagUrl = SERVER_API.stats+"/tags";
    this.$http({ url: tagUrl, method: 'GET', headers: { 'x-access-token': access_token } })
    .then(function(response) {
      if (response.data.length > 0) {
        var data = response.data;
        this.theme_tags = data;
      }
    },function(response){
      this.$broadcast('mailSent', { message: '获取主题词失败！',timeout:3000 });
    });
  },
  data() {
    return {
      location_tags:[],
      year_tags:[],
      theme_tags:[]
    }
  }

}

</script>


<style scoped>
.filter {
  margin:5px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.filter span {
  width: 70px;
  display: inline-block;
  font: normal 14px/5px "SimSun";
}

.filter .condition {
  margin: 2px 0;
  border: none;
}

.filter .condition a {
  cursor: pointer;
  text-decoration: none;
  margin-left: 10px;
  font-size: .9em;
  color: #666;
}

.filter .condition a span {
  width: auto;
  color: #3f51b5;
}

.filter .condition .active{
  cursor: pointer;
  color: blue;
  display: inline-block;
}

.condition{
  position: relative;
  border-bottom: 1px dashed #c3c1c1;
}

.condition strong{
  position: absolute;
  left: 0;
  top: 3px;
  width: 80px;
  height: 18px;
  color: #666;
  text-align: right;
}

.condition .items{
  padding: 3px 0px 3px 83px;
  position: relative;
  zoom: 1;
  width: 860px;
  overflow: hidden;
  max-height: 40px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
}

.condition .more{
  position: absolute;
  right: -7px;
  top: 0px;
  width: 45px;
  overflow: hidden;
}
</style>
