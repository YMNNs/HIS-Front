<template>
  <div>
    <h1>查询患者</h1>
    <el-form :inline="true" :model="searchByRecordId" :rules="rule1" ref="searchByRecordId">
      <el-form-item label="病历号" prop="recordIdQuery">
        <el-input placeholder="请输入" v-model="searchByRecordId.recordIdQuery"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="submitForm('searchByRecordId')" type="primary">查询</el-button>
      </el-form-item>
    </el-form>
    <h1>药品列表</h1>
    <el-table
      :data="drugTable"

      @selection-change="handleSelectionChange">
      style="width: 100%">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        label="处方明细号"
        prop="prescription_content_id"
      ></el-table-column>
      <el-table-column
        label="药品名称"
        prop="drug_name"
      >
      </el-table-column>
      <el-table-column
        label="药品条码"
        prop="drug_code"
      >
      </el-table-column>
      <el-table-column
        label="数量"
        prop="quantity"
      >
      </el-table-column>
      <el-table-column
        label="状态"
        prop="status_name"
      >
      </el-table-column>
    </el-table>
    <br>
    <el-button :disabled="multipleSelection.length===0"
               @click="confirmDispense"
    >发药
    </el-button>
  </div>
</template>

<script>
  export default {
    name: "Dispense",
    data() {
      return {
        searchByRecordId: {
          recordIdQuery: ''
        },
        drugTable: [],
        rule1: {
          recordIdQuery: [
            {required: true, message: '请输入病历号', trigger: 'blur'}
          ]
        },
        multipleSelection: []
      }
    },
    methods: {
      confirmDispense() {
        axios.post('http://localhost:8181/drugs/confirmDispense', this.multipleSelection).then((response) => {
          if (response.data > 0) {
            this.success(response.data);
            this.drugTable = [];
          } else {
            this.error();
          }
        })
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            axios.get('http://localhost:8181/drugs/findDrugList/' + this.searchByRecordId.recordIdQuery).then((response) => {
              console.log('请求发药数据');
              this.drugTable = response.data;
            });
            this.$refs[formName].resetFields();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      success(count) {
        this.$notify({
          title: '发药成功',
          message: '已处理' + count + '个条目',
          type: 'success'
        });
      },
      error() {
        this.$notify.error({
          title: '发药失败',
          message: '未执行任何操作'
        });
      }
    }
  }
</script>

<style scoped>

</style>
