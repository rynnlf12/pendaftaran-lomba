const form = document.getElementById('formPendaftaran');
const lombaCheckboxes = document.querySelectorAll('input[name="lomba"]');
const timContainer = document.getElementById('timContainer');
const totalBiayaEl = document.getElementById('totalBiaya');
const pembayaranSection = document.getElementById('sectionPembayaran');
const pengisianSection = document.getElementById('sectionPengisian');
const buktiInput = document.getElementById('buktiPembayaran');

let totalBiaya = 0;

lombaCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener('change', updateLombaFields);
});

function updateLombaFields() {
  timContainer.innerHTML = '';
  totalBiaya = 0;

  lombaCheckboxes.forEach((checkbox, index) => {
    if (checkbox.checked) {
      const biaya = parseInt(checkbox.dataset.biaya);
      const orangPerTim = parseInt(checkbox.dataset.orang);

      const wrapper = document.createElement('div');
      wrapper.innerHTML = `
        <label>Jumlah Tim untuk ${checkbox.value} (maks. 3 tim)</label>
        <input type="number" name="jumlahTim${index}" min="1" max="3" value="1"
          onchange="updateTimAnggota(this, ${biaya}, ${orangPerTim}, ${index})" required />
        <div id="anggotaTim${index}"></div>
      `;
      timContainer.appendChild(wrapper);
      generateAnggotaInput(1, orangPerTim, index);

      totalBiaya += biaya;
    }
  });

  totalBiayaEl.textContent = totalBiaya.toLocaleString();
}

function generateAnggotaInput(jumlahTim, orangPerTim, index) {
  const container = document.getElementById(`anggotaTim${index}`);
  container.innerHTML = '';
  for (let i = 1; i <= jumlahTim; i++) {
    const timDiv = document.createElement('div');
    timDiv.innerHTML = `<p><strong>Tim ${i}</strong></p>`;
    for (let j = 1; j <= orangPerTim; j++) {
      const input = document.createElement('input');
      input.type = 'text';
      input.name = `tim${index}_anggota${i}_${j}`;
      input.placeholder = `Nama Anggota ${j}`;
      input.required = true;
      timDiv.appendChild(input);
    }
    container.appendChild(timDiv);
  }
}

window.updateTimAnggota = (el, biaya, orangPerTim, index) => {
  let jumlahTim = parseInt(el.value);
  if (jumlahTim > 3) jumlahTim = 3;
  el.value = jumlahTim;

  generateAnggotaInput(jumlahTim, orangPerTim, index);

  totalBiaya = 0;
  lombaCheckboxes.forEach((cb, idx) => {
    if (cb.checked) {
      const inputTim = document.querySelector(`input[name='jumlahTim${idx}']`);
      const jml = Math.min(parseInt(inputTim.value), 3);
      totalBiaya += parseInt(cb.dataset.biaya) * jml;
    }
  });
  totalBiayaEl.textContent = totalBiaya.toLocaleString();
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  pengisianSection.style.display = 'none';
  pembayaranSection.style.display = 'block';
});

function showBankInfo(nama, norek, atasNama) {
  Swal.fire({
    title: `Informasi ${nama}`,
    html: `
      <p><strong>No. Rekening:</strong> ${norek}</p>
      <p><strong>Atas Nama:</strong> ${atasNama}</p>
    `,
    confirmButtonText: 'Tutup'
  });
}

