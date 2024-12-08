import React from "react";

function SingleLocationPage({ match }) {
  return <div>Single Location Page for ID: {match.params.id}</div>;
}

export default SingleLocationPage;
