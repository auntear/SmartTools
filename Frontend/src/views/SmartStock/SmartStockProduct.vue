<template>
  <div>
    <h2>Smart Stock Product</h2>
    <p>ระบบจัดการสต็อก</p>

    <div class="row">

      <!-- COLUMN 1 -->
      <div class="col-2 bg-success p-3">
        <small class="text-muted">เลือกแผนก</small>
        <div class="mt-2">
          <div class="border rounded p-2 bg-light">
            <div v-if="loading" class="text-muted">
              กำลังโหลดข้อมูล...
            </div>
            <div v-else-if="Dep != null && Dep.length > 0">
              <div v-for="item in Dep" :key="item.no" class="form-check">
                <input class="form-check-input shadow-sm border border-primary" type="radio" name="depSelect"
                  :id="'dep_' + item.no" :value="item.no" v-model="selectedDep">
                <label class="form-check-label" :for="'dep_' + item.no">
                  {{ item.dep }}
                </label>
              </div>
            </div>

            <div v-else class="text-muted">
              ยังไม่มีข้อมูลที่จะแสดง
            </div>
          </div>
        </div>
      </div>

      <!-- COLUMN 2 -->
      <div class="col-10 bg-info p-3" v-if="selectedDep != null">
        <div class="d-flex justify-content-between mb-2">
          <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addAssetModal">
            + เพิ่มครุภัณฑ์
          </button>
        </div>
        <div class="table-container">
          <table class="table table-bordered table-striped">
            <thead class="table-dark">
              <tr>
                <th>รหัส</th>
                <th>ชื่อครุภัณฑ์</th>
                <th>ยี่ห้อ</th>
                <th>รุ่น</th>
                <th>Serial</th>
                <th>สถานะ</th>
                <th width="120">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in assets" :key="item.id">
                <td>{{ item.asset_code }}</td>
                <td>{{ item.asset_name }}</td>
                <td>{{ item.brand }}</td>
                <td>{{ item.model }}</td>
                <td>{{ item.serial_number }}</td>
                <td>{{ item.status }}</td>
                <td>
                  <button class="btn btn-sm btn-warning me-1">
                    แก้ไข
                  </button>
                  <button class="btn btn-sm btn-danger">
                    ลบ
                  </button>
                </td>
              </tr>
              <tr v-if="assets.length === 0">
                <td colspan="7" class="text-center text-muted">
                  ไม่มีข้อมูลครุภัณฑ์
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>


    <!-- MODAL -->
    <div class="modal fade" id="addAssetModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              เพิ่มครุภัณฑ์
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-6 mb-2">
                <label>รหัสครุภัณฑ์</label>
                <input type="text" class="form-control" v-model="form.asset_code">
              </div>
              <div class="col-md-6 mb-2">
                <label>ชื่อครุภัณฑ์</label>
                <input type="text" class="form-control" v-model="form.asset_name">
              </div>
              <div class="col-md-6 mb-2">
                <label>หมวดหมู่</label>
                <input type="text" class="form-control" v-model="form.category">
              </div>
              <div class="col-md-6 mb-2">
                <label>ยี่ห้อ</label>
                <input type="text" class="form-control" v-model="form.brand">
              </div>
              <div class="col-md-6 mb-2">
                <label>รุ่น</label>
                <input type="text" class="form-control" v-model="form.model">
              </div>
              <div class="col-md-6 mb-2">
                <label>Serial Number</label>
                <input type="text" class="form-control" v-model="form.serial_number">
              </div>
              <div class="col-md-6 mb-2">
                <label>วันที่ซื้อ</label>
                <input type="date" class="form-control" v-model="form.purchase_date">
              </div>
              <div class="col-md-6 mb-2">
                <label>ราคา</label>
                <input type="number" class="form-control" v-model="form.price">
              </div>
              <div class="col-md-6 mb-2">
                <label>สถานะ</label>
                <input type="text" class="form-control" v-model="form.status">
              </div>
              <div class="col-md-6 mb-2">
                <label>ตำแหน่ง</label>
                <input type="text" class="form-control" v-model="form.location">
              </div>
            </div>
          </div>


          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">
              ปิด
            </button>
            <button class="btn btn-success" @click="saveAsset">
              บันทึก
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as bootstrap from "bootstrap";
export default {
  data() {
    return {
      Dep: [],
      assets: [],
      selectedDep: null,
      loading: false,
      form: {
        asset_code: "",
        asset_name: "",
        category: "",
        brand: "",
        model: "",
        serial_number: "",
        purchase_date: "",
        price: "",
        status: "ใช้งาน",
        location: ""
      }
    };
  },

  mounted() {
    this.fetchStatus();
  },

  watch: {
    selectedDep(newValue) {
      if (newValue !== null && newValue !== undefined) {
        this.fetchAsset(newValue);
      } else {
        this.assets = [];
      }
    }
  },

  methods: {
    async fetchStatus() {
      try {
        this.loading = true;
        const token = localStorage.getItem("token");
        const res = await fetch(
          "http://localhost:3000/api/getDep",
          {
            method: "GET",
            headers: {
              "Authorization": "Bearer " + token
            }
          }
        );
        if (!res.ok) {
          throw new Error("ไม่สามารถดึงข้อมูลแผนกได้");
        } else {
          const data = await res.json();
          if (data.data !== null && data.data !== undefined) {
            this.Dep = data.data.filter(function (item) {
              if (item.active === "Y") {
                return true;
              } else {
                return false;
              }
            });
          } else {
            this.Dep = [];
          }
        }
      } catch (err) {
        console.error(err);
        this.Dep = [];
      } finally {
        this.loading = false;
      }
    },

    async fetchAsset(no) {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "http://localhost:3000/api/getAsset?no=" + no,
          {
            method: "GET",
            headers: {
              "Authorization": "Bearer " + token
            }
          }
        );
        if (!res.ok) {
          throw new Error("โหลดข้อมูลครุภัณฑ์ไม่ได้");
        } else {
          const data = await res.json();
          if (data.data !== null && data.data !== undefined) {
            this.assets = data.data;
          } else {
            this.assets = [];
          }
        }
      } catch (err) {
        console.error(err);
        this.assets = [];
      }
    },

    async saveAsset() {
      try {
        const token = localStorage.getItem("token");
        const payload = {

          no: this.selectedDep,
          asset_code: this.form.asset_code,
          asset_name: this.form.asset_name,
          category: this.form.category,
          brand: this.form.brand,
          model: this.form.model,
          serial_number: this.form.serial_number,
          purchase_date: this.form.purchase_date,
          price: this.form.price,
          status: this.form.status,
          location: this.form.location
        };
        const res = await fetch(
          "http://localhost:3000/api/addAsset",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + token
            },
            body: JSON.stringify(payload)
          }
        );
        if (!res.ok) {
          throw new Error("เพิ่มข้อมูลไม่ได้");
        } else {
          const modalEl = document.getElementById("addAssetModal");
          const modal = bootstrap.Modal.getInstance(modalEl);
          if (modal !== null && modal !== undefined) {
            modal.hide();
          }
          document.body.classList.remove("modal-open");
          const backdrop = document.querySelector(".modal-backdrop");
          if (backdrop !== null && backdrop !== undefined) {
            backdrop.remove();
          }
          this.resetForm();
          this.fetchAsset(this.selectedDep);
        }
      } catch (err) {
        console.error(err);
      }
    },

    resetForm() {
      this.form = {
        asset_code: "",
        asset_name: "",
        category: "",
        brand: "",
        model: "",
        serial_number: "",
        purchase_date: "",
        price: "",
        status: "ใช้งาน",
        location: ""
      };
    }
  }
};
</script>

<style>
.table-container {
  max-height: 600px;
  overflow-y: auto;
}

.table thead th {
  position: sticky;
  top: 0;
  z-index: 1;
  background: #212529;
  color: white;
}
</style>