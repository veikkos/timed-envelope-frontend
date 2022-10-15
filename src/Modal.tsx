import './Modal.css';

type Props = {
    visible: boolean,
    text: string,
    onClose: () => void,
}

function Modal(props: Props) {
    return (
        <div className={(props.visible ? 'fade-in' : 'fade-out') + " inactive-background flex-center p-8"}>
            <div className="modal rounded-md bg-cyan-600 shadow-lg shadow-cyan-900 text-gray-200 font-bold text-md p-6">
                <div className="mb-8">
                    {props.text}
                </div>
                <div className="flex justify-center">
                    <div className="close-button inline-block rounded-md bg-red-600 shadow-lg shadow-red-900 text-gray-200 font-bold text-md p-4"
                        onClick={props.onClose}>
                        Close
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Modal;
