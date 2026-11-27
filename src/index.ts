import * as readlineSync from "readline-sync";

// bentuk data satu tugas
interface Tugas {
  id: string;
  judul: string;
  mataKuliah: string;
  deadline: string;
  prioritas: number;
  estimasiJam: number;
  selesai: boolean;
}

const NAMA_APLIKASI = "TO-DO LIST MAHASISWA";
const JUMLAH_MENU = 6; // menu ke-6 = keluar

// tempat nyimpen semua tugas
const daftarTugas: Tugas[] = [];

// ubah angka prioritas jadi teks
function getLabelPrioritas(prioritas: number): string {
  if (prioritas === 1) return "Tinggi";
  if (prioritas === 2) return "Sedang";
  return "Rendah";
}

// hitung sisa hari dari hari ini sampai deadline
function hitungSisaHari(deadline: string): number {
  const hariIni = new Date();
  const tglDeadline = new Date(deadline);
  const selisih = tglDeadline.getTime() - hariIni.getTime();
  return Math.ceil(selisih / (1000 * 60 * 60 * 24));
}

// nampilin semua tugas yang ada
function tampilkanTugas(): void {
  console.log("\n=== DAFTAR TUGAS ===");

  if (daftarTugas.length === 0) {
    console.log("Belum ada tugas.");
    return;
  }

  for (const tugas of daftarTugas) {
    console.log("-------------------------");
    console.log("ID          :", tugas.id);
    console.log("Judul       :", tugas.judul);
    console.log("Mata Kuliah :", tugas.mataKuliah);
    console.log("Deadline    :", tugas.deadline);
    console.log("Prioritas   :", getLabelPrioritas(tugas.prioritas));
    console.log("Estimasi    :", tugas.estimasiJam, "jam");
    console.log("Status      :", tugas.selesai ? "Selesai" : "Belum selesai");
    console.log("Sisa Hari   :", hitungSisaHari(tugas.deadline));
  }
}

// nambah tugas baru, sekalian validasi input
function tambahTugas(): void {
  console.log("\n=== TAMBAH TUGAS ===");

  const judul = readlineSync.question("Judul tugas: ");
  const mataKuliah = readlineSync.question("Mata kuliah: ");
  const deadline = readlineSync.question("Deadline (YYYY-MM-DD): ");
  const prioritas = Number(readlineSync.question("Prioritas (1 Tinggi, 2 Sedang, 3 Rendah): "));
  const estimasiJam = Number(readlineSync.question("Estimasi jam pengerjaan: "));

  // cek ada yang kosong atau nggak
  if (judul === "" || mataKuliah === "" || deadline === "") {
    console.log("Data tidak boleh kosong!");
    return;
  }

  // prioritas cuma boleh 1, 2, atau 3
  if (prioritas < 1 || prioritas > 3 || !Number.isInteger(prioritas)) {
    console.log("Prioritas harus 1, 2, atau 3!");
    return;
  }

  // estimasi harus angka dan lebih dari 0
  if (estimasiJam <= 0 || isNaN(estimasiJam)) {
    console.log("Estimasi jam harus lebih dari 0!");
    return;
  }

  // bikin ID otomatis, contoh: TGS-001
  const nomorTugas = daftarTugas.length + 1;
  const idBaru = "TGS-" + String(nomorTugas).padStart(3, "0");

  const tugasBaru: Tugas = {
    id: idBaru,
    judul: judul,
    mataKuliah: mataKuliah,
    deadline: deadline,
    prioritas: prioritas,
    estimasiJam: estimasiJam,
    selesai: false,
  };

  daftarTugas.push(tugasBaru);
  console.log("Tugas berhasil ditambahkan!");
}

// tandain tugas jadi selesai berdasarkan ID
function tandaiSelesai(): void {
  console.log("\n=== SELESAIKAN TUGAS ===");

  const id = readlineSync.question("Masukkan ID tugas: ");
  const index = daftarTugas.findIndex((tugas) => tugas.id === id);

  if (index === -1) {
    console.log("Tugas tidak ditemukan!");
    return;
  }

  daftarTugas[index].selesai = true;
  console.log("Tugas berhasil ditandai selesai!");
}

// hapus tugas berdasarkan ID
function hapusTugas(): void {
  console.log("\n=== HAPUS TUGAS ===");

  const id = readlineSync.question("Masukkan ID tugas: ");
  const index = daftarTugas.findIndex((tugas) => tugas.id === id);

  if (index === -1) {
    console.log("Tugas tidak ditemukan!");
    return;
  }

  daftarTugas.splice(index, 1);
  console.log("Tugas berhasil dihapus!");
}

// cari tugas lewat judul atau mata kuliah
function cariTugas(): void {
  console.log("\n=== CARI TUGAS ===");

  const keyword = readlineSync.question("Masukkan judul atau mata kuliah: ").toLowerCase();

  const hasil = daftarTugas.filter(
    (tugas) =>
      tugas.judul.toLowerCase().includes(keyword) ||
      tugas.mataKuliah.toLowerCase().includes(keyword)
  );

  if (hasil.length === 0) {
    console.log("Tugas tidak ditemukan!");
    return;
  }

  for (const tugas of hasil) {
    console.log("-------------------------");
    console.log("ID          :", tugas.id);
    console.log("Judul       :", tugas.judul);
    console.log("Mata Kuliah :", tugas.mataKuliah);
    console.log("Deadline    :", tugas.deadline);
    console.log("Status      :", tugas.selesai ? "Selesai" : "Belum selesai");
  }
}

// menu utama, ngulang terus sampe pilih keluar
function main(): void {
  let pilihan: number;

  do {
    console.log("\n================================");
    console.log("   " + NAMA_APLIKASI);
    console.log("================================");
    console.log("1. Lihat daftar tugas");
    console.log("2. Tambah tugas");
    console.log("3. Tandai tugas selesai");
    console.log("4. Hapus tugas");
    console.log("5. Cari tugas");
    console.log("6. Keluar");

    pilihan = Number(readlineSync.question("Pilih menu: "));

    switch (pilihan) {
      case 1:
        tampilkanTugas();
        break;
      case 2:
        tambahTugas();
        break;
      case 3:
        tandaiSelesai();
        break;
      case 4:
        hapusTugas();
        break;
      case 5:
        cariTugas();
        break;
      case 6:
        console.log("Terima kasih telah menggunakan To-Do List Mahasiswa!");
        break;
      default:
        console.log("Pilihan tidak valid!");
    }
  } while (pilihan !== JUMLAH_MENU);
}

main();
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
