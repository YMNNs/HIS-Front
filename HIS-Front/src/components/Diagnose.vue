<template>
  <div>
    <el-container>
      <el-aside width="25%">
        <h1 style="text-align: center">待诊列表（自动更新）</h1>
        <el-table
          :data="waitingList"
          @current-change="handleCurrentChange"
          highlight-current-row
          ref="waitingTable"
          style="width: 100%">
          <el-table-column
            type="index">
          </el-table-column>
          <el-table-column
            label="病历号"
            property="record_id"
          >
          </el-table-column>
          <el-table-column
            label="姓名"
            property="name"
          >
          </el-table-column>
        </el-table>
        <div style="margin-top: 20px">
          <el-button :disabled="!currentRow" @click="confirmTicket()" type="primary">确认看诊</el-button>
        </div>
      </el-aside>
      <el-main>
        <div v-if="currentPatient">
          <el-tag>患者姓名：{{currentPatient.name}}</el-tag>
          <el-tag>病历号：{{currentPatient.record_id}}</el-tag>
          <el-tag>性别：{{currentPatient.sex}}</el-tag>
          <el-tag>年龄：{{currentPatient.age+currentPatient.age_type}}</el-tag>
        </div>
        <div v-else>
          <el-tag type="info">当前无患者</el-tag>
        </div>

        <el-tabs @tab-click="handleClick" v-model="activeName">
          <el-tab-pane label="门诊病历" name="first">
            <!--            门诊病历-->
            <el-form :disabled="!currentPatient" :model="record" :rules="recordRules" ref="recordForm" status-icon>
              <el-form-item label="主诉" prop="cc">
                <el-input
                  :rows="1"
                  placeholder="请输入内容"
                  type="textarea"
                  v-model="record.cc">
                </el-input>
              </el-form-item>
              <el-form-item label="现病史">
                <el-input
                  :rows="1"
                  placeholder="请输入内容"
                  type="textarea"
                  v-model="record.hpi">
                </el-input>
              </el-form-item>
              <el-form-item label="现病治疗情况">
                <el-input
                  :rows="1"
                  placeholder="请输入内容"
                  type="textarea"
                  v-model="record.hpi_treatment">
                </el-input>
              </el-form-item>
              <el-form-item label="既往史">
                <el-input
                  :rows="1"
                  placeholder="请输入内容"
                  type="textarea"
                  v-model="record.hhi">
                </el-input>
              </el-form-item>
              <el-form-item label="过敏史">
                <el-input
                  :rows="1"
                  placeholder="请输入内容"
                  type="textarea"
                  v-model="record.allergic_history">
                </el-input>
              </el-form-item>
              <el-form-item label="体格检查">
                <el-input
                  :rows="1"
                  placeholder="请输入内容"
                  type="textarea"
                  v-model="record.physical">
                </el-input>
              </el-form-item>
              <el-form-item label="诊断">
                <el-input
                  :rows="1"
                  placeholder="请输入内容"
                  type="textarea"
                  v-model="record.diagnosis">
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button @click="submitForm('recordForm')" type="primary">提交</el-button>
                <el-button @click="resetForm('recordForm')">重置</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="成药处方" name="second">
            <!--            成药处方-->
            <h1>备选药品</h1>
            <el-table
              :data="medicineList.filter(data => !search || data.mnemonic_code.toLowerCase().includes(search.toLowerCase()))"
              :disabled="!currentPatient"
              max-height="500"
              style="width: 100%">
              <el-table-column
                label="id"
                prop="id"
                v-if="show">
              </el-table-column>
              <el-table-column
                label="名称"
                prop="name">
              </el-table-column>
              <el-table-column
                label="规格"
                prop="format">
              </el-table-column>
              <el-table-column
                label="价格"
                prop="price">
              </el-table-column>
              <el-table-column
                label="助记码"
                prop="mnemonic_code"
                v-if="show">
              </el-table-column>
              <el-table-column
                label="数量"
                prop="quantity">
                <template slot-scope="scope">
                  <el-input-number :max="100" :min="0" label="数量" v-model="scope.row.quantity"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column
                align="right">
                <template slot="header" slot-scope="scope">
                  <el-input
                    placeholder="输入关键字搜索"
                    size="mini"
                    v-model="search"/>
                </template>
                <template slot-scope="scope">
                  <el-button
                    @click="handleAdd(scope.row)"
                    size="mini"
                    :disabled="!scope.row.quantity"
                  >添加
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <br>
            <el-pagination
              :current-page="currentPage"
              :page-size="5"
              :total="totalPage"
              @current-change="page"
              background
              layout="prev, pager, next">
            </el-pagination>
            <h1>当前处方</h1>
            <el-table
              :data="confirmedMedicineList"
              :disabled="!currentPatient"
              max-height="500"
              style="width: 100%">
              <el-table-column
                label="id"
                prop="id"
                v-if="show">
              </el-table-column>
              <el-table-column
                label="名称"
                prop="name">
              </el-table-column>
              <el-table-column
                label="规格"
                prop="format">
              </el-table-column>
              <el-table-column
                label="价格"
                prop="price">
              </el-table-column>
              <el-table-column
                label="助记码"
                prop="mnemonic_code"
                v-if="show">
              </el-table-column>
              <el-table-column
                label="数量"
                prop="quantity">
                <template slot-scope="scope">
                  <el-input-number :max="100" :min="0" label="数量" v-model="scope.row.quantity" min="1"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column
                align="right">
                <template slot-scope="scope">

                  <el-button
                    @click="handleRemove(scope.row)" size="mini"
                    type="danger">删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <div style="margin-top: 20px">
              <el-button :disabled="!currentPatient" @click="confirmMedicine()" type="primary">提交处方</el-button>
              <el-button @click="resetMedicine()">重置</el-button>
            </div>
          </el-tab-pane>
        </el-tabs>

      </el-main>
    </el-container>
  </div>
