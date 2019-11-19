import { render as litRender } from 'lit-html/lib/shady-render.js';
import { h, render, ComponentType, VNode, Attributes, ComponentChildren, RefObject, Component } from "preact";
import { directive, NodePart, TemplateResult } from 'lit-html';



//https://reactjs.org/docs/rendering-elements.html#updating-the-rendered-element
//https://preactjs.com/guide/v10/refs/#callback-refs
//example return html`${fonts} ${this.styleMount} ${reactElement(StylesProvider as ComponentType<any>, syleRef, { jss: jss }, h(Header, { title: this.title }))}`;
export const reactElement =
	directive(<P, C>(
		type: ComponentType<P>,
		ref: RefObject<C> | null,
		props: Attributes & P | null,
		...children: ComponentChildren[]
	) => (part: NodePart) => {
		let vNode: VNode = h(type, props, children);
		vNode.ref = ref;
		let mountPoint: DocumentFragment = new DocumentFragment();

		render(vNode, mountPoint);

		part.setValue(mountPoint);
	});

//Ensure web component file has .tsx file extension so that it inline elements are identified as JSX
export const reactVNode =
	directive(<C extends {}>(
		vNode: VNode<C>,
		ref?: RefObject<C>,
	) => (part: NodePart) => {
		vNode.ref = ref ? ref : null;
		let mountPoint: DocumentFragment = new DocumentFragment();
		render(vNode, mountPoint);
		part.setValue(mountPoint);
	});


export interface LitHTMLProps {
	template: TemplateResult;
	eventContext?: EventTarget;
}

//https://github.com/preactjs/preact/wiki/External-DOM-Mutations 
export class LitHTML extends Component<LitHTMLProps, {}> {

	shouldComponentUpdate() {
		return false;
	}

	componentDidMount() {
		if (this.base) {
			//scopeName: this.props.target.localName
			litRender(this.props.template, this.base.parentNode as Element, { eventContext: this.props.eventContext, scopeName: 'LitHTML' });
		}
	}

	componentWillUnmount() {
		// TODO find out if needed.
	}

	render() {
		//Fragment won't work, but rendering to base parent filters out this empty div node.
		return h("div", {});
	}
}
