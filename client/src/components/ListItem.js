import React from 'react';

function ListItem({ list_id, name, goToList }) {
  return (
    <li className="nav-item">
      <button className="nav-link text-white" onClick={() => goToList(list_id)}>{ name }</button>
    </li>
  )
}

export default ListItem;