</template>

<script>
  export default {
    name: "Diagnose",
    data() {
      return {
        //需进一步处理
        currentDoctorId: 1,
        totalPage: 0,
        currentPage: 1,
        waitingList: [],
        currentPatient: null,
        record: {
          record_id: '',
          cc: '',
          hpi: '',
          hhi: '',
          hpi_treatment: '',
          allergic_history: '',
          physical: '',
          diagnosis: '',
        },
        recordRules: {
          cc: [
            {required: true, message: '请输入内容', trigger: 'blur'},
          ],

        },
        currentRow: null,
        activeName: 'first',
        medicineList: [],
        confirmedMedicineList: [],
        search: ''
      }
    },
    created() {
      axios.get('http://localhost:8181/drugs/findAll/1/5').then((response) => {
        console.log('请求首页药物数据');
        this.totalPage = response.data.totalPages;
        this.medicineList = response.data.content;
      })
      this.updateWaitingList();
      setInterval(this.updateWaitingList, 10000);
    },
    methods: {
      updateWaitingList: function () {
        axios.get('http://localhost:8181/doctor/getWaitingList/' + this.currentDoctorId).then((response) => {
          console.log('请求待诊列表');
          this.waitingList = response.data;
        })
      },
      page(currentPage) {
        axios.get('http://localhost:8181/drugs/findAll/' + currentPage + '/5').then((response) => {
          console.log('请求第' + currentPage + '页药物数据');
          this.totalPage = response.data.totalPages;
          this.medicineList = response.data.content;
        })
      },
      confirmTicket() {
        axios.get('http://localhost:8181/doctor/confirmTicket/' + this.currentRow.record_id).then((response) => {
          this.currentPatient = response.data;
        });
      },
      confirmMedicine() {
        console.log(this.currentDoctorId);
        console.log(this.currentPatient.record_id);
        console.log(this.confirmedMedicineList);
        axios.post('http://localhost:8181/doctor/confirmPrescription?doctor_id=' + this.currentDoctorId + '&record_id=' + this.currentPatient.record_id, this.confirmedMedicineList).then((response) => {
          if (response.data > 0) {
            this.$notify({
              title: '成功',
              message: '已提交' + response.data + '个条目',
              type: 'success'
            });
            this.confirmedMedicineList = null;
          } else {
            this.$notify.error({
              title: '失败',
              message: '未知错误'
            });
          }
        })
      },
      resetMedicine() {
        this.confirmedMedicineList.splice(0, this.confirmedMedicineList.length)
      },
      handleCurrentChange(val) {
        this.currentRow = val;
      },
      handleClick(tab, event) {
        console.log(tab, event);
      },
      submitForm(formName) {
        //TODO 提交表单
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.record.record_id = this.currentPatient.record_id;
            console.log(this.record)
            axios.post('http://localhost:8181/doctor/confirmRecord', this.record).then((response) => {
              if (response.data > 0) {
                this.$notify({
                  title: '成功',
                  message: '病历已保存',
                  type: 'success'
                });
              } else {
                this.$notify.error({
                  title: '失败',
                  message: '未知错误'
                });
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        console.log('clear!!');
      },
      handleAdd(row) {
        this.confirmedMedicineList.push(JSON.parse(JSON.stringify(row)))
      },
      handleRemove(row) {
        this.confirmedMedicineList.splice(this.confirmedMedicineList.indexOf(row), 1)
      }
    },
  }
</script>

<style scoped>

</style>
