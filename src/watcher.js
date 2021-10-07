import { Dep } from "./dep";

export class Watcher {
	constructor(vm, key, updateFn) {
		this.vm = vm;
		this.key = key;
		this.updateFn = updateFn;
		// 依赖收集开始
		Dep.target = this;
		// 访问属性触发 get 进行依赖收集
		this.vm[this.key];
		// 依赖收集结束
		Dep.target = null;
	}

	update() {
		// 未来被 Dep 调用执行实际的更新操作
		this.updateFn.call(this.vm, this.vm[this.key]);
	}
}