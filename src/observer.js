import { Dep } from "./dep";

export function observer(obj) {
	if (typeof obj !== 'object') {
		return;
	}
	new Observer(obj);
}

class Observer {
	constructor(value) {
		this.value = value;
		if (Array.isArray(this.value)) {
			// TODO: 对于数组的操作不作处理
			// 实际上就是对数组的七个方法进行重写覆盖
		} else {
			// 将对象转为响应式
			this.walk(value);
		}
	}
	walk(obj) {
		Object.keys(obj).forEach(key => {
			// 将对象属性转换为响应式
			defineReactive(obj, key, obj[key]);
		})
	}
}

function defineReactive(obj, key, val) {
	// 对引用类型进行递归观察
	observer(val);
	// 创建 Dep 实例
	// data 对象的每个属性都会创建一个 Dep
	const dep = new Dep();
	Object.defineProperty(obj, key, {
		configurable: true,
		enumerable: true,
		get() {
			// 在访问数据的时候进行依赖收集
			// 只有当 target 存在才会被 Dep 收集更新
			Dep.target && dep.addDep(Dep.target);
			return val;
		},
		set(newVal) {
			if (newVal != val) {
				// 对新值进行观察
				observer(newVal);
				val = newVal;
				// 访问数据的时候通知依赖更新
				dep.notify();
			}
		}
	})
}
