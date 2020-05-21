<template>
  <div class="withdrawquota">
    <my-header title="限额说明" bkUrl="/withdraw"></my-header>
    <div class="quota-txt">
        <br>
        1、单笔限额：最低100元，最高1000000元。
        <br><br>
       2、单日限额：最高5000000元。<br><br>
       3、提现次数：每日最高5次（免手续费3次）<br><br>
       4、到账时间：T+1到账（审核通过次日24点前到账）<br>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {

    };
  },
  methods: {

  }
};
</script>

<style scoped>
.withdrawquota{
    width: 100%;
}
.quota-txt{
    color: #666;
    padding: 10px;
    font-size: 14px;
}
</style>