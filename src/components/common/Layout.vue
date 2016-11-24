<template>
<div class="foxgis-layout">
  <div class="mdl-layout mdl-js-layout">
    <header class="mdl-layout__header mdl-layout__header--seamed">
      <div class="header-top">
        <div class="header">
          <div class="base-title">
            <span>辅助决策用图服务系统</span>
          </div>
          <div class="contact-us">
            <a href="javascript:void(0);">关于我们 </a>|
            <a href="javascript:void(0);">意见反馈 </a>|
            <a href="javascript:void(0);">联系我们 </a>|
            <a href="/static/document/用户手册.doc">帮助</a>
          </div>
        </div>
      </div>
      <div class="mdl-layout__header-row">
        <div class="mdl-layout-title">
          <span>辅助决策用图</span>
        </div>
        <nav class="mdl-navigation">
          <a class="mdl-navigation__link" v-link="{ path: '/home' }" v-bind:class="username==undefined?'disabled':''" >
            <div><svg class="icon" width="24px" height="24.00px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="#333" d="M949.082218 519.343245 508.704442 107.590414 68.326667 518.133697c-8.615215 8.03193-9.096169 21.538549-1.043772 30.144554 8.043187 8.599865 21.566178 9.085936 30.175253 1.035586l411.214573-383.337665 411.232992 384.505257c4.125971 3.854794 9.363252 5.760191 14.5903 5.760191 5.690606 0 11.384281-2.260483 15.58393-6.757914C958.138478 540.883841 957.695387 527.388479 949.082218 519.343245L949.082218 519.343245zM949.082218 519.343245M814.699602 527.800871c-11.787464 0-21.349237 9.555633-21.349237 21.327748l0 327.037405L622.552373 876.166023 622.552373 648.662543 394.824789 648.662543l0 227.503481L224.032938 876.166023 224.032938 549.128619c0-11.772115-9.55154-21.327748-21.348214-21.327748-11.802814 0-21.35333 9.555633-21.35333 21.327748l0 369.691877 256.19494 0L437.526333 691.318038l142.329613 0 0 227.502457 256.1888 0L836.044746 549.128619C836.045769 537.356504 826.481949 527.800871 814.699602 527.800871L814.699602 527.800871zM814.699602 527.800871M665.254941 222.095307l128.095423 0 0 113.74867c0 11.789511 9.562796 21.332864 21.349237 21.332864 11.783371 0 21.346167-9.543354 21.346167-21.332864L836.045769 179.439812 665.254941 179.439812c-11.789511 0-21.35333 9.538237-21.35333 21.327748C643.900587 212.554 653.464407 222.095307 665.254941 222.095307L665.254941 222.095307zM665.254941 222.095307"  /></svg></div>
            <div><span>首页</span></div>
          </a>
          <a class="mdl-navigation__link" v-link="{ path: '/atlas' }" v-bind:class="username==undefined?'disabled':''">
            <div><svg class="icon" width="24px" height="24.00px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="#333" d="M957.217391 897.001739 193.26887 897.001739c-36.819478 0-66.782609-29.96313-66.782609-66.782609L126.486261 66.782609c0-36.819478 29.96313-66.782609 66.782609-66.782609L957.217391 0c36.819478 0 66.782609 29.96313 66.782609 66.782609l0 763.436522C1024 867.038609 994.03687 897.001739 957.217391 897.001739zM193.26887 44.521739c-12.265739 0-22.26087 9.99513-22.26087 22.26087l0 763.436522c0 12.265739 9.99513 22.26087 22.26087 22.26087L957.217391 852.48c12.265739 0 22.26087-9.99513 22.26087-22.26087L979.478261 66.782609c0-12.265739-9.99513-22.26087-22.26087-22.26087L193.26887 44.521739z"  /><path fill="#333" d="M796.672 1024 66.782609 1024c-36.819478 0-66.782609-29.96313-66.782609-66.782609L0 221.005913l44.521739 0L44.521739 957.217391c0 12.265739 9.99513 22.26087 22.26087 22.26087l729.889391 0L796.672 1024z"  /></svg></div>
            <div><span>图集</span></div>
          </a>
          <a class="mdl-navigation__link" v-link="{ path: '/studio' }" v-bind:class="username==undefined?'disabled':''">
            <div><svg class="icon" width="24px" height="24.00px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="#333" d="M173.599753 200.073758 196.923903 223.437885 101.397426 319.001381 175.832699 393.430534 271.902574 297.447483 293.711146 319.255161 197.6382 415.238212 271.144273 488.741273 489.517553 270.420943 223.656827 6.086625 6.085851 223.691665 78.076345 295.637254Z"  /><path fill="#333" d="M753.609934 534.460548 535.194697 752.863766 608.70077 826.325895 704.773715 730.299865 726.58024 752.108566 630.510365 848.175529 705.025459 922.603659 800.59287 827.041186 823.917021 850.364381 728.349609 945.927877 800.298146 1017.914398 1017.913125 800.308335Z"  /><path fill="#333" d="M982.380432 255.094886c26.647985-26.646893 26.818884-69.628824 0.420596-96.025007L863.322064 39.553854c-26.438199-26.39516-69.380956-26.185382-96.029965 0.421602L693.490279 113.815185l215.089356 215.122499L982.380432 255.094886z"  /><path fill="#333" d="M33.913757 988.866828 138.278892 950.811094 71.930117 884.464013Z"  /><path fill="#333" d="M83.042654 850.406337 172.336941 939.695942 352.187305 875.791493 146.950744 670.562319Z"  /><path fill="#333" d="M670.253113 135.705752 163.623132 642.315998l216.814721 216.805838 506.628957-506.652202L670.253113 135.705752zM262.052848 641.895419l407.777622-407.763984 23.744747 23.74275L285.796572 665.637146 262.052848 641.895419zM309.539271 689.423899l407.782738-407.80594 23.785681 23.743774L333.325975 713.165626 309.539271 689.423899zM357.069699 736.951355l407.780692-407.80594 23.744747 23.744797L380.857426 760.696152 357.069699 736.951355z"  /></svg></div>
            <div><span>制图</span></div>
          </a>
          <a class="mdl-navigation__link" v-link="{ path: '/stats' }" v-bind:class="username==undefined?'disabled':''" >
            <div><svg class="icon" width="24px" height="24.00px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="#333" d="M291.831322 417.665015 112.710167 417.665015l-0.960749 0c-18.384935 0-33.116547 15.349993-33.116547 34.383088L78.632871 923.898589l0 1.433028c0 18.538231 14.760392 34.128661 33.116547 34.128661l179.208497 0 0.873408 0c18.457886 0 33.334799-15.59043 33.334799-34.128661L325.166121 452.77561l0-0.727507C325.195102 433.015008 310.289208 417.665015 291.831322 417.665015zM285.921329 917.31805 117.921633 917.31805 117.921633 459.821433l167.999696 0L285.921329 917.31805zM601.395238 65.100054l-179.368988 0-0.843428 0c-18.254623 0-33.131537 15.139136-33.131537 34.696476L388.051285 923.898589l0 1.433028c0 18.531436 14.876913 34.128661 33.131537 34.128661l179.252067 0 0.960349 0c18.545426 0 33.597221-15.597425 33.597221-34.128661L634.992459 100.742289l0-0.938963C634.992259 80.23919 619.940464 65.100054 601.395238 65.100054zM593.243765 920.68077l-163.428795 0L429.814969 103.879562l163.428795 0L593.243765 920.68077zM910.668751 248.908432l-179.048205 0-1.048289 0c-18.603387 0-33.51028 15.437533-33.51028 34.419663l0 640.577488 0 1.441023c0 18.538431 14.906893 34.120866 33.51028 34.120866l179.135146 0 0.961348 0c18.370545 0 33.014616-15.597425 33.014616-34.120866L943.683367 284.31023l0-0.982334C943.712147 264.345965 929.039295 248.908432 910.668751 248.908432zM904.205133 921.554178l-167.664923 0 0.02898-634.732451 167.635943 0L904.205133 921.554178z"  /></svg></div>
            <div><span>统计</span></div>
          </a>
          <a class="mdl-navigation__link" v-link="{ path: '/login' }" v-if="username==undefined">
            <div><svg class="icon" width="24px" height="24.00px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="#333" d="M508.033024 951.552c-245.481472 0-444.391424-198.934528-444.391424-444.416 0-245.4272 198.909952-444.416 444.391424-444.416 245.4272 0 444.416 198.9888 444.416 444.416C952.449024 752.617472 753.460224 951.552 508.033024 951.552L508.033024 951.552zM605.466624 667.119616l17.765376-15.568896c0 0 4.477952-40.741888 12.20608-55.525376 17.3056-33.173504 35.533824-88.889344 35.533824-88.889344s17.769472-12.911616 17.769472-35.533824c0-22.59456-17.769472-35.588096-17.769472-35.588096s6.70208-62.92992 6.70208-106.65472c0-91.845632-57.667584-142.216192-161.339392-142.216192-103.563264 0-179.187712 42.8032-179.187712 142.216192 0 43.7248 13.888512 106.65472 13.888512 106.65472s-17.823744 12.992512-17.823744 35.588096c0 22.622208 17.823744 35.533824 17.823744 35.533824s20.723712 64.502784 35.533824 88.889344c8.650752 14.239744 12.230656 55.525376 12.230656 55.525376l17.769472 15.568896c0 0 8.408064 90.164224-17.769472 106.655744-23.653376 14.891008-124.745728 34.556928-149.320704 48.932864 1.488896 1.54624 109.585408 94.747648 261.671936 94.747648 152.092672 0 260.429824-93.553664 260.429824-95.290368-26.257408-14.29504-124.992512-33.6896-148.348928-48.391168C597.028864 757.282816 605.466624 667.119616 605.466624 667.119616L605.466624 667.119616z"  /></svg></div>
            <div style="border:none;"><span>登录</span></div>
          </a>
          <a class="mdl-navigation__link" v-link="{ path: '/user' }" v-else>
            <div><svg class="icon" width="24px" height="24.00px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path fill="#333" d="M508.033024 951.552c-245.481472 0-444.391424-198.934528-444.391424-444.416 0-245.4272 198.909952-444.416 444.391424-444.416 245.4272 0 444.416 198.9888 444.416 444.416C952.449024 752.617472 753.460224 951.552 508.033024 951.552L508.033024 951.552zM605.466624 667.119616l17.765376-15.568896c0 0 4.477952-40.741888 12.20608-55.525376 17.3056-33.173504 35.533824-88.889344 35.533824-88.889344s17.769472-12.911616 17.769472-35.533824c0-22.59456-17.769472-35.588096-17.769472-35.588096s6.70208-62.92992 6.70208-106.65472c0-91.845632-57.667584-142.216192-161.339392-142.216192-103.563264 0-179.187712 42.8032-179.187712 142.216192 0 43.7248 13.888512 106.65472 13.888512 106.65472s-17.823744 12.992512-17.823744 35.588096c0 22.622208 17.823744 35.533824 17.823744 35.533824s20.723712 64.502784 35.533824 88.889344c8.650752 14.239744 12.230656 55.525376 12.230656 55.525376l17.769472 15.568896c0 0 8.408064 90.164224-17.769472 106.655744-23.653376 14.891008-124.745728 34.556928-149.320704 48.932864 1.488896 1.54624 109.585408 94.747648 261.671936 94.747648 152.092672 0 260.429824-93.553664 260.429824-95.290368-26.257408-14.29504-124.992512-33.6896-148.348928-48.391168C597.028864 757.282816 605.466624 667.119616 605.466624 667.119616L605.466624 667.119616z"  /></svg></div>
            <div style="border:none;"><span>{{username}}</span></div>
          </a>
        </nav>
      </div>
    </header>

    <div class="mdl-layout--content">
      <slot>Layout content</slot>
    </div>

  </div>
