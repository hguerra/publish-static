import React from 'react';

import Leaflet from 'components/Leaflet';

function Main() {
  return (
    <div>
      <Leaflet />
    </div>
  );
}

export default React.memo(Main);
