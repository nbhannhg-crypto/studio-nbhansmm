const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const app = express();

let qrDataUrl = '';
let isReady = false;

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage']
  }
});

client.on('qr', async (qr) => {
  qrDataUrl = await qrcode.toDataURL(qr);
  console.log('QR Generated for studio.nbhansmm.com');
});

client.on('ready', () => {
  isReady = true;
  console.log('WhatsApp Ready!');
});

client.on('message', msg => {
  if(msg.body === '!ping') msg.reply('studio.nbhansmm.com شغال ✅');
});

client.initialize();

app.get('/', (req, res) => {
  if(isReady){
    res.send('<body style="text-align:center;font-family:sans-serif;margin-top:50px"><h1>studio.nbhansmm.com ✅</h1><h2>الواتساب متصل وجاهز</h2><p>ارسل !ping لاي رقم ليرد تلقائيا</p></body>');
  } else if(qrDataUrl){
    res.send(`<body style="text-align:center;font-family:sans-serif;margin-top:30px"><h1>studio.nbhansmm.com</h1><h3>امسح الكود بواتسابك</h3><img src="${qrDataUrl}" width="300" style="border:10px solid #25D366;border-radius:20px"><p>تتحدث الصفحة تلقائيا كل 10 ثواني</p><script>setTimeout(()=>location.reload(),10000)</script></body>`);
  } else {
    res.send('<body style="text-align:center;margin-top:50px;font-family:sans-serif"><h1>جاري تشغيل studio.nbhansmm.com...</h1><p>انتظر 30 ثانية وحدث الصفحة</p><script>setTimeout(()=>location.reload(),15000)</script></body>');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server on '+PORT));
