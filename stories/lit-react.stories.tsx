/* eslint-disable import/extensions */
import { html } from 'lit-html';
import { reactElement, reactVNode, LitHTML } from '../lib/index';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge'

import { withKnobs, text, boolean, radios } from "@storybook/addon-knobs";
import { action } from '@storybook/addon-actions';

import { h, render, ComponentType, VNode, Attributes, ComponentChildren, RefObject, createRef, Component, Fragment } from "preact";

import 'bootstrap/dist/css/bootstrap.min.css';
import { customElement, LitElement, property } from 'lit-element';



//https://storybook.js.org/docs/formats/component-story-format/


const center = (storyFn: () => unknown) => html`<div style="display: flex; align-items: center; justify-content: center; margin: 64px 64px;">${storyFn()}</div>`;

const buttonVariants = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'dark', 'light', 'link', 'outline-primary', 'outline-secondary', 'outline-success', 'outline-danger', 'outline-warning', 'outline-info', 'outline-dark', 'outline-light'];

const options: Record<string, string> = buttonVariants.reduce((r: Record<string, string>, e: string) => { r[e] = e; return r; }, {});

const variantRadioKnob = () => radios("Variant", options, 'primary') as any;



export default {
	title: 'lit-react Demo',
	component: 'lit-react',
	decorators: [withKnobs, center]
};



//in certain cases like with Material UI preact component type cast is needed, i.e.  Button as ComponentType<ButtonProps>
export const reactElementStory = () => html`${reactElement(Button, null, { variant: variantRadioKnob(), onClick: action("Element Button Clicked") }, text("Name", "Element React Button"))}`;
reactElementStory.story = {
	name: 'Element React in lit-html - createElement'
}



export const reactVNodeStory = () => html`${reactVNode(<Button variant={variantRadioKnob()} onClick={action("JSX Button Clicked")}>{text("Name", "JSX React Button")}</Button>)}`;
reactVNodeStory.story = {
	name: 'JSX React in lit-html - reactVNode'
}




//@storybook/preact isn't installed so a directly returned VNode will not render. Render in lit-html instead.
export const litHTMLStory = () => {
	let inner = html`${text("Name", "LitHTML Button")}`;
	return html`${reactVNode(<Button variant={variantRadioKnob()} onClick={action("LitHTML Button Clicked")}><LitHTML template={inner} /></Button>)}`;
}
litHTMLStory.story = {
	name: 'lit-html in JSX React - LitHTML'
}



interface CounterState {
	count: number;
}

class Counter extends Component<{}, CounterState> {

	state: CounterState = { count: 0 }


	increment() {
		this.setState(state => ({
			count: state.count + 1
		}));
	}

	render() {
		return <Badge variant={variantRadioKnob()}>{this.state.count}</Badge>;
	}
}

export const reactRefStory = () => {
	let counterRef: RefObject<Counter> = createRef();

	return html`
		  <table>
			  <tr><td align="center">${reactVNode(<Counter />, counterRef)}</td></tr>
			  <tr><td><button @click=${(e: MouseEvent) => counterRef.current && counterRef.current.increment()}>Increment</button></td></tr>
			</table>`;
}
reactRefStory.story = {
	name: 'lit-html React Reference'
}




import { JSXInternal as JSXI } from "preact/src/jsx";
declare module "preact" {

	export namespace JSXInternal {


		interface IntrinsicElements extends JSXI.IntrinsicElements {
			["counter-element"]: Partial<HTMLElement> & {
				count?: number,
				ref?: RefObject<CounterElement>
			};
		}
	}
}


@customElement('counter-element')
class CounterElement extends LitElement {

	@property({ type: Number })
	count = 0;

	increment() {
		this.count++;
	}

	render() {
		return html`<div>${this.count}</div>`;
	}

}

//https://preactjs.com/guide/v10/web-components
class Incrementer extends Component<{}, {}> {

	counterRef: RefObject<CounterElement> = createRef();

	//optional chaining not yet working with ts-loader. this.counterRef.current?.increment() doesn't complile
	render() {
		return <table>
			<tr><td style={{ textAlign: "center" }}><counter-element ref={this.counterRef}></counter-element></td></tr>
			<tr><td><Button variant={variantRadioKnob()} onClick={(event: any) => this.counterRef.current && this.counterRef.current.increment()}>Increment</Button></td></tr>
		</table>;
	}
}



export const litElementRefStory = () => {
	return html`${reactVNode(<Incrementer />)}`;
}
litElementRefStory.story = {
	name: 'React LitElement Reference'
}



