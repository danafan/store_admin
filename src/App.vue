<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  // import resource from './api/resource.js'
  export default {
    created(){
      this.$router.push('index')
      // resource.checkLogin().then(res => {
      //   if(res.data.code != 10000){
      //     let tab = sessionStorage.getItem("tab");
      //     if(!tab || tab == '/'){
      //       this.$router.push('/trade_order')
      //     }else{
      //       this.$router.push(tab)
      //     }
      //   }else{
      //     this.$message.warning(res.data.msg)
      //   }
      // })
    }

  }
</script>
