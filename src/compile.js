import { Watcher } from "./watcher";

export class Compile {
	constructor(el, vm) {
		this.$vm = vm;
		this.$el = document.querySelector(el);
		if (this.$el) {
			// 模板解析
			this.compile(this.$el);
		}
	}

	compile(el) {
		const childNodes = el.childNodes;
		if (!childNodes) return;
		childNodes.forEach(node => {
			if (node.nodeType === 1) {
				// 元素节点 nodeType 为 1，文本节点 nodeType 为 3（后面解析插值表达式用到）
				// 处理指令和事件
				const attrs = node.attributes;
				Array.from(attrs).forEach(attr => {
					const attrName = attr.name;
					const exp = attr.value;
					if (attrName.startsWith("v-")) {
						// 属性值以 v- 开通便认为这是一个指令
						// 这里只处理 v-text, v-model, v-html
						const dir = attrName.substring(2);
						this[dir] && this[dir](node, exp);
					} else if (attrName.startsWith("@")) {
						// 属性值以 @ 开头则认为是一个事件
						const dir = attrName.substring(1);
						this.eventFun(node, exp, dir);
					}
				})
			} else if (this.isInter(node)) {
				// 插值表达式，文本渲染
				this.compileText(node);
			}
			// 在有子元素的情况下递归处理
			if (node.childNodes) {
				this.compile(node);
			}
		})
	}

	// 处理模板中的事件
	eventFun(node, exp, dir) {
		// 绑定事件
		// 在 Vue 中，当组件卸载的时候，事件也会自动解绑
		// 这个功能涉及到生命周期，这里暂时先不做
		node.addEventListener(dir, this.$vm.$methods[exp].bind(this.$vm));
	}

	update(node, exp, dir) {
		const fn = this[dir + 'Update'];
		fn && fn(node, this.$vm[exp]);
		new Watcher(this.$vm, exp, function (val) {
			fn && fn(node, val);
		})
	}

	textUpdate(node, val) {
		node.textContent = val;
	}

	htmlUpdate(node, val) {
		node.innerHTML = val;
	}

	// 处理 v-text
	text(node, exp) {
		this.update(node, exp, 'text');
	}

	// 处理 v-html
	html(node, exp) {
		this.update(node, exp, 'html');
	}

	// 处理插值表达式
	compileText(node) {
		// 如果按照 {{ count }} 这样写
		// RegExp.$1 拿到的内容两边会带空格 " count "
		// 需要手动去掉空格，否则模板渲染不出来
		// 另外 Vue 的插值表达式支持写 JS 表达式，这边暂时还不支持
		this.update(node, RegExp.$1.trim(), 'text');
	}

	// 处理 v-model
	model(node, exp) {
		this.update(node, exp, 'model');
		node.addEventListener('input', (e) => {
			this.$vm[exp] = e.target.value;
		})
	}

	// 是否为插值表达式
	isInter(node) {
		return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent);
	}
}