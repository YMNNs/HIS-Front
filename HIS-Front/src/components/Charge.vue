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
    <h1>消费记录</h1>
    <el-table
      :data="chargeTable"
      @selection-change="handleSelectionChange"
      ref="bill"
      style="width: 100%">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        label="处方明细号"
        prop="prescription_content_id"
      />
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
        label="项目名称"
        prop="item_name"
      >
      </el-table-column>
      <el-table-column
        label="单价"
        prop="price"
      >
      </el-table-column>
      <el-table-column
        label="数量"
        prop="quantity"
      >
      </el-table-column>
      <el-table-column
        label="开立时间"
        prop="issue_time"
      >
      </el-table-column>
      <el-table-column
        label="状态"
        prop="status_name"
      ></el-table-column>
      <el-table-column
        label="医生编号"
        prop="doctor_id"
        v-if="show">
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px">
      <el-button @click="handleProceed" type="primary">结算选中项</el-button>

      <el-dialog
        :before-close="handleClose"
        :visible.sync="dialogVisible"
        title="发票信息（缴费）"
        width="30%">
        <span>
          <el-form :model="chargeFinal" :rules="rule2" label-width="80px" ref="chargeFinal">
            <el-form-item label="发票号" prop="receipt_no">
              <el-input v-model="chargeFinal.receipt_no"></el-input>
            </el-form-item>
            <el-form-item label="病历号">
              <el-input disabled v-model="chargeFinal.record_id"></el-input>
            </el-form-item>
            <el-form-item label="姓名">
              <el-input disabled v-model="chargeFinal.name"></el-input>
            </el-form-item>
            <el-form-item label="支付方式" prop="settle_type">
              <el-select placeholder="请选择" v-model="chargeFinal.settle_type">
                  <el-option
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                    v-for="item in feeType">
              </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="应收">
              <el-input disabled v-model="chargeFinal.receivable"></el-input>
            </el-form-item>
            <el-form-item label="实收" prop="received">
              <el-input v-model="chargeFinal.received"></el-input>
            </el-form-item>
            <el-form-item label="找零">
              <el-input :value="chargeFinal.received-chargeFinal.receivable"></el-input>
            </el-form-item>
          </el-form>

        </span>
        <span class="dialog-footer" slot="footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button @click="closeReceipt" type="primary">确 定</el-button>
  </span>
      </el-dialog>

    </div>
  </div>
</template>

<script>
  export default {
    name: "Charge",
    data() {
      let checkAmount = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('实收不能为空'));
        }
        setTimeout(() => {
          if (Number.isNaN(value)) {
            callback(new Error('请输入数字值'));
          } else {
            if (value < 0) {
              callback(new Error('必须大于0'));
            } else {
              callback();
            }
          }
        }, 100);
      };
      return {

        dialogVisible: false,
        searchByRecordId: {
          recordIdQuery: ''
        },
        feeType: [
          {
            name: '现金',
            value: 51
          },
          {
            name: '医保卡',
            value: 52
          }
        ],
        chargeFinal: {
          receipt_no: '',
          record_id: '',
          name: '',
          settle_type: '',
          receivable: 0,
          received: 0,
        },
        chargeTable: [],
        rule1: {
          recordIdQuery: [
            {required: true, message: '请输入病历号', trigger: 'blur'}
          ]
        },
        rule2: {
          receipt_no: [
            {required: true, message: '请输入发票号', trigger: 'blur'}
          ],
          settle_type: [
            {required: true, message: '请选择支付方式', trigger: 'blur'}
          ],
          received: [
            {validator: checkAmount, trigger: 'blur'}
          ]
        }

      }

    },
    methods: {

      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {
          });
      },
      closeReceipt() {
        this.dialogVisible = false
        axios.post('http://localhost:8181/register/settle?settler_id=10&settle_method=' + this.chargeFinal.settle_type + '&receipt_id=' + this.chargeFinal.receipt_no, this.multipleSelection).then((response) => {
          if (response.data > 0) {
            this.success(response.data);
            this.chargeTable = null;
          } else {
            this.error();
          }
        })
        console.log(this.multipleSelection);
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            axios.get("http://localhost:8181/register/cashier/" + this.searchByRecordId.recordIdQuery).then((response) => {
              this.chargeTable = response.data;
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      handleProceed() {
        if (!this.multipleSelection || this.multipleSelection.length === 0) {
          this.warning();
        } else {
          //this.$refs['chargeFinal'].resetFields();
          console.log(this.chargeFinal.name)
          this.chargeFinal.record_id = this.multipleSelection[0].record_id;
          this.chargeFinal.name = this.multipleSelection[0].name;
          this.chargeFinal.received = 0;
          this.chargeFinal.receivable = 0;
          for (let i in this.multipleSelection) {
            this.chargeFinal.receivable += this.multipleSelection[parseInt(i)].price * this.multipleSelection[parseInt(i)].quantity
          }

          console.log(this.chargeFinal.receivable);
          this.dialogVisible = true;
        }
        //TODO 完成结账和登录

      },

      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      warning() {
        this.$notify({
          title: '未执行任何操作',
          message: '未选中消费记录',
          type: 'warning'
        });
      },
      success(counter) {
        this.$notify({
          title: '成功',
          message: '已结算' + counter + '个条目',
          type: 'success'
        });
      },
      error() {
        this.$notify.error({
          title: '结算失败',
          message: '未知错误'
        });
      },
    }

  }
</script>

<style scoped>

</style>
