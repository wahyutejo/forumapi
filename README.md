# forumapi

1. API dapat menambahkan thread dan mengembalikan response yang sesuai
2. API dapat menambahkan komentar pada thread dan mengembalikan response yang sesuai
3. API dapat menghapus komentar pada thread
4. API dapat melihat detail thread
5. Forum API menerapkan automation testing dengan kriteria berikut:<br>
      ⦁	Unit Testing, menerapkan Unit Testing pada bisnis logika yang ada. Baik di Entities ataupun di Use Case.<br>
      ⦁	Integration Test, menerapkan Integration Test dalam menguji interaksi database dengan Repository.

6. Forum API menerapkan Clean Architecture. Di mana source code terdiri dari 4 layer yaitu:<br>
  ⦁	Entities,tempat penyimpanan data entitas bisnis utama. <br>
  ⦁	Use Case, digunakan sebagai tempat menuliskannya flow atau alur bisnis logika.<br>
  ⦁	Interface Adapter (Repository dan Handler), mediator atau penghubung antara layer framework dengan layer use case.<br>
  ⦁	Frameworks (Database dan HTTP server), level paling luar merupakan bagian yang berhubungan dengan framework.

7. API dapat menambahkan balasan pada komentar
8. API dapat menghapus balasan pada komentar
9. Menerapkan Continuous Integration
10. Menerapkan Continuous Deployment
11. Menerapkan Limit Access
12. Menggunakan Protokol HTTPS
13. API dapat menyukai/batal menyukai komentar thread 

