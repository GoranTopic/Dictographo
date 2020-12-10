import Modal from 'react-modal';
/*
 * ===================================
 *      Modal Component for React
 * ===================================
 */

const customStyles = {
		content : {
				top          : '50%',
				left         : '50%',
				right        : 'auto',
				bottom       : 'auto',
				marginRight  : '-50%',
				transform    : 'translate(-50%, -50%)'
		}
};

const closeModal = () => {
		dispatchState({type: 'SET_SHOW_MODAL', payload: false})
}

export default <Modal
		isOpen={state.showModal}
		onAfterOpen={() => console.log("models was opend")}
		onRequestClose={closeModal}
		style={customStyles}
		contentLabel="Example Modal"
>
		<div>I am a modal</div>
</Modal>
