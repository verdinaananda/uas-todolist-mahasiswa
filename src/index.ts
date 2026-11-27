
import * as readlineSync from "readline-sync";

interface Tugas {
  id: string; // Kode unik tugas, contoh: "TGS-001"
  judul: string; // Nama/judul tugas kuliah
  mataKuliah: string; // Nama mata kuliah terkait
  deadline: string; // Tanggal batas waktu, format "YYYY-MM-DD"
  prioritas: number; // Tingkat prioritas: 1 = Tinggi, 2 = Sedang, 3 = Rendah
  estimasiJam: number; // Perkiraan waktu pengerjaan (dalam jam)
  selesai: boolean; // Status: true = selesai, false = belum selesai
}

let daftarTugas: Tugas[] = [
  { id: "TGS-001", judul: "Laporan Praktikum Basis Data", mataKuliah: "Basis Data", deadline: "2026-11-29", prioritas: 1, estimasiJam: 4, selesai: false },
  { id: "TGS-002", judul: "Tugas Kalkulus Integral", mataKuliah: "Kalkulus II", deadline: "2026-12-02", prioritas: 2, estimasiJam: 3, selesai: false },
  { id: "TGS-003", judul: "Review Jurnal Algoritma", mataKuliah: "Struktur Data", deadline: "2026-11-27", prioritas: 1, estimasiJam: 2, selesai: true },
  { id: "TGS-004", judul: "Makalah Etika Profesi", mataKuliah: "Etika Profesi TI", deadline: "2026-12-10", prioritas: 3, estimasiJam: 5, selesai: false },
  { id: "TGS-005", judul: "Latihan Soal Jaringan Komputer", mataKuliah: "Jaringan Komputer", deadline: "2026-11-30", prioritas: 2, estimasiJam: 2, selesai: false },
];

const JUMLAH_MENU: number = 6; // banyaknya pilihan fitur
const NAMA_APLIKASI: string = "To-Do List Mahasiswa";

function hitungSisaHari(deadline: string): number {
  // Operator aritmatika *: membentuk satuan 1 hari dalam milidetik
  const satuHariMs: number = 1000 * 60 * 60 * 24;
  const sekarang: Date = new Date();
  const batasWaktu: Date = new Date(deadline);

  // Operator aritmatika -: selisih waktu dalam milidetik
  const selisihMs: number = batasWaktu.getTime() - sekarang.getTime();
  // Operator aritmatika /: mengubah milidetik menjadi satuan hari
  const sisaHari: number = selisihMs / satuHariMs;

  return Math.floor(sisaHari);
}

function getLabelPrioritas(prioritas: number): string {
  let label: string; // "let" karena nilainya ditentukan di dalam switch

  switch (prioritas) {
    case 1:
      label = "Tinggi";
      break;
    case 2:
      label = "Sedang";
      break;
    case 3:
      label = "Rendah";
      break;
    default:
      label = "Tidak diketahui";
  }

  return label;
}

// Fungsi untuk menentukan status urgensi tugas berdasarkan sisa hari dan status selesai
function getStatusUrgensi(deadline: string, selesai: boolean): string {
  const sisa: number = hitungSisaHari(deadline);

  // Mengecek status selesai dan sisa hari menggunakan operator perbandingan (===, <, <=)
  if (selesai === true) {
    return "Selesai";
  } else if (sisa < 0) {
    return "Terlambat";
  } else if (sisa <= 2) {
    return "Mendesak";
  } else {
    return "Aman";
  }
}

// Fungsi kerangka untuk menampilkan seluruh daftar tugas
function tampilkanSemuaTugas(): void {
  console.log("\n[Info] Fitur Read (Lihat Semua Tugas) siap dikembangkan pada Progress 4.");
}

// Fungsi kerangka untuk mengubah data tugas berdasarkan ID
function ubahTugasById(id: string): boolean {
  console.log(`\n[Info] Fitur Update untuk ID ${id} siap dikembangkan pada Progress 5.`);
  return false;
}


