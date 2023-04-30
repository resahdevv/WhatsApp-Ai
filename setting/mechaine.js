/**
 * Source Code By Reza
 * Don't Forget Smile
 * Thank You :)
*/

require('./config')
const { BufferJSON, WA_DEFAULT_EPHEMERAL, generateWAMessageFromContent, proto, generateWAMessageContent, generateWAMessage, prepareWAMessageMedia, makeInMemoryStore, areJidsSameUser, getContentType } = require("@adiwajshing/baileys");
const fs = require("fs");
const util = require("util");
const chalk = require("chalk");
const toMs = require('ms');
// new module
const { exec } = require("child_process")
const moment = require('moment-timezone');
const axios = require('axios');
const os = require('os');
const speed = require('performance-now');
const { sizeFormatter } = require('human-readable');
const {  getRandom } = require('../src/function');
const request = require('request');
 
const { parseMention } = require('../src/function');
// end
const { Configuration, OpenAIApi } = require("openai");
let setting = require("./api_key.json");
const db_welcome = JSON.parse(fs.readFileSync('./src/db_welcome.json'));

const anonChat = JSON.parse(fs.readFileSync('./src/db_secret.json'))

//code by rezadevv
let signup = JSON.parse(fs.readFileSync('./src/user.json'))
const ban = JSON.parse(fs.readFileSync('./src/banned.json'))
const isBanned = JSON.parse(fs.readFileSync('./src/banned.json'))


// is function
const formatp = sizeFormatter({
  std: 'JEDEC', //'SI' = default | 'IEC' | 'JEDEC'
  decimalPlaces: 2,
  keepTrailingZeroes: false,
  render: (literal, symbol) => `${literal} ${symbol}B`,
})

const isUrl = (url) => {
  return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
}

const jsonformat = (string) => {
  return JSON.stringify(string, null, 2)
}

const getGroupAdmins = (participants) => {
  let admins = []
  for (let i of participants) {
      i.admin === "superadmin" ? admins.push(i.id) :  i.admin === "admin" ? admins.push(i.id) : ''
  }
  return admins || []
}

// Berfungsi Untuk Hit Api & Mengirim Data Headers
const fetchJson = async (url, options) => {
  try {
      options ? options : {}
      const res = await axios({
          method: 'GET',
          url: url,
          headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'
          },
          ...options
      })
      return res.data
  } catch (err) {
      return err
  }
}

