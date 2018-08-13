import React from 'react';

const KartItem = ({ item, count }) => {
	return (
		<div className="list-group-item">
   			<div className="d-inline-block h5">
   				{item}
   			</div>
   			<div className="d-inline-block float-right h5 text-success">
   				{count}
   			</div>
 		</div>
	);
}

export default KartItem;