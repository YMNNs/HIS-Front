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
    <h1>挂号信息</h1>
    <el-table
      :data="regTable"
      style="width: 100%">
      <el-table-column
        label="病历号"
        prop="record_id"
      >
      </el-table-column>
      <el-table-column
        label="姓名"
        prop="name"
      >
      </el-table-column>
      <el-table-column
        label="身份证号"
        prop="id_no"
      >
      </el-table-column>
      <el-table-column
        label="挂号日期"
        prop="current_visit_date"
      >
      </el-table-column>
      <el-table-column
        label="挂号时段"
        prop="period"
      >
      </el-table-column>
      <el-table-column
        label="看诊科室"
        prop="dept_name"
      >
      </el-table-column>
      <el-table-column
        label="看诊状态"
        prop="status_name"
      >
      </el-table-column>
      <el-table-column
        label="操作"
      >
        <template slot-scope="scope">
          <div v-if="scope.row.status_name === '已挂号'">
            <el-popconfirm
              @onConfirm="handleRefund(scope.$index, scope.row)"
              confirmButtonType="danger"
              icon="el-icon-info"
              iconColor="red"
              title="确定要退号吗？"
            >
              <el-button
                size="mini"
                slot="reference"
                type="danger">退号
              </el-button>
            </el-popconfirm>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: "Refund",
    data() {
      return {
        searchByRecordId: {
          recordIdQuery: ''
        },
        regTable: [],
        rule1: {
          recordIdQuery: [
            {required: true, message: '请输入病历号', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            axios.get('http://localhost:8181/register/findAllByRecord_id/' + this.searchByRecordId.recordIdQuery).then((response) => {
              console.log('请求挂号数据');
              this.regTable = response.data;
            });
            this.$refs[formName].resetFields();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      handleRefund(index, row) {
        axios.get('http://localhost:8181/register/refund/' + row.record_id).then((response) => {
          if (response.data > 0) {
            this.success();
          } else {
            this.error();
          }
          this.regTable = [];
        })

      },
      success() {
        this.$notify({
          title: '退号成功',
          message: '该病历号已不可用',
          type: 'success'
        });
      },
      error() {
        this.$notify.error({
          title: '退号失败',
          message: '未执行任何操作'
        });
      }
    }
  }
</script>

<style scoped>

</style>
