<template>
  <table class="dynamic-table">
    <thead>
      <tr>
        <th>index</th>
        <th v-for="(header, index) in headers" :key="index">{{ header }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, rowIndex) in tableData" :key="rowIndex">
        <td>
          <p>{{ rowIndex + 1 }}</p>
        </td>
        <td v-for="(cell, key, cellIndex) in row" :key="cellIndex">
          <p
            v-if="
              cell != 'show' &&
              cell != 'delete' &&
              key != 'create_at' &&
              key != 'time' && 
              key!='angle'
            "
          >
            {{ cell }}
          </p>
          <p v-if="cell == 'show'">
            <i class="fa fa-desktop iconDesktop" @click="showLimit(row)"></i>
          </p>
          <p v-if="cell == 'delete'">
            <i
              class="fa fa-trash iconTrash"
              @click="removeLimit(limits[rowIndex].limit_id)"
            ></i>
          </p>
          <p v-if="key == 'create_at' || key == 'time'">
            {{ new Date(cell).toLocaleString() }}
          </p>
          <p v-if="key == 'angle'">{{ parseFloat(cell).toFixed(1) }}</p>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: {
    headers: Array, // Array of table header names
    tableData: Array, // Array of arrays representing table data
    limits: Array, // Array of arrays representing table data
  },
};
</script>
<script setup>
import { toast } from "vue3-toastify";
import axios from "../service/axiosInstance";
import router from "../router";

const removeLimit = (limit_id) => {
  axios
    .post("/user/deleteLimit", {
      limit_id: limit_id,
    })
    .then((response) => {
      if (response.data.code != 200) {
        toast.error("somthing went wrong when deleting limit", {
          autoClose: 3000,
        });
      } else {
        toast.success("limit deleted successfully", {
          autoClose: 3000,
        });
      }
    })
    .catch((error) => {
      console.log(error);
      toast.error("somthing went wrong", {
        autoClose: 3000,
      });
    });
};

const showLimit = (limitInfo) => {
  router.push(
    "/showLimit" +
      "/" +
      limitInfo.longitude +
      "/" +
      limitInfo.latitude +
      "/" +
      limitInfo.radius
  );
};
</script>

<style lang="scss">
/* Add styling for the table here */
.dynamic-table {
  width: 100%;
  border-collapse: collapse;
  background-color: var(--background);
}

.dynamic-table th,
.dynamic-table td {
  padding: 5px 16px;
  border: 1px solid #ddd;
  
  @media (max-width: 500px) {
    padding: 2px 4px;
    font-size: 6.5px;
  }
}
.iconDesktop,
.iconTrash {
  font-size: 15px;
}
.iconTrash:hover {
  cursor: pointer;
  color: red;
}
.iconDesktop:hover {
  cursor: pointer;
  color: green;
}
.dynamic-table th {
  background-color: var(--hover);
  font-weight: bold;
  text-align: left;
}

.dynamic-table tr:nth-child(even) {
  background-color: #b3aaaa;
}

.dynamic-table tr:hover {
  background-color: var(--hover);
}
</style>
