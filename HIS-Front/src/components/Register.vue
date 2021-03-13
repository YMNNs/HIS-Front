<template>
  <div>
    <h1>现场挂号</h1>
    <el-form :model="registerForm" :rules="rules" label-width="100px" ref="registerForm" status-icon>
      <el-form-item label="发票号" prop="receipt_no">
        <el-input v-model="registerForm.receipt_no"></el-input>
      </el-form-item>
      <el-form-item label="病历号">
        <el-input disabled v-model="registerForm.record_id"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="registerForm.name"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select placeholder="请选择" v-model="registerForm.sex">
          <el-option label="男" value="男"></el-option>
          <el-option label="女" value="女"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="年龄" prop="age" required>
        <el-input prop="age" v-model="registerForm.age"></el-input>
      </el-form-item>


      <el-form-item label="" prop="age_type">
        <el-select placeholder="请选择年龄单位" v-model="registerForm.age_type">
          <el-option label="岁" value="岁"></el-option>
          <el-option label="月" value="月"></el-option>
          <el-option label="周" value="周"></el-option>
        </el-select>
      </el-form-item>


      <el-form-item label="出生日期" prop="dob">
        <el-date-picker placeholder="请选择" type="date" v-model="registerForm.dob"/>
      </el-form-item>
      <el-form-item label="身份证号" prop="id_no">
        <el-input v-model="registerForm.id_no"></el-input>
      </el-form-item>
      <el-form-item label="家庭住址">
        <el-input v-model="registerForm.address"></el-input>
      </el-form-item>
      <el-form-item label="结算类别" prop="settlement_id">
        <el-select placeholder="请选择" v-model="registerForm.settlement_id">
          <el-option label="自费" value="1"></el-option>
          <el-option label="市医保" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="看诊日期" prop="current_visit_date">
        <el-form-item prop="date1">
          <el-date-picker placeholder="请选择" type="date"
                          v-model="registerForm.current_visit_date"></el-date-picker>
        </el-form-item>
      </el-form-item>
      <el-form-item label="" prop="period">
        <el-select placeholder="请选择时段" v-model="registerForm.period">
          <el-option label="上午" value="上午"></el-option>
          <el-option label="下午" value="下午"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="挂号科室" prop="dept_id">
        <el-select @change="getDoctors" placeholder="请选择" v-model="registerForm.dept_id">
          <el-option
            :key="item.id"
            :label="item.name"
            :value="item.id"
            v-for="item in departments"/>
        </el-select>
      </el-form-item>
      <el-form-item label="看诊医生" prop="doctor_id">
        <el-select v-model="registerForm.doctor_id">
          <el-option
            :key="item.id"
            :label="item.real_name"
            :value="item.id"
            v-for="item in doctors"/>
        </el-select>
      </el-form-item>


      <el-form-item label="需要病历本">
        <el-switch active-value="1"
                   inactive-value="0"
                   v-model="registerForm.is_need_medical_history_book"
        ></el-switch>
      </el-form-item>

      <el-form-item>
        <el-button @click="submitForm('registerForm')" type="primary">挂号</el-button>
        <el-button @click="resetForm('registerForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: "Register",
    data() {
      let checkAge = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('年龄不能为空'));
        }
        setTimeout(() => {

          if (!new RegExp('^[1-9]\\d*$').test(value)) {
            callback(new Error('请输入数字值'));
          } else {
            callback();
          }
        }, 500);
      };
      return {
        registerForm: {
          receipt_no: '',
          record_id: '',
          name: '',
          sex: '',
          age: '',
          age_type: '',
          settlement_id: '',
          dob: '',
          current_visit_date: '',
          period: '',
          id_no: '',
          address: '',
          dept_id: '',
          doctor_id: '',
          is_need_medical_history_book: false,
        },
        departments: [],
        doctors: [],
        rules: {
          receipt_no: [
            {required: true, message: '请输入发票号', trigger: 'blur'},
          ],
          name: [
            {required: true, message: '请输入姓名', trigger: 'blur'},
          ],
          address: [
            {required: false, message: '请输入地址', trigger: 'blur'},
          ],
          id_no: [
            {required: false, message: '请输入身份证号', trigger: 'blur'},
          ],
          sex: [
            {required: true, message: '请选择性别', trigger: 'change'}
          ],
          age: [
            {validator: checkAge, trigger: 'blur'}
          ],
          age_type: [
            {required: true, message: '请选择年龄类型', trigger: 'change'}
          ],
          dob: [
            {type: 'date', required: true, message: '请选择日期', trigger: 'change'}
          ],
          settlement_id: [
            {required: true, message: '请选择结算方式', trigger: 'change'}
          ],
          current_visit_date: [
            {type: 'date', required: true, message: '请选择日期', trigger: 'change'}
          ],
          period: [
            {required: true, message: '请选择时段', trigger: 'change'}
          ],
          dept_id: [
            {required: true, message: '请选择科室', trigger: 'change'}
          ],
          doctor_id: [
            {required: true, message: '请选择医生', trigger: 'change'}
          ],
        }
      };
    },
    created() {
      axios.get('http://localhost:8181/department/findAll').then((response) => {
        console.log('请求科室数据');
        this.departments = response.data;
      })
    },
    methods: {
      getDoctors() {
        axios.get('http://localhost:8181/users/doctor/' + this.registerForm.dept_id).then((response) => {
          console.log('请求医生数据');
          this.doctors = response.data;
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log(this.registerForm);
            axios.post('http://localhost:8181/register/save', this.registerForm).then((response) => {
              if (response.data) {
                this.success(response.data);
                this.resetForm('registerForm');
              } else {
                this.error();
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
      success(record_id) {
        this.$notify({
          title: '挂号成功',
          message: '该病人的病历号为 ' + record_id,
          type: 'success'
        });
      },
      error() {
        this.$notify.error({
          title: '挂号失败',
          message: '未知错误'
        });
      },

    }
  }
</script>

<style scoped>
</style>
