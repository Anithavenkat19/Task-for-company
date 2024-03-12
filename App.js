import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function SaveButton({ onClick }) {
  return (
    <div className="save-button-container">
      <button onClick={onClick}>Save segment</button>
    </div>
  );
}

function Popup({ show, onClose, onSave, schemaOptions, selectedSchema, onAddSchema, segmentName, onSegmentNameChange, newSchema, onNewSchemaChange }) {
  if (!show) return null;

  return (
    <div className="popup">
      <div className='heading_save'><h3>Saving Segment</h3></div>
      <h5>Enter the Name of the Segment</h5>
      <input
        type="text"
        placeholder="Segment Name"
        value={segmentName}
        onChange={onSegmentNameChange}
      />
      <p>To save your segment, you need to add the schemas to build the query</p>
      <div className="blue-box">
        {selectedSchema.map((schema, index) => (
          <div key={index} className="schema-item">
            <label>{schema.label}</label>
          </div>
        ))}
      </div>
      <select value={newSchema} onChange={onNewSchemaChange}>
        <option value="">Select Schema</option>
        {schemaOptions
          .filter(option => !selectedSchema.find(schema => schema.value === option.value))
          .map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
      </select>
      <br/>
      <button className='add_new_schema' onClick={onAddSchema}><a>+Add new schema</a></button>

      <div className='btns'>
        <button className='save_btn' onClick={onSave}>Save the segment</button>
        <button className='close_btn' onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}




function App() {
  const [showPopup, setShowPopup] = useState(false);
  const [segmentName, setSegmentName] = useState('');
  const [selectedSchema, setSelectedSchema] = useState([]);
  const [newSchema, setNewSchema] = useState('');
  const schemaOptions = [
    { label: 'First Name', value: 'first_name' },
    { label: 'Last Name', value: 'last_name' },
    { label: 'Gender', value: 'gender' },
    { label: 'Age', value: 'age' },
    { label: 'Account Name', value: 'account_name' },
    { label: 'City', value: 'city' },
    { label: 'State', value: 'state' }
  ];

  const addNewSchema = () => {
    if (newSchema) {
      setSelectedSchema([...selectedSchema, { label: newSchema, value: newSchema }]);
      setNewSchema('');
    }
  };

  const saveSegment = () => {
    if (segmentName && selectedSchema.length > 0) {
      const requestData = {
        segment_name: segmentName,
        schema: selectedSchema.map(schema => ({ [schema.value]: schema.label }))
      };
      axios.post('https://webhook.site/db18697e-60dd-4ce9-ba62-2dc0d4810494', requestData)
        .then(response => {
          console.log('Segment saved:', response.data);
        })
        .catch(error => {
          console.error('Error saving segment:', error);
        });
    }
  };

  return (
    <div className="App">
      <div className="blur-background">
        <SaveButton onClick={() => setShowPopup(true)} />
      </div>
      <Popup
        show={showPopup}
        onClose={() => setShowPopup(false)}
        onSave={saveSegment}
        schemaOptions={schemaOptions}
        selectedSchema={selectedSchema}
        onAddSchema={addNewSchema}
        segmentName={segmentName}
        onSegmentNameChange={e => setSegmentName(e.target.value)}
        newSchema={newSchema}
        onNewSchemaChange={e => setNewSchema(e.target.value)}
      />
    </div>
  );
}

export default App;
