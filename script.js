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

    // --- PERUBAHAN DIMULAI DI SINI ---

    // Fungsi kanggo nyimpen token nang browser
    const saveTokenToLocalStorage = (token) => {
        localStorage.setItem('osintApiToken', token);
    };

    // Fungsi kanggo njupuk token teko browser
    const loadTokenFromLocalStorage = () => {
        return localStorage.getItem('osintApiToken');
    };

    // Otomatis ngisi kolom token pas halaman dibuka
    const savedToken = loadTokenFromLocalStorage();
    if (savedToken) {
        apiTokenInput.value = savedToken;
    }

    // --- PERUBAHAN SELESAI DI SINI ---
    
    // Nambahno event listener nang tombol "Golek!"
    searchButton.addEventListener('click', async () => {
        const token = apiTokenInput.value.trim();
        const query = searchQueryInput.value.trim();

        // Validasi simpel, token lan query gak oleh kosong
        if (!token || !query) {
            resultsContainer.textContent = 'Kesalahan: API Token lan Target Pencarian kudu diisi.';
            return;
        }
        
        // --- PERUBAHAN TAMBAHAN: Otomatis nyimpen token sing mentas dienggo ---
        saveTokenToLocalStorage(token);

        // Tampilno indikator loading, sembunyikan hasil lawas
        loadingIndicator.classList.remove('hidden');
        resultsContainer.textContent = '';

        // Nyiapno data sing arep dikirim (payload)
        const requestData = query.includes('\n') ? query.split('\n') : query;

        const payload = {
            token: token,
            request: requestData,
            limit: 300,
            type: 'json'
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (data["Error code"]) {
                 resultsContainer.textContent = `Error teko API: ${data["Error code"]}`;
            } else {
                resultsContainer.textContent = JSON.stringify(data, null, 2);
            }

        } catch (error) {
            console.error('Error:', error);
            resultsContainer.textContent = `Gagal nyambung nang API. Coba cek koneksi internetmu utowo delok console browser (F12) kanggo info luwih lanjut.`;
        } finally {
            loadingIndicator.classList.add('hidden');
        }
    });
});
