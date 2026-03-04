const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());

app.get('/api/market', async (req, res) => {
    try {
        const response = await axios.get('https://hasanadiguzel.com.tr/api/kurgetir');
        
        // Listenin tamamını alıp ilk 11 tanesini koparıyoruz
        const tumKurlar = response.data.TCMB_AnlikKurBilgileri;
        const ilkOnBirKur = tumKurlar.slice(0, 11); 
        
        res.json(ilkOnBirKur);
    } catch (error) {
        console.error("Hata oluştu:", error.message);
        res.status(500).json({ error: 'Veriler çekilirken bir aksilik çıktı kanka!' });
    }
});

app.listen(PORT, () => {
    console.log(`Sunucu http://localhost:${PORT} adresinde yayında!`);
});