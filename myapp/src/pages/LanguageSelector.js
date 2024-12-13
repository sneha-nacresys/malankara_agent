import React from 'react';

function LanguageSelector({ onSelectLanguage }) {
  const handleChange = (event) => {
    onSelectLanguage(event.target.value);
  };

  return (
    <select onChange={handleChange} style={{width:"350px",border:"none",borderBottom:"1px solid #e1e1e1"}}>
        <option style={{padding:"5px"}}>Select  Language</option>
      <option value="en">English</option>
      <option value="mal">Malayalam</option>
    </select>
  );
}

export default LanguageSelector;