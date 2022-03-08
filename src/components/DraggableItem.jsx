import React from 'react';
import AdvancedDraggable from './AdvancedDraggable.jsx';

// props:
// - getModel
// - dropzones
// - children
class DraggableItem extends React.Component {

	async getModel(args) {
		return this.props.getModel ? await this.props.getModel(args) : {};
	}

	getDropOptions() {
		return this.props.getDropOptions ? this.props.getDropOptions() : {};
	}

	createPreviewElement() {
		return this.props.createPreviewElement ? this.props.createPreviewElement() : this.getNode().cloneNode(true);
	}

	getNode = () => {
		return this.props.getNode ? this.props.getNode() : this.node;
	}

	renderView() {
		const {
			children,
			left,
			getNode,
		} = this.props;
		return getNode ?
		children :
		<div style={{float: left ? 'left' : undefined}} ref={node=>this.node=node}>
			{
				children
			}
		</div>
	}

	render() {
		const {
			dropzones,
		} = this.props;
		return dropzones ?
		<AdvancedDraggable
			getDraggableElement={this.getNode}
			getValue={() => this}
			dropzones={dropzones}
			>
			{
				this.renderView()
			}
		</AdvancedDraggable> :
		this.renderView()
	}

}

export default DraggableItem;
