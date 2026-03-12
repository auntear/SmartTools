<template>
  <div>
    <h2>Smart Stock Product</h2>
    <p>ระบบจัดการสต็อก</p>

    <div class="row">

      <!-- COLUMN 1 -->
      <div class="col-2 bg-success p-3">
        <h6>1</h6>
        <small class="text-muted">เลือกแผนก</small>
        <div class="mt-2">
          <div class="border rounded p-2 bg-light">
            <!-- Loading -->
            <div v-if="loading" class="text-muted">
              กำลังโหลดข้อมูล...
            </div>

            <!-- Data -->
            <div v-else-if="Dep != null && Dep.length > 0">

              <div v-for="item in Dep" :key="item.no" class="form-check">
                <input class="form-check-input shadow-sm border border-primary" type="radio" name="depSelect"
                  :id="'dep_' + item.no" :value="item.no" v-model="selectedDep" />
                <label class="form-check-label" :for="'dep_' + item.no">
                  {{ item.name }} ({{ item.no }})
                </label>
              </div>
            </div>

            <!-- No Data -->
            <div v-else class="text-muted">
              ยังไม่มีข้อมูลที่จะแสดง
            </div>
          </div>
        </div>
      </div>

      <!-- COLUMN 2 -->
      <div class="col-10 bg-info p-3" v-if="selectedDep != null">
        <h6>2</h6>
        <small class="text-muted">
          ส่วนการทำงานลงทะเบียนครุภัณฑ์
        </small>
        <hr>
        <div class="alert alert-light">
          <p>ส่วนของการแสดงผล</p>
          <strong>แผนกที่เลือก :</strong>
          {{ selectedDep }}
        </div>

        <div class="mt-3">
          <button class="btn btn-primary me-2">
            เพิ่มครุภัณฑ์
          </button>
          <button class="btn btn-warning me-2">
            แก้ไข
          </button>
          <button class="btn btn-danger">
            ลบ
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {

  data() {

    return {
      Dep: [],
      selectedDep: null,
      loading: false
    };

  },

  mounted() {

    this.fetchStatus();

  },

  watch: {

    selectedDep(newValue) {

      if (newValue !== null && newValue !== undefined) {

        console.log("เลือกแผนก:", newValue);

      }

    }

  },

  methods: {

    async fetchStatus() {

      try {

        this.loading = true;

        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:3000/api/getDep", {
          method: "GET",
          headers: {
            "Authorization": "Bearer " + token
          }
        });

        if (!res.ok) {
          throw new Error("ไม่สามารถดึงข้อมูลสถานะได้");
        }

        const data = await res.json();

        this.Dep = data.data.filter(function (item) {

          if (item.active === "Y") {
            return true;
          } else {
            return false;
          }

        });

      } catch (err) {

        console.error(err);
        this.Dep = [];

      } finally {

        this.loading = false;

      }

    }

  }

}
</script>