</div>
</template>


<script>
import Cookies from 'js-cookie'
export default {
  methods: {
    signout: function(){
      Cookies.remove('username');
      Cookies.remove('access_token');
      Cookies.remove('name');
      Cookies.remove('phone');
      Cookies.remove('email');
      Cookies.remove('location');
      Cookies.remove('organization');
      window.location.href = '/';
    },

    showUserCenter: function(){
      if(document.querySelector('.userCenter').style.display === 'none'){
        document.querySelector('.userCenter').style.display = 'block';
      }else{
        document.querySelector('.userCenter').style.display = 'none';
      }
      
    }
  },
  ready() {
    /*global componentHandler */
    componentHandler.upgradeElement(this.$el.firstElementChild);
  },
  attached: function() {
    //判断是否登陆
    var username = Cookies.get('username');
    if(username !== undefined){
      this.username = username;
    }
  },
  data: function(){
    return {
      username: undefined
    }
  }
}

</script>


<style scoped>
.mdl-layout__header {
  height: 85px;
  background-color: white;
}

.header-top{
  background-color: #1f57a2;
  height: 25px;
}
.header-top .header{
  width: 1100px;
  height: 100%;
  background-image: url("../../../static/images/header.jpg");
  background-repeat: no-repeat;
  background-position: 65px -10px;
  margin:0 auto;
}
.base-title{
  float: left;
}
.base-title span{
  color: white;
  /* background-image: -webkit-gradient(linear, 0 0, 0 bottom, from(rgba(255, 255, 255, 1)), to(rgba(222, 222, 222, 1)));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent; */
  font-size: 20px;
}
.contact-us{
  color: #b1b1b1;
  float: right;
  margin-right: 10px;
}

