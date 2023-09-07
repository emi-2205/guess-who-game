import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { GuessSelector } from "./SelectorLayout"
import { React, useState } from 'react';

const GuessModal = (props) => {
    const [selectedProperty, setSelectedProperty] = useState('');
    const [selectedValue, setSelectedValue] = useState('');
    const propertiesKeys = Object.keys(props.itemlist[0].properties);
    let selectedPropertyOptions = selectedProperty
        ? [...new Set(props.itemlist.map(item => item.properties[selectedProperty]))].filter(option => option !== null)
        : [];

    const handlePropertyChange = (event) => {
        setSelectedProperty(event.target.value);
        setSelectedValue('');
    };

    const handleValueChange = (event) => {
        setSelectedValue(event.target.value);
    };

    const handleSubmit = () => {
        (selectedProperty && selectedValue) ? (props.handlepropertyguess(selectedProperty, selectedValue), props.handlesubmit()) : [];
        setSelectedProperty('');
        setSelectedValue('');
    };

    return (
        <Modal
            {...props}
            size="lg"
            dialogClassName="d-flex justify-content-center"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            style={{ zIndex: '9998' }}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter" className="p-3">
                    Choose a Property and try to Guess a Value
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='d-flex'>
                <GuessSelector text={"Property"} selectedValue={selectedProperty} onChange={handlePropertyChange} options={propertiesKeys}></GuessSelector>
                <GuessSelector text={"Value"} selectedValue={selectedValue} onChange={handleValueChange} disabled={!selectedProperty} options={selectedPropertyOptions}></GuessSelector>
            </Modal.Body>
            <Modal.Footer className='d-flex justify-content-center'>
                <Button className="btn btn-secondary close-button" type="button" onClick={props.onHide}>Close</Button>
                <Button className="guess-button" onClick={handleSubmit}>Guess</Button>
            </Modal.Footer>
        </Modal>
    );
}

export { GuessModal };