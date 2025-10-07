// Ngenteni kabeh elemen HTML siap digunakake
document.addEventListener('DOMContentLoaded', () => {

    // Deklarasi elemen-elemen sing arep dienggo
    const apiTokenInput = document.getElementById('api-token');
    const searchQueryInput = document.getElementById('search-query');
    const searchButton = document.getElementById('search-button');
    const resultsContainer = document.getElementById('results');
    const loadingIndicator = document.getElementById('loading');
    
    // URL API target
    const apiUrl = 'https://leakosintapi.com/';
    
    // Nambahno event listener nang tombol "Golek!"
    searchButton.addEventListener('click', async () => {
        const token = apiTokenInput.value.trim();
        const query = searchQueryInput.value.trim();

        // Validasi simpel, token lan query gak oleh kosong
        if (!token || !query) {
            resultsContainer.textContent = 'Kesalahan: API Token lan Target Pencarian kudu diisi.';
            return;
        }

        // Tampilno indikator loading, sembunyikan hasil lawas
        loadingIndicator.classList.remove('hidden');
        resultsContainer.textContent = '';

        // Nyiapno data sing arep dikirim (payload)
        // Cek opo query ne luwih teko siji baris
        const requestData = query.includes('\n') ? query.split('\n') : query;

        const payload = {
            token: token,
            request: requestData,
            limit: 300, // Iso diubah sesuai kebutuhan
            type: 'json'
        };

        try {
            // Ngirim permintaan POST nggawe fetch API
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            // Ngubah respons dadi format JSON
            const data = await response.json();

            // Ngecek opo enek error teko API
            if (data["Error code"]) {
                 resultsContainer.textContent = `Error teko API: ${data["Error code"]}`;
            } else {
                 // Nampilno hasil JSON sing wis diformat ben gampang diwoco
                resultsContainer.textContent = JSON.stringify(data, null, 2);
            }

        } catch (error) {
            // Nampilno error nek enek masalah jaringan utowo liyane
            console.error('Error:', error);
            resultsContainer.textContent = `Gagal nyambung nang API. Coba cek koneksi internetmu utowo delok console browser (F12) kanggo info luwih lanjut. Masalah CORS isok dadi penyebab.`;
        } finally {
            // Sembunyikan maneh indikator loading
            loadingIndicator.classList.add('hidden');
        }
    });
});
