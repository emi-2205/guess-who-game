import Image from 'react-bootstrap/Image';
import Card from 'react-bootstrap/Card';

const Item = (props) => {

    const item = props.item
    const imagePath = '/images/' + item.name + '.jpeg';

    const handleCardOnClick = async () => {
        if (props.callback) {
            props.callback(item);
        }
    };

    return (
        <Card className="m-0 p-0 border-0 rounded-0 item shadow" onClick={handleCardOnClick} >
            <Image fluid className='item-image m-0 bg-card-image d-flex' src={imagePath} style={{ maxWidth: '300px' }} />
            <p className='item-name text-center m-0 p-1 item-name'>{(item.name).toUpperCase()}</p>
        </Card>
    );
}

export { Item };