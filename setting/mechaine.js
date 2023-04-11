/**
 * Source Code By Reza
 * Don't Forget Smile
 * Thank You :)
*/

require('./config')
const { BufferJSON, WA_DEFAULT_EPHEMERAL, generateWAMessageFromContent, proto, generateWAMessageContent, generateWAMessage, prepareWAMessageMedia, areJidsSameUser, getContentType } = require("@adiwajshing/baileys");
const fs = require("fs");
const util = require("util");
const chalk = require("chalk");
// new module
const { exec } = require("child_process")
const moment = require('moment-timezone');
const axios = require('axios');
const os = require('os');
const speed = require('performance-now');
const { sizeFormatter } = require('human-readable');
// end
const { Configuration, OpenAIApi } = require("openai");
let setting = require("./api_key.json");

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

    // Push Message To Console
    let argsLog = budy.length > 30 ? `${q.substring(0, 30)}...` : budy;

    // Update Bio
    if (autobio = true) {
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


    if (isCmd2) {
      switch (command) {
        case "help": case "menu":
          if (isBanned) return m.reply(`*You Have Been Banned*`)
            anu = `*WhatsApp-Ai Version 1.4.0*\n\n*Hai Kak ${m.pushName} ${ucapanWaktu}📍*\n➤ _Nama Bot: ${packname}_\n➤ _Nama Owner: ${author}_\n➤ _Runtime: ${runtime(process.uptime())}_\n➤ _Pengguna: ${signup.length}_\n\nChange Logs:\n✔Fixed Bug\n✔Added DALL-E\n✔Added Sticker\n✔Added Gempa\n✔Added Shortlink\n✔Added Tiktoknowm\n✔Added Tiktokmp3\n✔Added Ayat Kursi\n\n*(ChatGPT)*\nMess: ${prefix}ai presiden indonesia\n\n*(DALL-E)*\nMess: ${prefix}img gambar gunung\n\n⭓ *List Menu*\n📌 ${prefix}ai presiden indonesia\n📌 ${prefix}img gambar gunung\n📌 ${prefix}tourl [reply image]\n📌 ${prefix}anime\n📌 ${prefix}tagall\n📌 ${prefix}jodohku\n📌 ${prefix}sticker [reply image/video]\n📌 ${prefix}kick [@user]\n📌 ${prefix}add [user no]\n📌 ${prefix}block [owner only]\n📌 ${prefix}unblock [owner only]\n📌 ${prefix}ban [owner only]\n📌 ${prefix}unban [owner only]\n📌 ${prefix}whoisip [public ip]\n📌 ${prefix}getip [owner only]\n📌 ${prefix}ping [owner only]\n📌 ${prefix}kompasnews\n📌 ${prefix}gempa\n📌 ${prefix}shortlink\n📌 ${prefix}tiktoknowm [url]\n📌 ${prefix}tiktokmp3 [url]\n📌 ${prefix}toaudio [text]\n📌 ${prefix}ytmp4 [url]\n📌 ${prefix}ytshorts\n📌 ${prefix}alquran\n📌 ${prefix}jadwalsholat [kota]\n📌 ${prefix}asmaulhusna\n📌 ${prefix}ayatkursi\n📌 ${prefix}group [open/close]\n📌 ${prefix}pushkontak [owner only]\n📌 ${prefix}owner [owner contact]\n📌 ${prefix}listonline`
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
        case "pushkontak" : {
          if (!text) return m.reply(`Example ${prefix}${command} Hi Semuanya`)
          if (!isCreator) return m.reply(mess.owner)
          if (!m.isGroup) return m.reply(mess.group)
          if (!isBotAdmins) return m.reply(mess.botAdmin)
          if (!isAdmins) throw m.reply(mess.admin)
          let get = await participants.filter(v => v.id.endsWith('.net')).map(v => v.id)
          let count = get.length;
          let sentCount = 0;
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
      case 'restart' :
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
      break
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
  let ban_ = JSON.parse(fs.readFileSync('./banned.json'))
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
