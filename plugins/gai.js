module.exports = {
	command: ["girl", "gái"],
	author: "Citnut",
	description: "mlem",
	guide: "",
	allowListening: false,
	async listen (data) {
	},
	async call (data) {
		const { send } = citnut;
		const res = await citnut.tools.getapi("girl",data,false)
		if (!res) return citnut.send("`"+"chưa có api này trong config"+"`", data)
		
		return send(res, data)
		
	}
}