.contact-us a{
  color: #b1b1b1;
  text-decoration: none;
  font-size: 14px;
}

.mdl-layout.has-drawer .mdl-layout__header > .mdl-layout-icon {
  display: block;
  width: 48px;
  height: 48px;
  top: 8px;
}

.mdl-layout__header-row {
  height: 60px;
  width: 1100px;
  margin:0 auto;
  padding: 0;
}

.mdl-layout__header-row .mdl-layout-title span{
  color: #2f80bc;
  font-family: SimHei;
  font-size: 26px;
}

.mdl-navigation{
  line-height: 30px;
  position: relative;
  height: 100%;
  left: 100px;
}

.mdl-layout__header-row .mdl-navigation__link.v-link-active{
  background-color: rgb(15, 109, 178);
  color: white;
}
.v-link-active svg path{
  fill:#ffffff;
}
.v-link-active span{
  color:#ffffff;
}
.mdl-layout__header-row .mdl-navigation__link {
  font-size: 1em;
  line-height: 50px;
  padding: 0;
  cursor: pointer;
  width: 150px;
  text-align: center;
  color: #313131;
}
.mdl-navigation__link div{
  width: 100%;
  height: 30px;
  margin: 0 auto;
}
.mdl-navigation__link div:last-child{
  border-right: 1px solid #c3c3c3;
}
.mdl-navigation__link svg{
  width: 24px;
  height: 24px;
  position: relative;
  bottom: 10px;
}
.mdl-navigation__link span{
  position: relative;
  bottom: 10px;
}
.mdl-layout--content {
  height: 100%;
  position:relative;
  min-height: calc(100% - 100px);
  background-color: #e4e4e4;
  display: flex;
  flex-flow: column;
  overflow: auto;
}

a.disabled {
   pointer-events: none;
   cursor: default;
}

.download_link{
  cursor: pointer;
}

.userCenter{
  height: 60px;
  width: 110px;
  z-index: 9999;
  position: absolute;
  right: 0;
  background-color: #3f51b5;
  text-align: center;
  line-height: 30px;
  display: none;
}

.userCenter a{
  display: inherit;
  cursor: pointer;
  color: #fff;
  text-decoration: none;
}

</style>
