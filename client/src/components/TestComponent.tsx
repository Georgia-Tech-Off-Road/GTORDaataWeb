
import React from 'react';

// Interface for the component's props
interface TestComponentProps {
  sensorName: string;
}

const TestComponent: React.FC<TestComponentProps> = ({ sensorName }) => {
  return (
    <div>
      <h2>{sensorName}</h2>
      {/* Display additional information or functionality here based on the sensorName */}
    </div>
  );
};

export default TestComponent;
