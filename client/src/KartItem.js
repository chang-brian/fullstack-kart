import React from 'react';

const KartItem = ({ item, count }) => {
	return (
		<div className="item">
   			<span>{item}</span>
   			<span>{count}</span>
 		</div>
	);
}

export default KartItem;