import React from 'react';
import BaseComponent from './BaseComponent.js';
import AdvancedDraggable from '../core/AdvacedDraggable';

// getDraggableElement
// getValue
class AdvancedDraggableComponent extends BaseComponent {

	unbindDraggable = () => {
		if(this.draggable) {
			this.draggable.unbind();
			delete this.draggable;
		}
	}

	onRef = node => {
		this.node = node;
		this.unbindDraggable();
		if(node) {
			const value = this.props.getValue();
			this.draggable = AdvancedDraggable
			.createAdvanceDraggable(node)
			.setValue(value);
			this.draggable.dropzones = this.props.dropzones;
		}
	}

	componentDidMount() {
		super.componentDidMount();
		const element = this.props.getDraggableElement();
		this.onRef(element);
	}

	componentWillUnmount() {
		super.componentWillUnmount();
		this.unbindDraggable();
	}

	render() {
		return <React.Fragment>
		{
			this.props.children
		}
		</React.Fragment>
	}

}

export default AdvancedDraggableComponent;
