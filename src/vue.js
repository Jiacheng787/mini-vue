import { Compile } from "./compile";
import { observer } from "./observer";

export default class Vue {
	constructor(options) {
		this.$options = options;
		this.$data = options.data;
		this.$methods = options.methods;
		observer(this.$data);
		proxy(this);
		// 将 vue 实例传进去用于获取 data, methods...
		new Compile(options.el, this);
	}
}

// 将 vm.$data 上的属性代理到 vue 实例上
// 这样就可以通过 this.xxx 直接访问
function proxy(vm) {
	Object.keys(vm.$data).forEach(key => {
		Object.defineProperty(vm, key, {
			configurable: true,
			enumerable: true,
			get() {
				return vm.$data[key];
			},
			set(v) {
				vm.$data[key] = v;
			}
		})
	})
}