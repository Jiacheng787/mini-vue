import Vue from "./src/vue";

const vm = new Vue({
	el: "#app",
	data: {
		count: 0,
		message: "2333",
	},
	methods: {
		add() {
			this.count++;
		},
		showMessage() {
			this.message = "测试内容";
		}
	}
});