import { Component, HostListener } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { filter, fromEvent } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public navigation = [
    {
      step: 1,
      name: 'Alternatif',
    },
    {
      step: 2,
      name: 'Kriteria',
    },
    {
      step: 3,
      name: 'Bobot Kepentingan',
    },
    {
      step: 4,
      name: 'Penilaian Alternatif',
    },
    {
      step: 5,
      name: 'Perhitungan',
    },
  ];

  public alternatif: any = [];
  public kriteria: any = [];
  public bobotPerKriteria: any = [];
  public alternatifPerKriteria: any = [];
  public pangkat: any = [];
  public alternatifPerhitunganS: any = [];
  public totalPerhitunganS: number = 0;
  public alternatifPerhitunganV: any = [];
  public totalPerhitunganV: number = 0;
  public rangking: any = [];

  public alternatifForm!: FormGroup;
  public kriteriaForm!: FormGroup;
  public alternatifPerKriteriaForm!: FormGroup;

  public totalKriteria: number = 0;
  public totalBobotKepentingan: number = 0;
  public isShowRank: boolean = false;
  private tempRank: any = [];
  public alternatifSelected: any;
  public step: any = 1;
  public typeInput: any;

  public isAlternatifEdit: boolean = false;
  public isKriteriaEdit: boolean = false;
  private alternatifEditSelected: any;
  private kriteriaEditSelected: any;

  public showDialog: boolean = false;
  public messageDialog!: string;
  private refreshWarn = false;
  public isHitungNilaiSdanV: boolean = false;

  constructor(private fb: FormBuilder) {
    this.alternatifForm = this.fb.group({
      kode: ['', Validators.required],
      namaAlternatif: ['', Validators.required],
    });

    this.kriteriaForm = this.fb.group({
      kode: ['', Validators.required],
      namaKriteria: ['', Validators.required],
      tipeKriteria: ['', Validators.required],
      bobotKriteria: ['', Validators.required],
    });

    this.alternatifPerKriteriaForm = this.fb.group({
      kodeAlternatif: [''],
      alternatif: [''],
    });
  }

  ngOnInit(): void {
    this.alertBrowserRefresh();
  }

  navigate(step: number) {
    if ((step == 4 || step == 5) && this.bobotPerKriteria.length < 1) {
      this.messageDialog =
        'Bobot kepentingan belum dihitung. Anda harus menentukan bobot kepentingan terlebih dahulu !!';
      this.showDialog = true;
    } else {
      this.step = step;
    }
  }

  tambahAlternatif() {
    this.alternatifForm.markAllAsTouched();
    this.refreshWarn = true;

    if (this.alternatifForm.valid) {
      if (this.isAlternatifEdit) {
        this.alternatif[this.alternatifEditSelected] =
          this.alternatifForm.value;
      } else {
        if (this.alternatif.length == 0) {
          this.alternatif.push(this.alternatifForm.value);
        } else {
          const exist = this.alternatif.find(
            (item: any) => item.kode == this.alternatifForm.value.kode
          );

          if (exist) {
            this.messageDialog =
              'Kode alternatif sudah ada, silahkan input data dengan kode lain !!';
            this.showDialog = true;
          } else {
            this.alternatif.push(this.alternatifForm.value);
          }
        }
      }

      // reset data variable
      this.alternatifForm.reset();
      this.isAlternatifEdit = false;
      this.alternatifPerhitunganS = [];
      this.alternatifPerhitunganV = [];
      this.isShowRank = false;
      this.rangking = [];
      this.tempRank = [];
      this.totalPerhitunganS = 0;
      this.totalPerhitunganV = 0;
      this.alternatifPerhitunganS = [];
      this.alternatifPerhitunganV = [];
    }
  }

  editAlternatif(idx: number) {
    this.alternatifEditSelected = idx;
    this.isAlternatifEdit = true;
    const selected = this.alternatif.filter(
      (item: any, i: number) => i == idx
    )[0];

    this.alternatifForm.get('kode')?.setValue(selected.kode);
    this.alternatifForm
      .get('namaAlternatif')
      ?.setValue(selected.namaAlternatif);
  }

  hapusAlternatif(idx: number) {
    this.alternatifPerKriteria = this.alternatifPerKriteria.filter(
      (item: any) => item.kodeAlternatif != this.alternatif[idx].kode
    );

    this.alternatif = this.alternatif.filter(
      (item: any, i: number) => i != idx
    );

    // reset data perhitungan akhir
    this.totalPerhitunganS = 0;
    this.totalPerhitunganV = 0;
  }

  tambahKriteria() {
    this.kriteriaForm.markAllAsTouched();
    if (this.kriteriaForm.valid) {
      if (this.isKriteriaEdit) {
        this.kriteria[this.kriteriaEditSelected] = this.kriteriaForm.value;
      } else {
        if (this.kriteria.length == 0) {
          this.kriteria.push(this.kriteriaForm.value);
        } else {
          const exist = this.kriteria.find(
            (item: any) => item.kode == this.kriteriaForm.value.kode
          );

          if (exist) {
            this.messageDialog =
              'Kode kriteria sudah ada, silahkan input data dengan kode lain !!';
            this.showDialog = true;
          } else {
            this.kriteria.push(this.kriteriaForm.value);
          }
        }
      }

      // reset data variable
      this.kriteriaForm.reset();
      this.isKriteriaEdit = false;
    }

    this.totalKriteria = this.kriteria
      .map((item: any) => item.bobotKriteria)
      .reduce((prev: any, curr: any) => prev + curr, 0);

    this.bobotPerKriteria = [];
    this.alternatifPerKriteria = [];
  }

  editKriteria(idx: number) {
    this.kriteriaEditSelected = idx;
    this.isKriteriaEdit = true;
    const selected = this.kriteria.filter(
      (item: any, i: number) => i == idx
    )[0];

    this.kriteriaForm.get('kode')?.setValue(selected.kode);
    this.kriteriaForm.get('namaKriteria')?.setValue(selected.namaKriteria);
    this.kriteriaForm.get('tipeKriteria')?.setValue(selected.tipeKriteria);
    this.kriteriaForm.get('bobotKriteria')?.setValue(selected.bobotKriteria);
  }

  hapusKriteria(idx: number) {
    this.kriteria = this.kriteria.filter((item: any, i: number) => i != idx);
    this.totalKriteria = this.kriteria
      .map((item: any) => item.bobotKriteria)
      .reduce((prev: any, curr: any) => prev + curr, 0);

    // reset data variable
    this.bobotPerKriteria = [];
    this.alternatifPerKriteria = [];
  }

  hitungBobotKepentingan() {
    const arr: any = [];

    if (this.alternatif.length > 0 && this.kriteria.length > 0) {
      this.kriteria.forEach((item: any) => {
        const obj = {
          bobotKepentingan: 'bobot kepentingan',
          kodeKriteria: item.kode,
          value:
            Math.round((item.bobotKriteria / this.totalKriteria) * 100) / 100,
          pangkat:
            item.tipeKriteria == 'cost'
              ? (item.bobotKriteria / this.totalKriteria) * -1
              : (item.bobotKriteria / this.totalKriteria) * 1,
        };

        arr.push(obj);
      });
    } else {
      this.messageDialog = 'Data Alternatif dan Data kriteria masih kosong !!';
      this.showDialog = true;
    }

    this.bobotPerKriteria = arr;

    this.totalBobotKepentingan = this.bobotPerKriteria
      .map((item: any) => item.value)
      .reduce((prev: any, curr: any) => prev + curr, 0);

    // create form for alternatif/kriteria
    this.kriteria.forEach((alt: any) => {
      this.alternatifPerKriteriaForm.addControl(
        alt.kode,
        new FormControl('', Validators.required)
      );
    });
  }

  selectAlternatif(e: any) {
    this.alternatifSelected = e;
  }

  tambahPenilaianMatrix() {
    if (this.alternatifPerKriteriaForm.valid && this.alternatifSelected) {
      this.alternatifPerKriteriaForm
        .get('alternatif')
        ?.setValue(this.alternatifSelected.namaAlternatif);
      this.alternatifPerKriteriaForm
        .get('kodeAlternatif')
        ?.setValue(this.alternatifSelected.kode);

      var keyNames = Object.keys(this.alternatifPerKriteriaForm.value);

      const arrKriteria: any = [];
      keyNames.forEach((key: any) => {
        this.bobotPerKriteria.forEach((bobot: any) => {
          if (key == bobot.kodeKriteria) {
            const obj = {
              kriteriaAlternatifKode: bobot.kodeKriteria,
              kriteriaAlternatifPangkat: bobot.pangkat,
              kriteriaAlternatifValue:
                this.alternatifPerKriteriaForm.value[bobot.kodeKriteria],
            };

            arrKriteria.push(obj);
          }
        });
      });

      if (this.alternatifPerKriteria.length == 0) {
        const dataObj = {
          kodeAlternatif: this.alternatifPerKriteriaForm.value.kodeAlternatif,
          alternatif: this.alternatifPerKriteriaForm.value.alternatif,
          kriteria: arrKriteria,
        };

        this.alternatifPerKriteria.push(dataObj);
      } else {
        const exist = this.alternatifPerKriteria.find(
          (item: any) =>
            item.alternatif == this.alternatifPerKriteriaForm.value.alternatif
        );

        if (exist) {
          this.messageDialog = 'Alternatif yang di pilih sudah dinilai !!';
          this.showDialog = true;
        } else {
          const dataObj = {
            kodeAlternatif: this.alternatifPerKriteriaForm.value.kodeAlternatif,
            alternatif: this.alternatifPerKriteriaForm.value.alternatif,
            kriteria: arrKriteria,
          };

          this.alternatifPerKriteria.push(dataObj);
        }
      }

      this.isHitungNilaiSdanV = false;
    }

    this.alternatifPerKriteriaForm.reset();
    this.totalPerhitunganS = 0;
    this.totalPerhitunganV = 0;
    this.alternatifPerhitunganS = [];
    this.alternatifPerhitunganV = [];
  }

  hitungNilaiSdanV() {
    if (this.alternatif.length != this.alternatifPerKriteria.length) {
      this.messageDialog = 'Data Alternatif masih ada yang belum dinilai!!';
      this.showDialog = true;
    } else {
      this.isHitungNilaiSdanV = true;

      const arrNilaiS: any = [];
      let totalNilaiS = 0;
      const arrNilaiV: any = [];
      let totalNilaiV = 0;

      for (
        var outerIndex = 0;
        outerIndex < this.alternatifPerKriteria.length;
        outerIndex++
      ) {
        let value = 1;
        this.alternatifPerKriteria[outerIndex].kriteria.forEach((item: any) => {
          value *= Math.pow(
            item.kriteriaAlternatifValue,
            item.kriteriaAlternatifPangkat
          );
        });
        const obj = {
          kodeAlternatif: this.alternatifPerKriteria[outerIndex].kodeAlternatif,
          namaAlternatif: this.alternatifPerKriteria[outerIndex].alternatif,
          nilaiS: Math.round(value * 100) / 100,
        };

        arrNilaiS.push(obj);
      }

      totalNilaiS =
        Math.round(
          arrNilaiS
            .map((item: any) => item.nilaiS)
            .reduce((prev: any, curr: any) => prev + curr, 0) * 100
        ) / 100;

      for (let index = 0; index < arrNilaiS.length; index++) {
        const element = arrNilaiS[index];
        const valueV = element.nilaiS / totalNilaiS;

        const tes = Math.round(valueV * 100) / 100;

        const obj = {
          kodeAlternatif: element.kodeAlternatif,
          namaAlternatif: element.namaAlternatif,
          nilaiV: Math.round(valueV * 100) / 100,
        };
        arrNilaiV.push(obj);
        this.tempRank.push(obj);
      }

      totalNilaiV =
        Math.round(
          arrNilaiV
            .map((item: any) => item.nilaiV)
            .reduce((prev: any, curr: any) => prev + curr, 0) * 100
        ) / 100;

      this.alternatifPerhitunganS = arrNilaiS;
      this.totalPerhitunganS = totalNilaiS;
      this.alternatifPerhitunganV = arrNilaiV;
      this.totalPerhitunganV = totalNilaiV;
      this.isShowRank = true;
    }
  }

  lihatRangking() {
    this.rangking = this.tempRank.sort((a: any, b: any) => b.nilaiV - a.nilaiV);
  }

  hitungUlang() {
    window.location.reload();
  }

  closeDialog() {
    this.showDialog = false;
  }

  private alertBrowserRefresh() {
    fromEvent(window, 'beforeunload')
      .pipe(filter(() => this.refreshWarn))
      .subscribe((e) => {
        const message = 'You may lose your data if you refresh now';
        (e || window.event).returnValue = !!message;
        return message;
      });
  }
}
