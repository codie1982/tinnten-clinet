import React, { useState } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { useNavigate, } from "react-router-dom";
import { useCookies } from 'react-cookie';
import {
    Row, Col, Button,
    Dropdown, DropdownButton,
    ListGroup,
    Accordion, Card, Image
} from 'react-bootstrap'
export default function Filter({ item, }) {
    const [selectedItems, setSelectedItems] = useState([]); // Seçilen öğeleri saklamak için state

    const clearSelectedItem = (selectedItem) => {
        setSelectedItems(prevSelected =>
            prevSelected.filter(item => item.id !== selectedItem.id) // Seçilen öğeyi kaldır
        );
    };
    const handleSelect = (filterId, name) => {

        setSelectedItems(prevSelected => {
            const itemIndex = prevSelected.findIndex(item => item.id === filterId); // Seçili öğenin indeksini bul

            if (itemIndex !== -1) {
                // Eğer zaten seçiliyse kaldır
                return prevSelected.filter((_, index) => index !== itemIndex);
            } else {
                // Seçili değilse ekle
                return [...prevSelected, { id: filterId, name }]; // Yeni nesne ekle
            }
        });
    };
    return (
        <ListGroup className="mt-2 filter-section" horizontal>
            {item.productGroup.filter.map((filter) => {
                const isSelected = selectedItems.some(sl => sl.id === filter.id); // Seçili olup olmadığını kontrol et
                if (isSelected) {
                    const selectedItem = selectedItems.find(sl => sl.id === filter.id);
                    return (
                        <Button className="filter-selected-button" onClick={() => clearSelectedItem(selectedItem)} variant="primary">
                            {selectedItem.name}
                        </Button>
                    );
                } else {
                    return (
                        <DropdownButton className={`filter-dropdown-button`} id="dropdown-item-button"
                            key={filter.id}
                            title={filter.title.charAt(0).toUpperCase() + filter.title.slice(1)}>

                            {filter.options.map((name) => {
                                return (
                                    <Dropdown.Item
                                        className={`filter-dropdown-button-item`} // Seçiliyse 'selected' sınıfını ekle
                                        as="button"
                                        onClick={() => handleSelect(filter.id, name)} // Seçim yapıldığında handleSelect'i çağır
                                    >
                                        {name}
                                    </Dropdown.Item>
                                );
                            })}
                        </DropdownButton>
                    )
                }
            })}
        </ListGroup>
    )
}