// nampilin satu tugas, dipake Search sama Delete biar ga nulis ulang
function cetakTugas(tugas: Tugas): void {
  console.log("-------------------------");
  console.log("ID          :", tugas.id);
  console.log("Judul       :", tugas.judul);
  console.log("Mata Kuliah :", tugas.mataKuliah);
  console.log("Deadline    :", tugas.deadline);
  console.log("Prioritas   :", getLabelPrioritas(tugas.prioritas));
  console.log("Estimasi    :", tugas.estimasiJam, "jam");
  console.log("Status      :", tugas.selesai ? "Selesai" : "Belum selesai");
}

// Delete: hapus tugas lewat ID, pake konfirmasi Y/N
function hapusTugas(): void {
  console.log("\n=== HAPUS TUGAS ===");

  const id: string = readlineSync.question("Masukkan ID tugas: ").trim().toUpperCase();
  const index: number = daftarTugas.findIndex((tugas) => tugas.id === id);

  // ID ga ketemu, langsung stop
  if (index === -1) {
    console.log("Tugas dengan ID " + id + " tidak ditemukan!");
    return;
  }

  // tampilin dulu datanya biar ga salah hapus
  cetakTugas(daftarTugas[index]);
  const konfirmasi: string = readlineSync.question("Yakin mau hapus? (Y/N): ").trim().toUpperCase();

  if (konfirmasi === "Y") {
    daftarTugas.splice(index, 1);
    console.log("Tugas " + id + " berhasil dihapus!");
  } else if (konfirmasi === "N") {
    console.log("Penghapusan dibatalkan.");
  } else {
    console.log("Input harus Y atau N, penghapusan dibatalkan.");
  }
}

// Search: cari lewat kata kunci + filter status, terus tampilin jumlah hasil
function cariTugas(): void {
  console.log("\n=== CARI TUGAS ===");

  const keyword: string = readlineSync.question("Kata kunci (judul / mata kuliah): ").trim().toLowerCase();
  if (keyword === "") {
    console.log("Kata kunci tidak boleh kosong!");
    return;
  }

  console.log("Filter status: 1. Semua  2. Belum selesai  3. Selesai");
  const filter: number = Number(readlineSync.question("Pilih filter (1-3): "));
  if (!Number.isInteger(filter) || filter < 1 || filter > 3) {
    console.log("Filter harus 1, 2, atau 3!");
    return;
  }

  let jumlahCocok: number = 0;
  let totalJam: number = 0;

  console.log("\nHasil pencarian:");
  for (const tugas of daftarTugas) {
    // cocok kalo kata kuncinya ada di judul ATAU mata kuliah
    const cocokKeyword: boolean =
      tugas.judul.toLowerCase().includes(keyword) ||
      tugas.mataKuliah.toLowerCase().includes(keyword);

    // cocok status sesuai filter yang dipilih
    const cocokStatus: boolean =
      filter === 1 || (filter === 2 && !tugas.selesai) || (filter === 3 && tugas.selesai);

    if (cocokKeyword && cocokStatus) {
      cetakTugas(tugas);
      jumlahCocok += 1; // compound: tambah 1 tiap ada yang cocok
      totalJam += tugas.estimasiJam; // compound: kumpulin total jam
    }
  }

  if (jumlahCocok === 0) {
    console.log("Tidak ada tugas yang cocok.");
    return;
  }

  // 1 hari kerja = 8 jam, / buat hari dan % buat sisa jam
  const hariKerja: number = Math.floor(totalJam / 8);
  const sisaJam: number = totalJam % 8;

  console.log("-------------------------");
  console.log("Ditemukan " + jumlahCocok + " tugas.");
  console.log("Total estimasi: " + totalJam + " jam (" + hariKerja + " hari kerja " + sisaJam + " jam)");
}