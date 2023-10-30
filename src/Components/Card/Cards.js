import React from 'react';
import { Button, Card, Dropdown, DropdownButton } from 'react-bootstrap';
import "./Card.css";

// Cards component receives various props to render a card with information.
export const Cards = ({
  title,
  text,
  key2,
  value2,
  key3,
  value3,
  key4,
  value4,
  email,
  linkText,
  linkText2,
  footerKey,
  footerValue,
  clickHandler,
  dropDownValue,
  dropDownClickHandler,
}) => {
  
  // ChangeHandler function handles the selection change in the Dropdown component.
  const ChangeHandler = (e) => {
    dropDownClickHandler(e);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: "2em", marginRight: "0.4em", marginLeft: "0.2em" }}>
      {/* Card component with various styles and sections to display information */}
      <Card style={{ width: "18em", height: "100%", display: "flex", justifyContent: "space-between" }}>
        <Card.Body style={{ display: "flex", flexDirection: "column", minHeight: "20em" }}>
          {/* Card title and subtitle */}
          <Card.Title>{title}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{email}</Card.Subtitle>
          {/* Main text content of the card */}
          <Card.Text>{text}</Card.Text>
          {/* Additional key-value pairs */}
          <Card.Text>{key2} {value2}</Card.Text>
          <Card.Text>{key3} {value3}</Card.Text>
          <Card.Text>{key4} {value4}</Card.Text>
          {/* Buttons and links at the bottom of the card */}
          <span style={{ display: "flex", flexDirection: "column", marginTop: "auto" }}>
            {linkText ? <Button variant="secondary" id='delete' onClick={clickHandler}>{linkText}</Button> : null}<br />
            <Card.Link href="#">{linkText2}</Card.Link>
            {/* Dropdown component for selecting applied students */}
            {dropDownValue ?
              <DropdownButton variant="secondary"
                menuAlign="right"
                title="Applied Students"
                id="dropdown-menu-align-right"
                onSelect={ChangeHandler}>
                {/* Mapping through dropDownValue to create Dropdown items */}
                {dropDownValue.length > 0 ? dropDownValue?.map((item, index) => (
                  <Dropdown.Item key={index} eventKey={item?.uid} >{item?.fullName}</Dropdown.Item>
                )) :
                  // Displaying a default item if dropDownValue is empty
                  <Dropdown.Item eventKey="no data">No Entries</Dropdown.Item>
                }
              </DropdownButton> : null}
          </span>
        </Card.Body>
        {/* Footer section of the card */}
        <Card.Footer>
          <small className="text-muted"> {footerKey} {footerValue}</small>
        </Card.Footer>
      </Card>
    </div>
  );
}
