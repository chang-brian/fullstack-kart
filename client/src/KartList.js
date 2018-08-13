import React from 'react';
import KartItem from './KartItem';

const KartList = ({ KartItems }) => {
	return (
		<div>
			{
				Object.keys(KartItems).map((item, i) => {
					return (
						<KartItem
							key={i}
							item={item}
							count={KartItems[item]}
						/>
					);
				})
			}
		</div>
	);
}

export default KartList;