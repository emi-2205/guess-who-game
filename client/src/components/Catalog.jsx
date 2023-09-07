import { Item } from "./Item"
import Container from 'react-bootstrap/Container';

const Catalog = ({ itemList, callback }) => {

    return (
        <div className="match-container no-borders">
            <Container fluid className="d-flex flex-row flex-wrap align-items-center justify-content-center catalog">
                {
                    itemList.map((item, index) => (
                        <Item key={index} item={item} callback={callback}></Item>
                    ))
                }
            </Container>
        </div >
    );
}

export { Catalog };