const sleep = async (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let dt = moment(Date.now()).tz('Asia/Jakarta').locale('id').format('a')
const ucapanWaktu = "Selamat "+dt.charAt(0).toUpperCase() + dt.slice(1)	
const runtime = function(seconds) {
  seconds = Number(seconds);
  var d = Math.floor(seconds / (3600 * 24));
  var h = Math.floor(seconds % (3600 * 24) / 3600);
  var m = Math.floor(seconds % 3600 / 60);
  var s = Math.floor(seconds % 60);
  var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
  var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
  var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
  return dDisplay + hDisplay + mDisplay + sDisplay;
}

module.exports = reza = async (client, m, chatUpdate, store) => {
  try {
    var body =
      m.mtype === "conversation"
        ? m.message.conversation
        : m.mtype == "imageMessage"
        ? m.message.imageMessage.caption
        : m.mtype == "videoMessage"
        ? m.message.videoMessage.caption
        : m.mtype == "extendedTextMessage"
        ? m.message.extendedTextMessage.text
        : m.mtype == "buttonsResponseMessage"
        ? m.message.buttonsResponseMessage.selectedButtonId
        : m.mtype == "listResponseMessage"
        ? m.message.listResponseMessage.singleSelectReply.selectedRowId
        : m.mtype == "templateButtonReplyMessage"
        ? m.message.templateButtonReplyMessage.selectedId
        : m.mtype === "messageContextInfo"
        ? m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text
        : "";
  
    var budy = typeof m.text == "string" ? m.text : "";
    // var prefix = /^[\\/!#.]/gi.test(body) ? body.match(/^[\\/!#.]/gi) : "/"
    var prefix = /^[\\/!#.]/gi.test(body) ? body.match(/^[\\/!#.]/gi) : "/";
    const isCmd2 = body.startsWith(prefix);
    const command = body.replace(prefix, "").trim().split(/ +/).shift().toLowerCase();
    const args = body.trim().split(/ +/).slice(1);
    const pushname = m.pushName || "No Name";
    const botNumber = await client.decodeJid(client.user.id);
    const isCreator = [botNumber, ...global.owner].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(m.sender)
    const isBanned = ban.includes(m.sender)    
    const itsMe = m.sender == botNumber ? true : false;
    let text = (q = args.join(" "));
    const fatkuns = (m.quoted || m)
    const quoted = (fatkuns.mtype == 'buttonsMessage') ? fatkuns[Object.keys(fatkuns)[1]] : (fatkuns.mtype == 'templateMessage') ? fatkuns.hydratedTemplate[Object.keys(fatkuns.hydratedTemplate)[1]] : (fatkuns.mtype == 'product') ? fatkuns[Object.keys(fatkuns)[0]] : m.quoted ? m.quoted : m
    const mime = (quoted.msg || quoted).mimetype || ''
    const qmsg = (quoted.msg || quoted)
    const arg = budy.trim().substring(budy.indexOf(" ") + 1);
    const arg1 = arg.trim().substring(arg.indexOf(" ") + 1);
    

    const from = m.chat;
    const reply = m.reply;
    const sender = m.sender;
    const mek = chatUpdate.messages[0];
    
    const color = (text, color) => {
      return !color ? chalk.green(text) : chalk.keyword(color)(text);

      client.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
    };

    // Group
    const groupMetadata = m.isGroup ? await client.groupMetadata(m.chat).catch((e) => {}) : "";
    const groupName = m.isGroup ? groupMetadata.subject : "";
    const participants = m.isGroup ? await groupMetadata.participants : ''
    const groupAdmins = m.isGroup ? await getGroupAdmins(participants) : ''
    const isBotAdmins = m.isGroup ? groupAdmins.includes(botNumber) : false
    const isAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false
    const isUser = signup.includes(sender)
    global.isWelcome = m.isGroup ? db_welcome.includes(from) : false


    // Push Message To Console
    let argsLog = budy.length > 30 ? `${q.substring(0, 30)}...` : budy;

    // Update Bio
    if (autobio === "true") {
		  await client.updateProfileStatus(`${packname} | Runtime : ${runtime(process.uptime())}`)
    }

    // Jika ada user
    if (isCmd2 && !isUser) {
      signup.push(sender)
      fs.writeFileSync('./src/user.json', JSON.stringify(signup, null, 2))
    }

    if (isCmd2 && !m.isGroup) {
      console.log(chalk.black(chalk.bgGreen("[ PESAN ]")), color(argsLog, "turquoise"), chalk.magenta("Dari"), chalk.green(pushname), chalk.yellow(`[ ${m.sender.replace("@s.whatsapp.net", "@s.whatsapp.net")} ]`));
    } else if (isCmd2 && m.isGroup) {
      console.log(
        chalk.black(chalk.bgGreen("[ PESAN ]")),
        color(argsLog, "turquoise"),
        chalk.magenta("Dari"),
        chalk.green(pushname),
        chalk.yellow(`[ ${m.sender.replace("@s.whatsapp.net", "@s.whatsapp.net")} ]`),
        chalk.blueBright("Group"),
        chalk.green(groupName)
      );
    }

    // Secret Message
    const roomChat = Object.values(anonChat).find(room => [room.a, room.b].includes(sender) && room.state == 'CHATTING')
    const roomA = Object.values(anonChat).find(room => room.a == m.sender)
    const roomB = Object.values(anonChat).find(room => room.b == m.sender )
    const room = Object.values(anonChat).find(room => room.state == 'WAITING' && room.b == "")

    if (roomChat && !isCmd2 && !m.isGroup && roomChat.b !=="") {
      let other = [roomChat.a, roomChat.b].find(user => user !== sender)
      m.copyNForward(other, true)
      }

      if (room && Date.now() >= room.expired) {
        await client.sendMessage(room.a, {text:"```Not Found```"})
        anonChat.splice(anonChat.indexOf(room, 1)) 
        fs.writeFileSync('./src/db_secret.json', JSON.stringify(anonChat))
      }

    if (isCmd2) {
      switch (command) {
        case "help": case "menu":
          if (isBanned) return m.reply(`*You Have Been Banned*`)
            anu = `*WhatsApp-Ai Version 1.5.0*\n\n➥ *Bot Information*\n*Hai Kak ${m.pushName} ${ucapanWaktu}📍*\n➤ _Nama Bot: ${packname}_\n➤ _Nama Owner: ${author}_\n➤ _Runtime: ${runtime(process.uptime())}_\n➤ _Pengguna: ${signup.length}_\n\n➥ *Logs Updated*\n✔Fixed Bug\n✔Added DALL-E\n✔Added Sticker\n✔Added Gempa\n✔Added Shortlink\n✔Added Tiktoknowm\n✔Added Tiktokmp3\n✔Added Ayat Kursi\n\n*(ChatGPT)*\nMess: ${prefix}ai presiden indonesia\n\n*(DALL-E)*\nMess: ${prefix}img gambar gunung\n\n╭──❒ *All MENU BOT*\n*OPEN AI*\n├• 📌 ${prefix}ai presiden indonesia\n├• 📌 ${prefix}img gambar gunung\n\n*DOWNLOADER*\n├• 📌 ${prefix}tiktoknowm [url]\n├• 📌 ${prefix}tiktokmp3 [url]\n├• 📌 ${prefix}ytmp4 [url]\n├• 📌 ${prefix}ytshorts\n\n*INFORMATION*\n├• 📌 ${prefix}jadwalsholat [kota]\n├• 📌 ${prefix}gempa\n├• 📌 ${prefix}kompasnews\n\n*ISLAMIC SOCIAL*\n├• 📌 ${prefix}alquran\n├• 📌 ${prefix}asmaulhusna\n├• 📌 ${prefix}ayatkursi\n\n*INTERNET ENGINERING*\n├• 📌 ${prefix}inspect [link group]\n├• 📌 ${prefix}getpp [no tujuan]\n├• 📌 ${prefix}gitclone UrlRepo\n├• 📌 ${prefix}whoisip [public ip]\n├• 📌 ${prefix}tourl [reply image]\n├• 📌 ${prefix}shortlink\n├• 📌 ${prefix}verif [nomor target]\n├• 📌 ${prefix}kenon [nomor target]\n\n*HAVE FUN*\n├• 📌 ${prefix}anime\n├• 📌 ${prefix}ilove 6285xxxxxxxxx\n├• 📌 ${prefix}jodohku\n├• 📌 ${prefix}sticker [reply image/video]\n├• 📌 ${prefix}secret 6285xxxxxxxx|Secret|Hi\n├• 📌 ${prefix}toaudio [text]\n\n*PHOTO EDITOR*\n├• 📌 ${prefix}jadianime [reply image]\n\n*TOOLS & GROUP*\n├• 📌 ${prefix}pushkontak [owner only]\n├• 📌 ${prefix}pushuser [owner only]\n├• 📌 ${prefix}pushid [owner only]\n├• 📌 ${prefix}tagall\n├• 📌 ${prefix}hidetag [text]\n├• 📌 ${prefix}creategroup [nama_group]\n├• 📌 ${prefix}kick [@user]\n├• 📌 ${prefix}add [user no]\n├• 📌 ${prefix}block [owner only]\n├• 📌 ${prefix}unblock [owner only]\n├• 📌 ${prefix}ban [owner only]\n├• 📌 ${prefix}unban [owner only]\n├• 📌 ${prefix}getip [owner only]\n├• 📌 ${prefix}ping [owner only]\n├• 📌 ${prefix}group [open/close]\n├• 📌 ${prefix}owner [owner contact]\n├• 📌 ${prefix}listonline\n└────────────>`
            client.sendText(m.chat, anu, m)
            break;
        case "ai": case "openai":
          if (isBanned) return m.reply(`*You Have Been Banned*`)
          try {
            if (setting.keyopenai === "ISI_APIKEY_OPENAI_DISINI") return reply("Mohon Isi Api Di api_key.json");
            if (!text) return reply(`Chat dengan AI.\n\nContoh:\n${prefix}${command} Apa itu resesi`);
            const configuration = new Configuration({
              apiKey: setting.keyopenai,
            });
            const openai = new OpenAIApi(configuration);

            const response = await openai.createCompletion({
              model: "text-davinci-003",
              prompt: text,
              temperature: 0.3,
              max_tokens: 2000,
              top_p: 1.0,
              frequency_penalty: 0.0,
              presence_penalty: 0.0,
            });
            m.reply(`${response.data.choices[0].text}`);
          } catch (error) {
          if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
            console.log(`${error.response.status}\n\n${error.response.data}`);
          } else {
            console.log(error);
            m.reply("Maaf, sepertinya ada yang error :"+ error.message);
          }
        }
          break;
        case "img": case "ai-img": case "image": case "images":
          if (isBanned) return m.reply(`*You Have Been Banned*`)
          try {
            if (setting.keyopenai === "ISI_APIKEY_OPENAI_DISINI") return reply("Mohon Isi Api Di api_key.json");
            if (!text) return reply(`Membuat gambar dari AI.\n\nContoh:\n${prefix}${command} Gamabar gunung`);
            const configuration = new Configuration({
              apiKey: setting.keyopenai,
            });
            const openai = new OpenAIApi(configuration);
            m.reply(mess.wait)
            const response = await openai.createImage({
              prompt: text,
              n: 1,
              size: "512x512",
            });
            //console.log(response.data.data[0].url)
            client.sendImage(from, response.data.data[0].url, text, mek);
            } catch (error) {
          if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
            console.log(`${error.response.status}\n\n${error.response.data}`);
          } else {
            console.log(error);
            m.reply("Maaf, sepertinya ada yang error :"+ error.message);
          }
        }
        break;
        case "inspect" : {
          if (!isCreator) return m.reply(mess.owner)
          if (!args[0]) return m.reply('```Link Not Found```')
          let linknya = args.join(" ");
          let url_obj = linknya.split("https://chat.whatsapp.com/")[1];
          if (!url_obj) return m.reply('```Link Invalid```');
          m.reply('```Checking This Group...```')
          client.query({
            tag: "iq",
            attrs: {
              type: "get",
              xmlns: "w:g2",
              to: "@g.us"
            },
            content: [{ tag: "invite", attrs: { code: url_obj } }]
          }).then(async(res) => {
            teks = `「 Group Link Inspected 」\n\n▸ _Group Name_ : *_${res.content[0].attrs.subject ? res.content[0].attrs.subject : "undefined"}_*\n▸ _Desc Change_ : *_${res.content[0].attrs.s_t ? moment(res.content[0].attrs.s_t *1000).tz("Asia/Jakarta").format("DD-MM-YYYY, HH:mm:ss") : "undefined"}_*\n▸ _Group Creator : *_${res.content[0].attrs.creator ? "@" + res.content[0].attrs.creator.split("@")[0] : "undefined"}_*\n▸ _Group Made_ : *_${res.content[0].attrs.creation ? moment(res.content[0].attrs.creation * 1000).tz("Asia/Jakarta").format("DD-MM-YYYY, HH:mm:ss") : "undefined"}_*\n▸ _Member Length_ : *_${res.content[0].attrs.size ? res.content[0].attrs.size : "undefined"}_*\n▸ _ID_  : *_${res.content[0].attrs.id ? res.content[0].attrs.id : "undefined"}_*`;
            try {
              ppgroup = await client.profilePictureUrl(res.content[0].attrs.id + "@g.us", "image");
            } catch {
              ppgroup = "https://tinyurl.com/yx93l6da";
            }
            client.sendFileUrl(from, ppgroup, "", m, { caption: teks, mentions: await parseMention(teks) });
          })

        }
        break;
        case "secret" : case "confes" : {
          if (isBanned) return m.reply(`*You Have Been Banned*`)
          if (m.isGroup) return m.reply('Khusus Private Chat')
          let nomor = text.split("|")[0].replace(/[^0-9]/g, '')
          let pengirim = text.split("|")[1]
          let pesan = text.split("|")[2]
          let cek_nomor = await client.onWhatsApp(nomor + '@s.whatsapp.net') 
          if (cek_nomor.length === 0) return m.reply('```Nomor Tidak Terdaftar Di WhatsApp```')
          if (nomor === botNumber.replace("@s.whatsapp.net", "")) return m.reply('```Ini Adalah Nomor Bot```')
          if (nomor === sender.replace("@s.whatsapp.net", "")) return m.reply('```Ini Adalah Nomor Anda```')
          if (!nomor && !pengirim && !pesan) return m.reply(`Lengkapi Semua Dengan Format ${prefix + command} 6285xxxxxxxxx|Reyhan|Halo Anisa`)
          let text_nya = `*----PESAN RAHASIA----*\n\n_Ada pesan rahasia buat kamu nih balas dengan sopan yah pesan ini hanya terhubung dengan anda dan pengirim pesan!_\n\n👉Dari: ${pengirim}\n💌Pesan: ${pesan}`
          let buttons = [
            { buttonId : `${prefix}create_room_chat ${sender.replace("@s.whatsapp.net", "")} `, buttonText: { displayText: 'Terima Pesan 😊' }, type: 1 }
          ]
          client.sendButtonText(nomor + '@s.whatsapp.net', buttons, text_nya, 'click button reply message', m)
          setTimeout(() => {
            m.reply('```Sukses Mengirim Secret Message```')
          }, 3000)
        }
        break;
        case "create_room_chat" : {
          if (isBanned) return m.reply(`*You Have Been Banned*`)
          if (m.isGroup) return m.reply('Khusus Private Chat')
          if (!text) return m.reply('```Text Not Found```')
          if (roomA || roomB) return m.reply(`_Kamu sedang dalam room chat ketik ${prefix}stopsecret untuk menghapus sesi_`)
          client.sendMessage(text + '@s.whatsapp.net', {text: 'Chat Secret Terhubung✓'})
          let id = + new Date
          const obj = {
            id,
            a: sender,
            b: text + '@s.whatsapp.net',
            state: "CHATTING",
            expired: "5m"
          }
          anonChat.push(obj)
          fs.writeFileSync('./src/db_secret.json', JSON.stringify(anonChat))
          setTimeout(() => {
            m.reply(`*_Anda Sudah Dapat Mengirim Pesan Dengan Pengirim Pesan Rahasia Sebelumnya_*\n\nKetik ${prefix}stopsecret untuk mengahpus sesi ini`)
          }, 3000)
        }
        break;
        case "stopsecret" : {
          if (isBanned) return m.reply(`*You Have Been Banned*`)
          if (m.isGroup) return m.reply('Khusus Private Chat')
          if(roomA && roomA.state == "CHATTING"){
            await client.sendMessage(roomA.b, {text: '```Yah dia telah meninggalkan chat :)```'})
            await setTimeout(() => {
              m.reply('```Kamu telah keluar dari sesi ini```')
              roomA.a = roomA.b
              roomA.b = ""
              roomA.expired = Date.now() + toMs("5m")
              fs.writeFileSync('./src/db_secret.json', JSON.stringify(anonChat))
            }, 1000)
          } else if(roomA && roomA.state == "WAITING"){
            m.reply('```Kamu telah keluar dari sesi ini```')
            anonChat.splice(anonChat.indexOf(roomA, 1))
            fs.writeFileSync('./src/db_secret.json', JSON.stringify(anonChat))
          } else if(roomB && roomB.state == "CHATTING"){
            await client.sendMessage(roomB.a,{text: `_Partnermu telah meninggalkan sesi_`})
            m.reply("```Kamu telah keluar dari sesi dan meninggalkan nya```")
            roomB.b =""
            roomB.state = "WAITING"
            roomB.expired = Date.now() + toMs("5m")
            fs.writeFileSync('./src/db_secret.json', JSON.stringify(anonChat))
          } else m.reply('```Kamu Tidak Berada Dalam Sesi```')
        }
        break;
        case "pushid" : {
          if (!isCreator) return m.reply(mess.owner)
          let idgc = text.split("|")[0]
          let pesan = text.split("|")[1]
          if (!idgc && !pesan) return m.reply(`Example: ${prefix + command} idgc|pesan`)
          let metaDATA = await client.groupMetadata(idgc).catch((e) => {m.reply(e)})
          let getDATA = await metaDATA.participants.filter(v => v.id.endsWith('.net')).map(v => v.id);
          let count = getDATA.length;
          let sentCount = 0;
          m.reply('*_Sedang Push ID..._*')
          for (let i = 0; i < getDATA.length; i++) {
            setTimeout(function() {
              client.sendMessage(getDATA[i], { text: pesan });
              count--;
              sentCount++;
              if (count === 0) {
                m.reply(`*_Semua pesan telah dikirim!_*:\n*_Jumlah pesan terkirim:_* *_${sentCount}_*`);
              }
            }, i * 6000); // delay of 6 second
          }
        }
        break;
        case "pushuser" : {
          if (!isCreator) return m.reply(mess.owner)
          if (!text) return m.reply(`Example ${prefix}${command} Hi Semuanya`)
          let signup = JSON.parse(fs.readFileSync('./src/user.json'))
            let count = signup.length;
            let sentCount = 0; 
            m.reply('*_Sedang Push User..._*');
            for (let i = 0; i < signup.length; i++) {
              setTimeout(function() {
                client.sendMessage(signup[i], { text: text });
                count--;
                sentCount++;
                if (count === 0) {
                  m.reply(`*_Semua pesan telah dikirim!_*:\n*_Jumlah pesan terkirim:_* *_${sentCount}_*`);
                }
              }, i * 1000); // delay setiap pengiriman selama 1 detik
            } 
          }
        break;
        case "pushkontak" : {
          if (!text) return m.reply(`Example ${prefix}${command} Hi Semuanya`)
          if (!isCreator) return m.reply(mess.owner)
          if (!m.isGroup) return m.reply(mess.group)
          let get = await participants.filter(v => v.id.endsWith('.net')).map(v => v.id);
          let count = get.length;
          let sentCount = 0;
          m.reply('*_Sedang Push Kontak..._*');
          for (let i = 0; i < get.length; i++) {
            setTimeout(function() {
              client.sendMessage(get[i], { text: text });
              count--;
              sentCount++;
              if (count === 0) {
                m.reply(`*_Semua pesan telah dikirim!_*:\n*_Jumlah pesan terkirim:_* *_${sentCount}_*`);
              }
            }, i * 1000); // delay setiap pengiriman selama 1 detik
          }
        }
        break;
        case "getpp" :
          if (!isCreator) return m.reply(mess.owner)
          if (!text) return m.reply('```Massukan No Tujuan```')
          m.reply(mess.wait)
          try {
            ppuser = await client.profilePictureUrl(text.replace(/[^0-9]/g, '')+'@s.whatsapp.net', "image");
          } catch {
            ppuser = "https://tinyurl.com/yx93l6da";
          }
          client.sendMessage(from, {
            image: { url: ppuser },
            mentions: [text],
            caption: `This is profile @${text.replace(/[^0-9]/g, '').split("@")[0]}`,
          });
        break;
        case "ilove" : {
          if (isBanned) return m.reply(`*You Have Been Banned*`)
          if (!text) return m.reply(`Example ${prefix}${command} 62857xxxxxxxx`)
          let i = 1;
          let isWaitingDisplayed = false;
          function sendLoveMessage() {
            if (!isWaitingDisplayed) {
              // Menampilkan pesan "Menunggu..." hanya sekali sebelum proses pengiriman pesan dimulai
              m.reply("```Menunggu...```");
              isWaitingDisplayed = true;
            }
            client.sendMessage(text.replace(/[^0-9]/g, '') + '@s.whatsapp.net', { text: "```I Love You``` " + i + " ```%``` ❤" });
            i++;
            if (i <= 100) {
              setTimeout(sendLoveMessage, 1000); // kirim pesan setiap 1 detik
            } else {
              // Menampilkan pesan "Selesai! Mengirim Love" setelah semua pesan cinta dikirim
              m.reply("```Selesai! Mengirim Love```");
            }
          }
          sendLoveMessage();
        }
        break;
        case "hidetag" : {
          if (!m.isGroup) return reply(mess.group)
          if (!isAdmins) return reply(mess.admin)
          client.sendMessage(m.chat, { text : q ? q : '' , mentions: participants.map(a => a.id)}, { quoted: m })
        }
        break;
        case 'getidgc' :
        if (!m.isGroup) return m.reply(mess.group)
        m.reply (`${m.chat}`)
        break;
        case 'owner': case 'creator': {
          client.sendContact(m.chat, global.owner, m)
      }
      break;
      case 'group' : {
        if (!isCreator) return m.reply(mess.owner)
        if (!m.isGroup) return m.reply(mess.group)
        if (!isBotAdmins) return m.reply(mess.botAdmin)
        if (!isAdmins) return m.reply(mess.admin)
        if (text === 'close') {
          await client.groupSettingUpdate(m.chat, 'announcement').then ((res) => m.reply('_Successful Closing The Group_')).catch ((err) => m.reply(jsonformat(err)))
        } else if (text === 'open') {
          await client.groupSettingUpdate(m.chat, 'not_announcement').then ((res) => m.reply('_Successful Opening The Group_')).catch ((err) => m.reply(jsonformat(err)))
        } else {
          let buttons = [
            { buttonId: prefix + 'group open', buttonText: { displayText: 'Open' }, type: 1 },
            { buttonId: prefix + 'group close', buttonText: { displayText: 'Close' }, type: 1 },
          ]
          await client.sendButtonText(m.chat, buttons, 'Group Mode', packname, m)
        }
      }
      break;
      case "welcome" : {
        if (isBanned) return m.reply(`*You Have Been Banned*`)
        if (!m.isGroup) return m.reply(mess.group)
        if (text === 'on') {
          if (isWelcome) return m.reply('```Welcome Sudah Aktif```')
          db_welcome.push(from)
          fs.writeFileSync('./src/db_welcome.json', JSON.stringify(db_welcome))
          m.reply('_Successful Turn On Welcome In Group:_ \n'+groupName)
        } else if (text === 'off') {
          db_welcome.splice(from, 1)
          fs.writeFileSync('./src/db_welcome.json', JSON.stringify(db_welcome))
          m.reply('_Successful Turn Off Welcome In Group:_ \n'+groupName)
        } else {
          let buttons = [
            { buttonId: prefix + 'welcome on', buttonText: { displayText: 'On' }, type: 1 },
            { buttonId: prefix + 'welcome off', buttonText: { displayText: 'Off' }, type: 1 },
          ]
          await client.sendButtonText(m.chat, buttons, 'Group Welcome', packname, m)
        }
      }
      break;
      case "gitclone" : {
        if (!args[0]) return m.reply(`Example: ${prefix + command} UrlRepo`)
        let regex = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i
        if (!regex.test(args[0])) return m.reply('```Link Incoret```')
        let [, user, repo] = args[0].match(regex) || []
        if (!repo) return m.reply('```Repo tidak ditemukan```')
        repo = repo.replace(/.git$/, '')
        let url = `https://api.github.com/repos/${user}/${repo}/zipball`
        m.reply(`*_Sedang Clone Repository_*\n\n🌟 _User:_ *_${user}_*\n🌟 _Repo:_ *_${repo}_*\n\n_Loading!..._`)
        client.sendFileUrl(m.chat, url, '_Successful Clone Repo_', m)
      }
      break;
      case "jadianime" : {
        if (isBanned) return m.reply(`*You Have Been Banned*`)
        if (!quoted) return  m.reply(`_Reply to Supported media With Caption ${prefix + command}_`)
        if (/image/.test(mime)) {
          m.reply(mess.wait)
          let download = await client.downloadAndSaveMediaMessage(quoted)
          file_name = getRandom('jpg')
          request({
            url: api("zenz", `/photoeditor/${command}`, {}, "apikey"),
            method: 'POST',
            formData: {
              "sampleFile": fs.createReadStream(download)
            },
            encoding: "binary"
          }, async function(error, response, body) {
            fs.unlinkSync(download)
            fs.writeFileSync(file_name, body, "binary")
            await client.sendMessage(m.chat, { image: fs.readFileSync(file_name), caption: 'Generate ' + command.replace("jadianime", "Jadi Anime")}, { quoted: m }).then(() => {
              fs.unlinkSync(file_name)
            })
          });
        } else {
          return m.reply(`_Reply to Supported media With Caption ${prefix + command}_`, m.from, { quoted: m })
        }
      }
      case "kenon": {
        if (!isCreator) return m.reply(mess.owner)
        if (!q) return m.reply('```Nomor Target!```')
        let nomor_target = q.replace(/[^0-9]/g, '')
        let cekno = await client.onWhatsApp(nomor_target)
        if (cekno.length == 0) return m.reply('```Number Not Found```')
        if (nomor_target == owner) return m.reply('```Dont Verif My Creator!```')
        try {
          m.reply('```Operation Run...```' + nomor_target)
          var axioss = require('axios')
          let ntah = await axioss.get("https://www.whatsapp.com/contact/?subject=messenger")
          let email = await axioss.get("https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=190308")
          let cookie = ntah.headers["set-cookie"].join("; ")
          const cheerio = require('cheerio');
          let $ = cheerio.load(ntah.data)
          let $form = $("form");
          let url = new URL($form.attr("action"), "https://www.whatsapp.com").href
          let form = new URLSearchParams()
          form.append("jazoest", $form.find("input[name=jazoest]").val())
          form.append("lsd", $form.find("input[name=lsd]").val())
          form.append("step", "submit")
          form.append("country_selector", "INDONESIA")
          form.append("phone_number", nomor_target,)
          form.append("email", email.data[0])
          form.append("email_confirm", email.data[0])
          form.append("platform", "ANDROID")
          form.append("your_message", `Perdido/roubado: desative minha conta`)
          form.append("__user", "0")
          form.append("__a", "1")
          form.append("__csr", "")
          form.append("__req", "8")
          form.append("__hs", "19316.BP:whatsapp_www_pkg.2.0.0.0.0")
          form.append("dpr", "1")
          form.append("__ccg", "UNKNOWN")
          form.append("__rev", "1006630858")
          form.append("__comment_req", "0")
          let res = await axioss({
            url,
            method: "POST",
            data: form,
            headers: {
              cookie
            }
          })
          let payload = String(res.data)
          if (payload.includes(`"payload":true`)) {
            m.reply('```Succes.. Nomor Telah Out!```')
          } else if (payload.includes(`"payload":false`)) {
            m.reply('```Operation Failed... Try Again```')
          } else m.reply(util.format(res.data))
        } catch (err) {m.reply(`${err}`)}
      }
      break;
      case "verif" : {
      if (!isCreator) return m.reply(mess.owner)
        if (!q) return m.reply('```Nomor Target!```')
        let nomor_target = q.replace(/[^0-9]/g, '')
        let cekno = await client.onWhatsApp(nomor_target)
        if (cekno.length == 0) return m.reply('```Number Not Found```')
        if (nomor_target == owner) return m.reply('```Dont Verif My Creator!```')
        try {
          m.reply('```Operation Run...```' + nomor_target)
          var axioss = require('axios')
          let ntah = await axioss.get("https://www.whatsapp.com/contact/noclient/")
          let email = await axioss.get("https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=2022")
          let cookie = ntah.headers["set-cookie"].join("; ")
          const cheerio = require('cheerio');
          let $ = cheerio.load(ntah.data)
          let $form = $("form");
          let url = new URL($form.attr("action"), "https://www.whatsapp.com").href
          let form = new URLSearchParams()
          form.append("jazoest", $form.find("input[name=jazoest]").val())
          form.append("lsd", $form.find("input[name=lsd]").val())
          form.append("step", "submit")
          form.append("country_selector", "INDONESIA")
          form.append("phone_number", nomor_target,)
          form.append("email", email.data[0])
          form.append("email_confirm", email.data[0])
          form.append("platform", "ANDROID")
          form.append("your_message", `Perdido/roubado: desative minha conta`)
          form.append("__user", "0")
          form.append("__a", "1")
          form.append("__csr", "")
          form.append("__req", "8")
          form.append("__hs", "19316.BP:whatsapp_www_pkg.2.0.0.0.0")
          form.append("dpr", "1")
          form.append("__ccg", "UNKNOWN")
          form.append("__rev", "1006630858")
          form.append("__comment_req", "0")
          let res = await axioss({
            url,
            method: "POST",
            data: form,
            headers: {
              cookie
            }
          })
          let payload = String(res.data)
          if (payload.includes(`"payload":true`)) {
            m.reply('```Succes.. Nomor Telah Out!```')
          } else if (payload.includes(`"payload":false`)) {
            m.reply('```Operation Failed... Try Again```')
          } else m.reply(util.format(res.data))
        } catch (err) {m.reply(`${err}`)}
      }
      break;
      case 'restart' : {
      if (!isCreator) return m.reply(mess.owner)
      await m.reply(`_Restarting ${packname}_`)
      try{
        await client.sendMessage(from, {text: "*_Succes_*"})
        await sleep(3000)
        exec(`npm start`)
      } catch (err) {
        exec(`node index.js`)
        await sleep(4000)
        m.reply('*_Sukses_*')
      }
    }
      break;
      case 'whoisip': {
        if (isBanned) return m.reply(`*You Have Been Banned*`)
        if (!text) throw `Example : ${prefix + command} 192.168.152.24`
        m.reply(mess.wait)
        let anu = await fetchJson(api('lol', '/api/ipaddress/'+text, {}, 'apikey'))
        client.sendMessage(m.chat, { image: { url: 'https://telegra.ph/file/94b5d3acb51c1eea47b22.png' }, caption: `⭔ Country : ${anu.result.country}\n⭔ Country Code : ${anu.result.countryCode}\n⭔ Region : ${anu.result.region}\n⭔ Region Name : ${anu.result.regionName}\n⭔ City : ${anu.result.city}\n⭔ Zip : ${anu.result.zip}\n⭔ Lat : ${anu.result.lat}\n⭔ Lon : ${anu.result.lon}\n⭔ Time Zone : ${anu.result.timezone}\n⭔ Isp : ${anu.result.isp}\n⭔ Org : ${anu.result.org}\n⭔ As : ${anu.result.as}\n⭔ Query : ${anu.result.query}`}, { quoted: m })
    }
      break;
      case 'listonline': case 'liston': {
        if (isBanned) return m.reply(`*You Have Been Banned*`)
        let id = args && /\d+\-\d+@g.us/.test(args[0]) ? args[0] : m.chat
        let online = [...Object.keys(store.presences[id]), botNumber]
        client.sendText(m.chat, 'List Online:\n\n' + online.map(v => '⭔ @' + v.replace(/@.+/, '')).join`\n`, m, { mentions: online })
 }
      break;
      case 'tourl': {
        if (isBanned) return m.reply(`*You Have Been Banned*`)
        m.reply(mess.wait)
        let { UploadFileUgu, webp2mp4File, TelegraPh } = require('./uploader')
        let media = await client.downloadAndSaveMediaMessage(qmsg)
        if (/image/.test(mime)) {
            let anu = await TelegraPh(media)
            m.reply(util.format(anu))
        } else if (!/image/.test(mime)) {
            let anu = await UploadFileUgu(media)
            m.reply(util.format(anu))
        }
        await fs.
        unlinkSync(media)
    }
    break;
    case 'toaudio': {
      if (isBanned) return m.reply(`*You Have Been Banned*`)
      if (!text) throw `Example : ${prefix + command} Hallo semua`
      m.reply(mess.wait)
        client.sendMessage(m.chat, {audio: { url: `https://api.lolhuman.xyz/api/gtts/id?apikey=${lolkey}&text=${text}` }, mimetype: 'audio/mpeg'}, { quoted : m })

    }

    break;
    case 'alquran': {
      if (!args[0]) throw `Contoh penggunaan:\n${prefix + command} 1 2\n\nmaka hasilnya adalah surah Al-Fatihah ayat 2 beserta audionya, dan ayatnya 1 aja`
      if (!args[1]) throw `Contoh penggunaan:\n${prefix + command} 1 2\n\nmaka hasilnya adalah surah Al-Fatihah ayat 2 beserta audionya, dan ayatnya 1 aja`
      let res = await fetchJson(`https://api.zahwazein.xyz/islami/quran/${args[0]}/${args[1]}?apikey=${zenzkey}`)
      if (res.status == false) return m.reply(res.result.message)
      let txt = `*Arab* : ${res.result.text.arab}\n\n*English* : ${res.result.translation.en}\n\n*Indonesia* : ${res.result.translation.id}\n\n( Q.S ${res.result.surah.name.transliteration.id} : ${res.result.number.inSurah} )`
      m.reply(txt)
      client.sendMessage(m.chat, {audio: { url: res.result.audio.primary }, mimetype: 'audio/mpeg'}, { quoted : m })
      }
      break;
      case 'ayatkursi': {
        if (isBanned) return m.reply(`*You Have Been Banned*`)
        m.reply(mess.wait)
        let eza = await fetchJson(`https://saipulanuar.ga/api/muslim/ayatkursi`)
        client.sendMessage(m.chat, { image: { url: 'https://telegra.ph/file/94b5d3acb51c1eea47b22.png' }, caption: `⭔ Nama : *Ayat Kursi*\n\n⭔ Arab : ${eza.result.arabic}\n\n⭔ Latin : ${eza.result.latin}\n\n⭔ Artinya : ${eza.result.translation}`}, { quoted: m })
		}
    break;
    case 'anime': case 'waifu': case 'husbu': case 'neko': case 'shinobu': case 'megumin': {
      if (isBanned) return m.reply(`*You Have Been Banned*`)
      m.reply(mess.wait)
      client.sendMessage(m.chat, { image: { url: api('zenz', '/randomanime/'+command, {}, 'apikey') }, caption: 'Generate Random ' + command }, { quoted: m })
  }
    break;
    case 'join': {
      if (isBanned) return m.reply(`*You Have Been Banned*`)
      if (!isCreator) throw mess.owner
      if (!text) throw 'Masukkan Link Group!'
      if (!isUrl(args[0]) && !args[0].includes('whatsapp.com')) throw 'Link Invalid!'
      m.reply(mess.wait)
      let result = args[0].split('https://chat.whatsapp.com/')[1]
      await client.groupAcceptInvite(result).then((res) => m.reply(jsonformat(res))).catch((err) => m.reply(jsonformat(err)))
  }
  break;
  case 'block': {
    if (isBanned) return m.reply(`*You Have Been Banned*`)
    if (!isCreator) throw mess.owner
    let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
    await client.updateBlockStatus(users, 'block').then((res) => m.reply(jsonformat(res))).catch((err) => m.reply(jsonformat(err)))
}
  break;
  case 'unblock': {
    if (isBanned) return m.reply(`*You Have Been Banned*`)
		if (!isCreator) throw mess.owner
		let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
		await client.updateBlockStatus(users, 'unblock').then((res) => m.reply(jsonformat(res))).catch((err) => m.reply(jsonformat(err)))
	}
    break;
    case 'kick': {
      if (isBanned) return m.reply(`*You Have Been Banned*`)
      if (!m.isGroup) throw mess.group
      if (!isBotAdmins) throw mess.botAdmin
      if (!isAdmins) throw mess.admin
      let users = m.mentionedJid[0] ? m.mentionedJid : m.quoted ? [m.quoted.sender] : [text.replace(/[^0-9]/g, '')+'@s.whatsapp.net']
      await client.groupParticipantsUpdate(m.chat, users, 'remove').then((res) => m.reply(jsonformat(res))).catch((err) => m.reply(jsonformat(err)))
}
    break;
    case 'add': {
      if (isBanned) return m.reply(`*You Have Been Banned*`)
      if (!m.isGroup) throw mess.group
      if (!isBotAdmins) throw mess.botAdmin
      if (!isAdmins) throw mess.admin
      let users = m.mentionedJid[0] ? m.mentionedJid : m.quoted ? [m.quoted.sender] : [text.replace(/[^0-9]/g, '')+'@s.whatsapp.net']
      await client.groupParticipantsUpdate(m.chat, users, 'add').then((res) => m.reply(jsonformat(res))).catch((err) => m.reply(jsonformat(err)))
}
    break;
    case 'tagall': {
      if (isBanned) return m.reply(`*You Have Been Banned*`)
      if (!m.isGroup) throw mess.group
      if (!isBotAdmins) throw mess.botAdmin
      if (!isAdmins) throw mess.admin
let teks = `══✪〘 *👥 Tag All* 〙✪══

➲ *Pesan : ${q ? q : 'kosong'}*\n\n`
      for (let mem of participants) {
      teks += `⭔ @${mem.id.split('@')[0]}\n`
      }
      client.sendMessage(m.chat, { text: teks, mentions: participants.map(a => a.id) }, { quoted: m })
      }
      break;
      case "creategroup" : {
        if (!isCreator) return m.reply (mess.owner)
        let namagroup = text.split("|")[0] 
        if(!namagroup) return m.reply('```Isi Nama Group```') 
        await client.groupCreate(namagroup, [sender])
        m.reply('_Successful Created Group_')
      }
      break;
      case 'jodohku': {
        if (isBanned) return m.reply(`*You Have Been Banned*`)
        if (!m.isGroup) throw mess.group
        let member = participants.map(u => u.id)
            let me = m.sender
            let jodoh = member[Math.floor(Math.random() * member.length)]
            let jawab = `👫Jodoh mu adalah

@${me.split('@')[0]} ❤️ @${jodoh.split('@')[0]}`
            let ments = [me, jodoh]
            let buttons = [
                        { buttonId: `${prefix}jodohku`, buttonText: { displayText: 'Jodohku' }, type: 1 }
                    ]
                    await client.sendButtonText(m.chat, buttons, jawab, client.user.name, m, {mentions: ments})
            }
      break;
        case 'sticker': case 's': case 'stickergif': 
        if (isBanned) return m.reply(`*You Have Been Banned*`)
        {
          if (/image/.test(mime)) {
          m.reply(mess.wait)
               let media = await client.downloadMediaMessage(qmsg)
               let encmedia = await client.sendImageAsSticker(m.chat, media, m, { packname: global.packname, author: global.author })
               await fs.unlinkSync(encmedia)
           } else if (/video/.test(mime)) {
           m.reply(mess.wait)
               if (qmsg.seconds > 11) return m.reply('Maksimal 10 detik!')
               let media = await client.downloadMediaMessage(qmsg)
               let encmedia = await client.sendVideoAsSticker(m.chat, media, m, { packname: global.packname, author: global.author })
               await fs.unlinkSync(encmedia)
           } else {
               m.reply(`Kirim/reply gambar/video/gif dengan caption ${prefix + command}\nDurasi Video/Gif 1-9 Detik`)
               }
           }
           break;
           case 'getip': {
           if (!isCreator) throw mess.owner
            var http = require('http')
            http.get({'host': 'api.ipify.org', 'port': 80, 'path': '/'}, function(resp) {
            resp.on('data', function(ip) {
                m.reply("My public IP address is: " + ip);
            })
                })
            }
          break;
          case 'ping': case 'botstatus': case 'statusbot': {
            if (!isCreator) throw mess.owner
            const used = process.memoryUsage()
            const cpus = os.cpus().map(cpu => {
                cpu.total = Object.keys(cpu.times).reduce((last, type) => last + cpu.times[type], 0)
          return cpu
            })
            const cpu = cpus.reduce((last, cpu, _, { length }) => {
                last.total += cpu.total
                last.speed += cpu.speed / length
                last.times.user += cpu.times.user
                last.times.nice += cpu.times.nice
                last.times.sys += cpu.times.sys
                last.times.idle += cpu.times.idle
                last.times.irq += cpu.times.irq
                return last
            }, {
                speed: 0,
                total: 0,
                times: {
              user: 0,
              nice: 0,
              sys: 0,
              idle: 0,
              irq: 0
            }
            })
            let timestamp = speed()
            let latensi = speed() - timestamp
            neww = performance.now()
            oldd = performance.now()
            respon = `
Kecepatan Respon ${latensi.toFixed(4)} _Second_ \n ${oldd - neww} _miliseconds_\n\nRuntime : ${runtime(process.uptime())}
💻 Info Server
RAM: ${formatp(os.totalmem() - os.freemem())} / ${formatp(os.totalmem())}
_NodeJS Memory Usaage_
${Object.keys(used).map((key, _, arr) => `${key.padEnd(Math.max(...arr.map(v=>v.length)),' ')}: ${formatp(used[key])}`).join('\n')}
${cpus[0] ? `_Total CPU Usage_
${cpus[0].model.trim()} (${cpu.speed} MHZ)\n${Object.keys(cpu.times).map(type => `- *${(type + '*').padEnd(6)}: ${(100 * cpu.times[type] / cpu.total).toFixed(2)}%`).join('\n')}
_CPU Core(s) Usage (${cpus.length} Core CPU)_
${cpus.map((cpu, i) => `${i + 1}. ${cpu.model.trim()} (${cpu.speed} MHZ)\n${Object.keys(cpu.times).map(type => `- *${(type + '*').padEnd(6)}: ${(100 * cpu.times[type] / cpu.total).toFixed(2)}%`).join('\n')}`).join('\n\n')}` : ''}
            `.trim()
            m.reply(respon)
        }
        break;
        case 'gempa': {
          if (isBanned) return m.reply(`*You Have Been Banned*`)
          m.reply(mess.waitdata)
          let anu = await fetchJson(api('zenz', '/information/bmkg/gempa', {}, 'apikey'))
          if (anu.status == false) return m.reply(anu.result.message)
          client.sendMessage(m.chat, { image: { url: anu.result.shakemap }, caption: `⭔ Tanggal : ${anu.result.tanggal}\n⭔ Jam : ${anu.result.jam}\n⭔ Date Time : ${anu.result.datetime}\n⭔ Coordinate : ${anu.result.coordinates}\n⭔ Lintang : ${anu.result.lintang}\n⭔ Bujur : ${anu.result.bujur}\n⭔ Magnitude : ${anu.result.magnitude}\n⭔ Kedalaman : ${anu.result.kedalaman}\n⭔ Wilayah : ${anu.result.wilayah}\n⭔ Potensi : ${anu.result.potensi}\n⭔ Dirasakan : ${anu.result.dirasakan}`}, { quoted: m })
      }
      break;
      case 'jadwalsholat': {
        m.reply(mess.wait+`${text}`)
        if (!text) throw `Example : ${prefix + command} banjar`
        let fetch = await fetchJson(api('zenz', '/islami/jadwalshalat', { kota: text }, 'apikey'))
        if (fetch.status == false) return m.reply(fetch.result.message)
        let i = fetch.result
        let teks = `Jadwal Sholat Kota : ${text}\n\n`
        teks += `⭔ Tanggal : ${i.tanggal}\n`
        teks += `⭔ Subuh : ${i.subuh}\n`
        teks += `⭔ Duha : ${i.duha}\n`
        teks += `⭔ Dzuhur : ${i.zuhur}\n`
        teks += `⭔ Ashar : ${i.asar}\n`
        teks += `⭔ Maghrib : ${i.magrib}\n`
        teks += `⭔ Isya : ${i.isya}\n`
        client.sendText(m.chat, teks, m)
      }
      break;
      case 'asmaulhusna': {
          m.reply(mess.wait)
          let fetch = await fetchJson(`https://raw.githubusercontent.com/BochilTeam/database/master/religi/asmaulhusna.json`)
          let caption = `*Asmaul Husna*\n\n`
          for (let i of fetch) {
            caption += `⭔ No : ${i.index}\n`
            caption += `⭔ Arab : ${i.arabic}\n`
            caption += `⭔ Latin : ${i.latin}\n`
            caption += `⭔ Indonesia : ${i.translation_id}\n`
            caption += `⭔ English : ${i.translation_en}\n\n`
        }
        client.sendText(m.chat, caption, m)
      }
      break;
      case 'kompasnews': {
      if (isBanned) return m.reply(`*You Have Been Banned*`)
      m.reply(mess.wait)
      let fetch = await fetchJson(`https://api.zahwazein.xyz/news/kompas?apikey=${zenzkey}`)
      let caption = `Latest News From Kompasnews\n\n`
        for (let i of fetch.result) {
            caption += `⭔ Judul Berita : ${i.berita}\n`
            caption += `⭔ Di Upload : ${i.berita_diupload}\n`
            caption += `⭔ Jenis : ${i.berita_jenis}\n`
            caption += `⭔ Url : ${i.berita_url}\n\n`
        }
        client.sendImage(m.chat, fetch.result[0].berita_thumb, caption, m)
      }
      break;
      case 'shortlink': {
        if (isBanned) return m.reply(`*You Have Been Banned*`)
        if (!text) throw `Example : ${prefix + command} https://google.com`
        m.reply(mess.wait)
        let anu = await fetchJson(`https://api.lolhuman.xyz/api/shortlink?apikey=${lolkey}&url=${text}`)
        client.sendMessage(m.chat, { image: { url: 'https://telegra.ph/file/94b5d3acb51c1eea47b22.png' }, caption: `*Success ✔*\n⭔ Url : ${anu.result}`}, { quoted: m })
    }
  break;
  case 'ytshorts': {
    if (isBanned) return m.reply(`*You Have Been Banned*`)
    if (!text) throw 'Masukkan Query Link!'
    m.reply(mess.wait)
    let anu = await fetchJson(`https://api.zahwazein.xyz/downloader/ytshorts?apikey=${zenzkey}&url=${text}`)
    if (anu.status == false) return m.reply(anu.result.message)
    let buttons = [
        {buttonId: `${prefix}menu`, buttonText: {displayText: '► Menu'}, type: 1}
    ]
    let buttonMessage = {
        video: { url: anu.result.getVideo },
        caption: `Download From ${text}`,
        footer: 'Press Button For Menu',
        buttons: buttons,
        headerType: 5
    }
    client.sendMessage(m.chat, buttonMessage, { quoted: m })
}
  break;
  case 'ytmp4': {
    if (isBanned) return m.reply(`*You Have Been Banned*`)
    if (!text) throw 'Masukkan Query Link!'
    m.reply(mess.wait)
    let anu = await fetchJson(`https://api.zahwazein.xyz/downloader/youtube?apikey=${zenzkey}&url=${text}`)
    if (anu.status == false) return m.reply(anu.result.message)
    let buttons = [
        {buttonId: `${prefix}menu`, buttonText: {displayText: '► Menu'}, type: 1}
    ]
    let buttonMessage = {
        video: { url: anu.result.getVideo },
        caption: `Download From ${text}`,
        footer: 'Press Button For Menu',
        buttons: buttons,
        headerType: 5
    }
    client.sendMessage(m.chat, buttonMessage, { quoted: m })
}
  break;
  case 'tiktok': case 'tiktoknowm': {
    if (isBanned) return m.reply(`*You Have Been Banned*`)
    if (!text) throw 'Masukkan Query Link!'
    m.reply(mess.wait)
    let anu = await fetchJson(api('zenz', '/downloader/tiktok', { url: text }, 'apikey'))
    if (anu.status == false) return m.reply(anu.result.message)
    let buttons = [
        {buttonId: `${prefix}menu`, buttonText: {displayText: '► Menu'}, type: 1}
    ]
    let buttonMessage = {
        video: { url: anu.result.video.noWatermark },
        caption: `Download From ${text}`,
        footer: 'Press Button For Menu',
        buttons: buttons,
        headerType: 5
    }
    client.sendMessage(m.chat, buttonMessage, { quoted: m })
}
  break;
  case 'tiktokmp3': case 'tiktokaudio': {
    if (isBanned) return m.reply(`*You Have Been Banned*`)
    if (!text) throw 'Masukkan Query Link!'
    m.reply(mess.wait)
    let anu = await fetchJson(`https://api.zahwazein.xyz/downloader/tiktok?apikey=${zenzkey}&url=${text}`)
    if (anu.status == false) return m.reply(anu.result.message)
    let buttons = [
        {buttonId: `${prefix}menu`, buttonText: {displayText: '► Menu'}, type: 1}
    ]
    let buttonMessage = {
        text: `Download From ${text}`,
        footer: 'Press Button For Menu',
        buttons: buttons,
        headerType: 2
    }
    let msg = await client.sendMessage(m.chat, buttonMessage, { quoted: m })
    client.sendMessage(m.chat, { audio: { url: anu.result.music.play_url }, mimetype: 'audio/mpeg'}, { quoted: msg })
}
break;
case 'ban' : {
  if (!text) throw `Example : ${prefix + command} 62xxxxxxxxxxx`
  if (!isCreator) throw mess.owner
  let bnnd = `${args[0].replace('@', '')}@s.whatsapp.net`
  let ban_ = []
  if (fs.existsSync('./src/banned.json')) {
    ban_ = JSON.parse(fs.readFileSync('./src/banned.json'))
  }
  if (ban_.includes(bnnd)) {
    m.reply('*_Nomor Telah Terbanned_*')
  } else {
    ban.push(bnnd)
    fs.writeFileSync('./src/banned.json', JSON.stringify(ban))
    m.reply(bnnd)
  }
}
break;
case 'unban' : {
  if (!text) throw `Example : ${prefix + command} 62xxxxxxxxxxx`
  if (!isCreator) throw mess.owner
  let bnnd = `${args[0].replace('@', '')}@s.whatsapp.net`
  let ban_ = JSON.parse(fs.readFileSync('./src/banned.json'))
  let unp = ban_.indexOf(bnnd)
  if (unp !== -1) {
    ban.splice(unp, 1)
    fs.writeFileSync('./src/banned.json', JSON.stringify(ban))
    m.reply(bnnd)
  } else {
    m.reply('*_Nomor Tidak Ditemukan_*')
  }
}
break;
case "listuser" : {
  if (!isCreator) throw mess.owner
  teks = '*_List User :)_*\n\n'
  for (let pengguna of signup) {
    teks += `- ${pengguna}\n`
  }
  teks += `\n*_Total User : ${signup.length}_*`
  client.sendMessage(m.chat, { text: teks.trim() }, 'extendedTextMessage', { quoted: m, contextInfo: { "mentionedJid": signup } })
}
break;
case 'listban' : case 'lisbanned' : {
  if (!isCreator) throw mess.owner
  teks = '*List Banned*\n\n'
  for (let medog of ban) {
    teks += `- ${medog}\n`
  }
  teks += `\n*Total Banned : ${ban.length}*`
  client.sendMessage(m.chat, { text: teks.trim() }, 'extendedTextMessage', { quoted: m, contextInfo: { "mentionedJid": ban } })
}
        break;
          default: {
          if (isCmd2 && budy.toLowerCase() != undefined) {
            if (m.chat.endsWith("broadcast")) return;
            if (m.isBaileys) return;
            if (!budy.toLowerCase()) return;
            if (argsLog || (isCmd2 && !m.isGroup)) {
              // client.sendReadReceipt(m.chat, m.sender, [m.key.id])
              console.log(chalk.black(chalk.bgRed("[ ERROR ]")), color("command", "turquoise"), color(`${prefix}${command}`, "turquoise"), color("tidak tersedia", "turquoise"));
              client.sendMessage(m.chat, {text: "*_Command Tidak Tersedia Silahkan Ketik .menu Untuk Menampilkan Menu Yang Tersedia Terimakasih!..._*"})
            } else if (argsLog || (isCmd2 && m.isGroup)) {
              // client.sendReadReceipt(m.chat, m.sender, [m.key.id])
              console.log(chalk.black(chalk.bgRed("[ ERROR ]")), color("command", "turquoise"), color(`${prefix}${command}`, "turquoise"), color("tidak tersedia", "turquoise"));
              client.sendMessage(m.chat, {text: "*_Command Tidak Tersedia Silahkan Ketik .menu Untuk Menampilkan Menu Yang Tersedia Terimakasih!..._*"})
            }
          }
        }
      }
    }
  } catch (err) {
    m.reply(util.format(err));
  }
};

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.redBright(`Update ${__filename}`));
  delete require.cache[file];
  require(file);
});
