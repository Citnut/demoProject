const colors = require("colors")
const axios = require("axios")
const tools = require("./tools.js")
tools.checkfile("./config.json",JSON.stringify(require("./defaultconfig.json"),null,2))
tools.checkfile("./data.json", JSON.stringify(require("./defaultdata.json"),null,2))
const config = require("../config.json")
const {Client, Intents} = require("discord.js")
const bot = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]})
const fakesv = require("./fakesv.js")
const recursive = require("recursive-readdir")

bot.on("warn", console.warn)
bot.on("error", console.error)
bot.on("ready", function(){
	console.log(` [CITNUT] đăng nhập thành công:`.green, `${bot.user.tag}\n`.magenta, `[CITNUT] prefix: ${citnut.config.prefix}`.green)
	fakesv()
    console.log(" [CITNUT] đã tạo thành công trang web giả của bot".green)
})


globalThis.citnut = {
	Discord: require("discord.js"),
	config,
	tools,
	send: function (replyMSG, message) {
		try { message.channel.send(replyMSG) } catch (e) { console.error(e) }
	},
	plugin: async function () {
		let data = []
		let allcommand = []
		const list = await recursive("./plugins", ["data"])
		try {
			for (const files of list) {
				const item = require(`../${files}`)
				data.push({item, path: files})
			}
			for (const all of data) {
				allcommand.push(all.item.command[0])
			}
		} catch (e) { console.error(e) }
		return {
			list,
			allcommand,
			data
		}
	}
}
async function run () {
	try {
		console.log(
			`	 ██ █ ███ █  █ █ █ ███\n`.green+
			`	█   █  █  ██ █ █ █  █\n`.green+
			`	█   █  █  █ ██ █ █  █\n`.green+
			`	 ██ █  █  █  █ ███  █\n`.green
		)
		let files = await citnut.plugin()
		let load = files.data
		
		console.log(` [CITNUT]`.yellow,`plugin loading:`.green)
		for (const file of load) { console.log(" [CITNUT] plugin".green,`${file.item.command[0]}(${file.item.description})`.yellow,"by".green,`${file.item.author}`.yellow) }
		console.log(` [CITNUT]`.yellow,`plugin loaded!`.green)
		
		citnut.tools.checkupdate(require("../package.json").version)
		let errmsg = `Lệnh bạn sử dụng không tồn tại!\n> sử dụng ${citnut.config.prefix}help\n> để hiển thị danh sách lệnh `
		const emb = new citnut.Discord.MessageEmbed()
			.setColor("RANDOM")
			.setDescription(errmsg)
			.setAuthor({name:"Citnut bot",iconURL:"https://i.imgur.com/wtcUCqn_d.webp?maxwidth=760&fidelity=grand",url:"https://discord.com/api/oauth2/authorize?client_id=896023318690402395&permissions=0&scope=bot"})
		bot.login(citnut.config.token)
		bot.on("messageCreate", async message => {
			if (!message.author.bot && message.content.indexOf(citnut.config.prefix) == 0) {
				console.log(" [CITNUT]".green,`${message.author.tag}`.yellow,`>use cmd>`.green,`${message.channel.name}`.yellow,`: ${message.content}${(message.attachments.size > 0) ? message.attachments : ""}`.green)
			} else {
				console.log(" [CITNUT]".green,`${message.author.tag}`.yellow,`>send msg>`.green,`${message.channel.name}`.yellow,`: ${message.content}${(message.attachments.size > 0) ? message.attachments : ""}`.green)
			}
			let db = tools.db
			let {get,write} = db
			if (!get.user[message.author.id] || get.user[message.author.id] != message.author.tag) {
				get.user[message.author.id]=message.author.tag
				write(get)
			}
			let keyword = citnut.tools.getKeyword(message.content)
			let checkkeyw = []
			for (const index of load) {
				
				if (message.content.indexOf(citnut.config.prefix) == 0 && index.item.command.includes(keyword)) {
					checkkeyw.push(true)			
					await index.item.call (message,db)
				} else { checkkeyw.push(false) }
									
				if (index.item.allowListening) {
					await index.item.listen (message,db)
				}
			}
			if (message.content == citnut.config.prefix) { return citnut.send({embeds:[emb]}, message) }
			if (!checkkeyw.includes(true) && message.content.indexOf(citnut.config.prefix) == 0) { return citnut.send({embeds:[emb]}, message)}
		})
	} catch (e) { console.error(e) }
}

run()