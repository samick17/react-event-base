import React from 'react';
import BaseComponent from './BaseComponent.js';
import { createDraggable } from '../core/Draggable.js';

// getDraggableElement
// onBeforeMove
// onMove
// onAfterMove
class DraggableComponent extends BaseComponent {

	onRef = (node) => {
		this.unbindEvent('unbindDraggableEvent');
		if(node) {
			this.unbindDraggableEvent = createDraggable(node, {
				onStart: (point, context) => {
					context.factors = this.props.factors;
					context.startPos = {
						...point,
					};
					this.props.onBeforeMove(point, context);
				},
				onDrag: (point, context) => {
					this.props.onMove(point, context);
				},
				onEnd: (point, context) => {
					this.props.onAfterMove(point, context);
				},
			});
		}
	}

	componentDidMount() {
		super.componentDidMount();
		const element = this.props.getDraggableElement();
		this.onRef(element);
	}

	componentWillUnmount() {
		super.componentWillUnmount();
		this.unbindEvent('unbindDraggableEvent');
	}

	render() {
		return <React.Fragment>
		{
			this.props.children
		}
		</React.Fragment>
	}

}

export default DraggableComponent;
