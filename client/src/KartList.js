import React from 'react';
import KartItem from './KartItem';

const KartList = ({ KartItems }) => {
	return (
		<div>
			{
				KartItems.map((item, i) => {
					console.log(KartItems);
					return (
						<KartItem
							key={i}
							item={KartItems[i]}
						/>
					);
				})
			}
		</div>
	);
}

export default KartList;