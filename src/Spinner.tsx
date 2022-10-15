import './Spinner.css';

type Props = {
    visible: boolean,
}

function Spinner(props: Props) {
    return (
        <div className={(props.visible ? 'fade-in' : 'fade-out') + " spinner inactive-background flex-center"}>
            <div className="text-gray-200 font-bold text-xl loader">
                Loading<span className="loader__dot">.</span><span className="loader__dot">.</span><span className="loader__dot">.</span>
            </div>
        </div>
    );
}

export default Spinner;
