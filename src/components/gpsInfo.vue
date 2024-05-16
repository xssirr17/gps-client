<template>
    <div v-for="(item, index) in gpsInfo" :key="index" class="container">
      <div v-if="imei == item.imei">
        <li v-for="(value, key, index) in item" :key="index" class="item">
          <strong>{{ key }} : {{ value }}</strong>
        </li>
      </div>
    </div>
</template>

<script setup>
// defineProps(["gpsInfo", "imei"]);
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10rem;
  width: 200px;
  
}
.item {
    margin-bottom: 10px;
  color: rgb(3, 8, 12);
  line-height: 30px;
  background: gray;
  padding-left: 5px;
  border-radius: 5px;
}
.item:hover{
    color: brown;
    cursor: pointer;
}
</style>
